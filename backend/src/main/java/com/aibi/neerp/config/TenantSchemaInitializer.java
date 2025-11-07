package com.aibi.neerp.config;

import org.springframework.beans.factory.annotation.Autowired;
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
 * 
 * <p><b>How it works:</b></p>
 * <ul>
 *   <li><b>First-time setup:</b> Creates all tables and inserts default data (async, shows progress)</li>
 *   <li><b>Subsequent logins:</b> Only runs lightweight data initialization (idempotent, fast, synchronous)</li>
 *   <li><b>Schema updates:</b> Hibernate's 'update' mode automatically handles new tables/columns when entities are added</li>
 *   <li><b>Default data:</b> Always idempotent - checks if data exists before inserting</li>
 * </ul>
 * 
 * <p><b>For future schema updates:</b></p>
 * <ul>
 *   <li>Add new entities - Hibernate will automatically create tables on next login</li>
 *   <li>Add new default data - Add to TenantDefaultDataInitializer (it's idempotent)</li>
 *   <li>Modify existing entities - Hibernate will alter tables automatically</li>
 * </ul>
 */
@Service
public class TenantSchemaInitializer {

    private final JdbcTemplate jdbcTemplate;
    private final DataSource dataSource; // DynamicRoutingDataSource
    private final TenantDefaultDataInitializer tenantDefaultDataInitializer;
    private final InitializationStatusTracker statusTracker;

    // Cache to avoid running initializer repeatedly per tenant in the same session
    // Note: This is in-memory and resets on server restart, but isInitialized() check is persistent
    private final Set<String> initializedTenants = ConcurrentHashMap.newKeySet();

    @Autowired
    public TenantSchemaInitializer(JdbcTemplate jdbcTemplate,
                                   javax.sql.DataSource dataSource,
                                   TenantDefaultDataInitializer tenantDefaultDataInitializer,
                                   InitializationStatusTracker statusTracker) {
        this.jdbcTemplate = jdbcTemplate;
        this.dataSource = dataSource;
        this.tenantDefaultDataInitializer = tenantDefaultDataInitializer;
        this.statusTracker = statusTracker;
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
        if (tenantId == null || tenantId.isBlank()) return;
        
        // Check if schema is already initialized (persistent check, not just in-memory cache)
        boolean schemaExists = isInitialized();
        
        if (schemaExists && initializedTenants.contains(tenantId)) {
            // Schema exists and we've already processed this tenant in this session
            // Just ensure default data is up-to-date (idempotent operation)
            System.out.println("[TenantInit] Schema already initialized for tenant: " + tenantId + ", ensuring default data...");
            try {
                tenantDefaultDataInitializer.initializeDefaults();
            } catch (Exception e) {
                System.err.println("[TenantInit] Error ensuring default data: " + e.getMessage());
                // Don't throw - schema exists, data init is optional
            }
            return;
        }
        
        if (schemaExists) {
            // Schema exists but this is first check in this session
            // Run lightweight data initialization (idempotent)
            System.out.println("[TenantInit] Schema exists for tenant: " + tenantId + ", initializing default data...");
            statusTracker.updateStatus(tenantId, "initializing_data", 50, "Initializing default data...");
            try {
                tenantDefaultDataInitializer.initializeDefaults();
                statusTracker.setCompleted(tenantId);
                initializedTenants.add(tenantId);
                System.out.println("[TenantInit] Default data initialization completed for tenant: " + tenantId);
            } catch (Exception e) {
                System.err.println("[TenantInit] Error during data initialization: " + e.getMessage());
                statusTracker.setCompleted(tenantId);
                initializedTenants.add(tenantId);
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

        Properties jpaProps = new Properties();
        // Force schema update for the currently routed tenant
        // Hibernate's 'update' mode is smart - it only creates/alters what's needed
        jpaProps.put("hibernate.hbm2ddl.auto", "update");
        jpaProps.put("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
        // Quieter logs
        jpaProps.put("hibernate.show_sql", "false");
        emfBean.setJpaProperties(jpaProps);

        try {
            statusTracker.updateStatus(tenantId, "creating_tables", 30, "Creating database tables...");
            emfBean.afterPropertiesSet(); // build
            // Touch the metamodel to force initialization
            emfBean.getObject().getMetamodel().getEntities();
            
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
}


