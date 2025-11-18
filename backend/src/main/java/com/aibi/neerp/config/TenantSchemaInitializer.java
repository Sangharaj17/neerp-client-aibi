package com.aibi.neerp.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.orm.jpa.JpaProperties;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.util.Properties;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service responsible for initializing tenant database schemas and default data.
 * * <p><b>How it works:</b></p>
 * <ul>
 * <li><b>First-time setup:</b> Creates all tables and inserts default data (async, shows progress)</li>
 * <li><b>Subsequent logins:</b> Only runs lightweight data initialization (idempotent, fast, synchronous)</li>
 * <li><b>Schema updates:</b> Hibernate's 'update' mode automatically handles new tables/columns when entities are added</li>
 * <li><b>Default data:</b> Always idempotent - checks if data exists before inserting</li>
 * </ul>
 * * <p><b>For future schema updates:</b></p>
 * <ul>
 * <li>Add new entities - Hibernate will automatically create tables on next login</li>
 * <li>Add new default data - Add to TenantDefaultDataInitializer (it's idempotent)</li>
 * <li>Modify existing entities - Hibernate will alter tables automatically</li>
 * </ul>
 */
@Service
public class TenantSchemaInitializer {

    private final JdbcTemplate jdbcTemplate;
    private final DataSource dataSource; // DynamicRoutingDataSource
    private final TenantDefaultDataInitializer tenantDefaultDataInitializer;
    private final InitializationStatusTracker statusTracker;
    private final JpaProperties jpaProperties; // Can be null if not available

    // Cache to avoid running initializer repeatedly per tenant in the same session
    // Note: This is in-memory and resets on server restart, but isInitialized() check is persistent
    private final Set<String> initializedTenants = ConcurrentHashMap.newKeySet();

    @Autowired(required = false)
    public TenantSchemaInitializer(JdbcTemplate jdbcTemplate,
                                   javax.sql.DataSource dataSource,
                                   TenantDefaultDataInitializer tenantDefaultDataInitializer,
                                   InitializationStatusTracker statusTracker,
                                   JpaProperties jpaProperties) {
        this.jdbcTemplate = jdbcTemplate;
        this.dataSource = dataSource;
        this.tenantDefaultDataInitializer = tenantDefaultDataInitializer;
        this.statusTracker = statusTracker;
        this.jpaProperties = jpaProperties;
    }

    public boolean isInitialized() {
        try {
            // 1) Robust check: total user tables count
            Integer tableCount = jdbcTemplate.queryForObject(
                    "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type='BASE TABLE'",
                    Integer.class);
            if (tableCount != null && tableCount > 15) {
                return true;
            }

            // 2) Fallback: presence of a post-login domain entity table
            String existsSql = "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema='public' AND table_name = 'tbl_capacity_type')";
            Boolean exists = jdbcTemplate.queryForObject(existsSql, Boolean.class);
            return Boolean.TRUE.equals(exists);
        } catch (Exception e) {
            return false;
        }
    }

    @Transactional
    public void initializeIfRequired(String tenantId) {
        if (tenantId == null || tenantId.isBlank()) {
            System.out.println("[TenantInit] ⚠️ Tenant ID is null or blank, skipping initialization");
            return;
        }
        
        System.out.println("[TenantInit] ===== initializeIfRequired called for tenant: " + tenantId + " =====");
        
        // Check if schema is already initialized (persistent check, not just in-memory cache)
        boolean schemaExists = isInitialized();
        System.out.println("[TenantInit] Schema exists check result: " + schemaExists);
        
        if (schemaExists) {
            // Schema exists - ensure default data is initialized and check for missing tables
            System.out.println("[TenantInit] Schema exists for tenant: " + tenantId + ", ensuring default data is initialized...");
            long startTime = System.currentTimeMillis();
            
            // ALWAYS ensure new tables exist - run this FIRST and separately to ensure it happens
            System.out.println("[TenantInit] ===== Ensuring new tables exist (runs on every login) =====");
            try {
                // Ensure tbl_password_reset_otp table exists (for new password reset feature)
                ensurePasswordResetOtpTableExists();
            } catch (Exception e) {
                System.err.println("[TenantInit] ❌ Failed to ensure tbl_password_reset_otp table: " + e.getMessage());
                e.printStackTrace();
            }
            
            try {
                // Ensure tbl_password_reset_token table exists (for magic link password reset)
                ensurePasswordResetTokenTableExists();
            } catch (Exception e) {
                System.err.println("[TenantInit] ❌ Failed to ensure tbl_password_reset_token table: " + e.getMessage());
                e.printStackTrace();
            }
            
            // Now run the rest of initialization
            try {
                // Removed: Logic for columnNamingFixer.validateAndFixColumnNames();
                
                System.out.println("[TenantInit] Calling initializeDefaults() for tenant: " + tenantId);
                tenantDefaultDataInitializer.initializeDefaults();
                long duration = System.currentTimeMillis() - startTime;
                System.out.println("[TenantInit] ✅ Default data initialization completed for tenant: " + tenantId + " in " + duration + "ms");
                // Mark as completed if status was set
                if (statusTracker.getStatus(tenantId) != null) {
                    statusTracker.setCompleted(tenantId);
                }
                initializedTenants.add(tenantId);
                System.out.println("[TenantInit] Data initialization finished for tenant: " + tenantId);
            } catch (Exception e) {
                long duration = System.currentTimeMillis() - startTime;
                System.err.println("[TenantInit] ❌ Error during data initialization for tenant: " + tenantId + " after " + duration + "ms");
                System.err.println("[TenantInit] Error message: " + e.getMessage());
                e.printStackTrace(); // Print full stack trace for debugging
                // Mark as completed even on error - don't block login
                if (statusTracker.getStatus(tenantId) != null) {
                    statusTracker.setCompleted(tenantId);
                }
                initializedTenants.add(tenantId);
                System.out.println("[TenantInit] Data initialization finished (with errors) for tenant: " + tenantId);
                // Don't throw - allow login to proceed even if data init has issues
            }
            return;
        }

        // Schema doesn't exist - need to create it
        // Bootstrap a temporary EMF with ddl-auto=update for current tenant routing
        System.out.println("[TenantInit] Creating schema for tenant: " + tenantId);
        statusTracker.updateStatus(tenantId, "creating_schema", 10, "Creating database schema...");
        
        LocalContainerEntityManagerFactoryBean emfBean = new LocalContainerEntityManagerFactoryBean();
        emfBean.setDataSource(dataSource);
        emfBean.setPackagesToScan("com.aibi.neerp");
        emfBean.setJpaVendorAdapter(new HibernateJpaVendorAdapter());

        // Use Spring Boot's JPA properties as base to ensure consistency
        Properties jpaProps = new Properties();
        if (jpaProperties != null) {
            jpaProps.putAll(jpaProperties.getProperties());
        }
        
        // Override with tenant-specific settings
        // Force schema update for the currently routed tenant
        // Hibernate's 'update' mode is smart - it only creates/alters what's needed
        jpaProps.put("hibernate.hbm2ddl.auto", "update");
        jpaProps.put("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
        // Quieter logs during initialization
        jpaProps.put("hibernate.show_sql", "false");
        
        // Ensure camelCase → snake_case for all entities during schema creation
        // This matches application.properties configuration
        jpaProps.put("hibernate.physical_naming_strategy", 
            "org.hibernate.boot.model.naming.CamelCaseToUnderscoresNamingStrategy");
        
        emfBean.setJpaProperties(jpaProps);

        try {
            statusTracker.updateStatus(tenantId, "creating_tables", 30, "Creating database tables...");
            emfBean.afterPropertiesSet(); // build
            // Touch the metamodel to force initialization
            emfBean.getObject().getMetamodel().getEntities();
            
            // Removed: Logic for columnNamingFixer.validateAndFixColumnNames();
            
            statusTracker.updateStatus(tenantId, "initializing_data", 60, "Initializing default data...");
            tenantDefaultDataInitializer.initializeDefaults();
            
            statusTracker.updateStatus(tenantId, "finalizing", 90, "Finalizing setup...");
            initializedTenants.add(tenantId);
            statusTracker.setCompleted(tenantId);
            System.out.println("[TenantInit] Schema and data initialized for tenant: " + tenantId);
        } catch (Exception e) {
            System.err.println("[TenantInit] Error during initialization: " + e.getMessage());
            e.printStackTrace();
            throw e; // Re-throw for first-time initialization failures
        } finally {
            try {
                if (emfBean.getObject() != null) {
                    emfBean.getObject().close();
                }
            } catch (Exception ignore) {}
        }
    }

    /**
     * Ensures the tbl_password_reset_otp table exists in the current tenant database.
     * This is needed for the password reset OTP feature.
     * Made public so it can be called on-demand from services.
     */
    public void ensurePasswordResetOtpTableExists() {
        try {
            // Check if table exists
            String checkSql = "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema='public' AND table_name = 'tbl_password_reset_otp')";
            Boolean exists = jdbcTemplate.queryForObject(checkSql, Boolean.class);
            
            if (Boolean.TRUE.equals(exists)) {
                System.out.println("[TenantInit] ✅ tbl_password_reset_otp table already exists");
                return;
            }
            
            // Table doesn't exist - create it
            System.out.println("[TenantInit] 🔧 Creating tbl_password_reset_otp table...");
            String createTableSql = 
                "CREATE TABLE IF NOT EXISTS tbl_password_reset_otp (" +
                "id BIGSERIAL PRIMARY KEY, " +
                "email VARCHAR(255) NOT NULL, " +
                "code_hash VARCHAR(255) NOT NULL, " +
                "expires_at TIMESTAMP NOT NULL, " +
                "attempts INTEGER NOT NULL DEFAULT 0, " +
                "created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, " +
                "invalidated BOOLEAN NOT NULL DEFAULT FALSE" +
                ")";
            jdbcTemplate.execute(createTableSql);
            
            // Create index on email for faster lookups
            String createIndexSql = "CREATE INDEX IF NOT EXISTS idx_password_reset_email ON tbl_password_reset_otp(email)";
            jdbcTemplate.execute(createIndexSql);
            
            System.out.println("[TenantInit] ✅ tbl_password_reset_otp table created successfully");
        } catch (Exception e) {
            System.err.println("[TenantInit] ⚠️ Warning - Failed to ensure tbl_password_reset_otp table exists: " + e.getMessage());
            // Don't throw - allow login to proceed, Hibernate might create it later
        }
    }

    /**
     * Ensures the tbl_password_reset_token table exists in the current tenant database.
     * This is needed for the magic link password reset feature.
     * This method is called on every login to ensure new tables are created even after initial setup.
     */
    private void ensurePasswordResetTokenTableExists() {
        try {
            System.out.println("[TenantInit] Checking for tbl_password_reset_token table...");
            
            // Check if table exists
            String checkSql = "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema='public' AND table_name = 'tbl_password_reset_token')";
            Boolean exists = jdbcTemplate.queryForObject(checkSql, Boolean.class);
            
            if (Boolean.TRUE.equals(exists)) {
                System.out.println("[TenantInit] ✅ tbl_password_reset_token table already exists");
                return;
            }
            
            // Table doesn't exist - create it
            System.out.println("[TenantInit] 🔧 Creating tbl_password_reset_token table...");
            String createTableSql = 
                "CREATE TABLE IF NOT EXISTS tbl_password_reset_token (" +
                "id BIGSERIAL PRIMARY KEY, " +
                "email VARCHAR(255) NOT NULL, " +
                "token_hash VARCHAR(255) NOT NULL, " +
                "expires_at TIMESTAMP NOT NULL, " +
                "used BOOLEAN NOT NULL DEFAULT FALSE, " +
                "created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP" +
                ")";
            jdbcTemplate.execute(createTableSql);
            System.out.println("[TenantInit] ✅ Table created");
            
            // Create indexes for faster lookups
            try {
                String createEmailIndexSql = "CREATE INDEX IF NOT EXISTS idx_password_reset_token_email ON tbl_password_reset_token(email)";
                jdbcTemplate.execute(createEmailIndexSql);
                System.out.println("[TenantInit] ✅ Email index created");
            } catch (Exception e) {
                System.err.println("[TenantInit] ⚠️ Failed to create email index (may already exist): " + e.getMessage());
            }
            
            try {
                String createTokenHashIndexSql = "CREATE INDEX IF NOT EXISTS idx_password_reset_token_hash ON tbl_password_reset_token(token_hash)";
                jdbcTemplate.execute(createTokenHashIndexSql);
                System.out.println("[TenantInit] ✅ Token hash index created");
            } catch (Exception e) {
                System.err.println("[TenantInit] ⚠️ Failed to create token hash index (may already exist): " + e.getMessage());
            }
            
            System.out.println("[TenantInit] ✅ tbl_password_reset_token table created successfully");
        } catch (Exception e) {
            System.err.println("[TenantInit] ❌ ERROR - Failed to ensure tbl_password_reset_token table exists: " + e.getMessage());
            e.printStackTrace();
            // Don't throw - allow login to proceed, the controller will try to create it on-demand
            System.err.println("[TenantInit] ⚠️ Table will be created on-demand when password reset is used");
        }
    }
}