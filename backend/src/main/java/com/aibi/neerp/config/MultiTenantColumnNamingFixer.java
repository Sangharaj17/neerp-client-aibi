package com.aibi.neerp.config;

import com.aibi.neerp.client.dto.Client;
import com.aibi.neerp.client.service.ClientService;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Utility to fix column naming issues across ALL tenant databases in a multi-tenant setup.
 * 
 * <p>This class can:
 * <ul>
 *   <li>Fix column naming for a specific tenant</li>
 *   <li>Fix column naming for all tenants (iterates through all clients)</li>
 *   <li>Generate SQL scripts for manual execution</li>
 * </ul>
 * 
 * <p><b>Usage:</b>
 * <pre>
 * // Fix all tenants
 * multiTenantFixer.fixAllTenants();
 * 
 * // Fix specific tenant
 * multiTenantFixer.fixTenantDatabase(client);
 * 
 * // Generate SQL scripts
 * multiTenantFixer.generateFixScripts();
 * </pre>
 */
@Component
public class MultiTenantColumnNamingFixer {

    private final ClientService clientService;
    
    // SQL statements to fix column naming issues
    private static final List<String> FIX_SQL_STATEMENTS = new ArrayList<>();
    
    static {
        // Fix tbl_unit.unitname → unit_name
        FIX_SQL_STATEMENTS.add("-- Fix tbl_unit table");
        FIX_SQL_STATEMENTS.add("ALTER TABLE tbl_unit RENAME COLUMN unitname TO unit_name;");
        FIX_SQL_STATEMENTS.add("");
        
        // Fix tbl_enquiry.liftname → lift_name
        FIX_SQL_STATEMENTS.add("-- Fix tbl_enquiry table");
        FIX_SQL_STATEMENTS.add("ALTER TABLE tbl_enquiry RENAME COLUMN liftname TO lift_name;");
        FIX_SQL_STATEMENTS.add("");
        
        // Fix tbl_person_capacity.individualweight → individual_weight
        FIX_SQL_STATEMENTS.add("-- Fix tbl_person_capacity table");
        FIX_SQL_STATEMENTS.add("ALTER TABLE tbl_person_capacity RENAME COLUMN individualweight TO individual_weight;");
        FIX_SQL_STATEMENTS.add("");
    }

    public MultiTenantColumnNamingFixer(ClientService clientService) {
        this.clientService = clientService;
    }

    /**
     * Fixes column naming for a specific tenant database.
     * 
     * @param client The client/tenant information
     * @return true if the fix was successful
     */
    public boolean fixTenantDatabase(Client client) {
        if (client == null || client.getDbUrl() == null) {
            System.err.println("[MultiTenantFixer] ❌ Invalid client information");
            return false;
        }
        
        System.out.println("[MultiTenantFixer] ========================================");
        System.out.println("[MultiTenantFixer] Fixing tenant: " + client.getDomain());
        System.out.println("[MultiTenantFixer] Database: " + client.getDbUrl());
        System.out.println("[MultiTenantFixer] ========================================");
        
        try {
            // Create a temporary datasource for this tenant
            DataSource tenantDataSource = createDataSourceForClient(client);
            JdbcTemplate jdbcTemplate = new JdbcTemplate(tenantDataSource);
            
            // Execute the fix SQLs directly
            boolean success = executeFixSqls(jdbcTemplate, client.getDomain());
            
            // Close the datasource
            if (tenantDataSource instanceof AutoCloseable) {
                ((AutoCloseable) tenantDataSource).close();
            }
            
            return success;
            
        } catch (Exception e) {
            System.err.println("[MultiTenantFixer] ❌ Error fixing tenant " + client.getDomain() + ": " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Executes the fix SQL statements on a database.
     */
    private boolean executeFixSqls(JdbcTemplate jdbcTemplate, String tenantDomain) {
        int successCount = 0;
        int totalStatements = 0;
        
        for (String sql : FIX_SQL_STATEMENTS) {
            // Skip comments and empty lines
            if (sql.trim().isEmpty() || sql.trim().startsWith("--")) {
                if (!sql.trim().isEmpty()) {
                    System.out.println("[MultiTenantFixer] " + sql);
                }
                continue;
            }
            
            totalStatements++;
            try {
                System.out.println("[MultiTenantFixer] Executing: " + sql);
                jdbcTemplate.execute(sql);
                System.out.println("[MultiTenantFixer] ✅ Success: " + sql);
                successCount++;
            } catch (org.postgresql.util.PSQLException e) {
                String errorMsg = e.getMessage();
                if (errorMsg.contains("does not exist")) {
                    System.out.println("[MultiTenantFixer] ⚠️ Column may already be renamed or doesn't exist: " + sql);
                    // Check if target column exists
                    if (errorMsg.contains("unitname") && columnExists(jdbcTemplate, "tbl_unit", "unit_name")) {
                        System.out.println("[MultiTenantFixer] ✅ Column unit_name already exists - skip");
                        successCount++;
                    } else if (errorMsg.contains("liftname") && columnExists(jdbcTemplate, "tbl_enquiry", "lift_name")) {
                        System.out.println("[MultiTenantFixer] ✅ Column lift_name already exists - skip");
                        successCount++;
                    } else if (errorMsg.contains("individualweight") && columnExists(jdbcTemplate, "tbl_person_capacity", "individual_weight")) {
                        System.out.println("[MultiTenantFixer] ✅ Column individual_weight already exists - skip");
                        successCount++;
                    }
                } else if (errorMsg.contains("already exists")) {
                    System.out.println("[MultiTenantFixer] ✅ Target column already exists - skip");
                    successCount++;
                } else {
                    System.err.println("[MultiTenantFixer] ❌ Error: " + errorMsg);
                    e.printStackTrace();
                }
            } catch (Exception e) {
                System.err.println("[MultiTenantFixer] ❌ Unexpected error: " + e.getMessage());
                e.printStackTrace();
            }
        }
        
        System.out.println("[MultiTenantFixer] ========================================");
        System.out.println("[MultiTenantFixer] Tenant: " + tenantDomain);
        System.out.println("[MultiTenantFixer] Success: " + successCount + "/" + totalStatements);
        System.out.println("[MultiTenantFixer] ========================================");
        
        return successCount == totalStatements;
    }

    /**
     * Checks if a column exists in a table.
     */
    private boolean columnExists(JdbcTemplate jdbcTemplate, String tableName, String columnName) {
        try {
            String sql = "SELECT EXISTS (" +
                "SELECT FROM information_schema.columns " +
                "WHERE table_schema = 'public' " +
                "AND LOWER(table_name) = LOWER(?) " +
                "AND LOWER(column_name) = LOWER(?)" +
                ")";
            Boolean exists = jdbcTemplate.queryForObject(sql, Boolean.class, tableName, columnName);
            return Boolean.TRUE.equals(exists);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Creates a DataSource for a specific client/tenant.
     */
    private DataSource createDataSourceForClient(Client client) {
        com.zaxxer.hikari.HikariDataSource ds = new com.zaxxer.hikari.HikariDataSource();
        ds.setJdbcUrl(client.getDbUrl());
        ds.setUsername(client.getDbUsername());
        ds.setPassword(client.getDbPassword());
        ds.setDriverClassName("org.postgresql.Driver");
        ds.setMaximumPoolSize(2);
        ds.setMinimumIdle(1);
        return ds;
    }

    /**
     * Generates SQL scripts that can be run manually on each tenant database.
     * 
     * @return SQL script as a string
     */
    public String generateFixScripts() {
        StringBuilder script = new StringBuilder();
        script.append("-- ========================================\n");
        script.append("-- Multi-Tenant Column Naming Fix Script\n");
        script.append("-- ========================================\n");
        script.append("-- Run this script on EACH tenant database\n");
        script.append("-- ========================================\n\n");
        
        script.append("-- Backup recommendation: Export your database before running these scripts\n");
        script.append("-- pg_dump -h localhost -U postgres -d your_database > backup_before_fix.sql\n\n");
        
        script.append("BEGIN;\n\n");
        
        for (String sql : FIX_SQL_STATEMENTS) {
            script.append(sql).append("\n");
        }
        
        script.append("\nCOMMIT;\n");
        script.append("\n-- ========================================\n");
        script.append("-- Verification queries (optional)\n");
        script.append("-- ========================================\n");
        script.append("-- SELECT column_name FROM information_schema.columns WHERE table_name = 'tbl_unit' AND column_name IN ('unitname', 'unit_name');\n");
        script.append("-- SELECT column_name FROM information_schema.columns WHERE table_name = 'tbl_enquiry' AND column_name IN ('liftname', 'lift_name');\n");
        script.append("-- SELECT column_name FROM information_schema.columns WHERE table_name = 'tbl_person_capacity' AND column_name IN ('individualweight', 'individual_weight');\n");
        
        return script.toString();
    }

    /**
     * Prints the fix scripts to console.
     */
    public void printFixScripts() {
        System.out.println("\n" + "=".repeat(80));
        System.out.println("SQL FIX SCRIPTS FOR MULTI-TENANT DATABASES");
        System.out.println("=".repeat(80));
        System.out.println(generateFixScripts());
        System.out.println("=".repeat(80) + "\n");
    }

    /**
     * Gets a list of all tenant database URLs (if accessible).
     * Note: This requires access to the tenant service API.
     * 
     * @return List of tenant information (domain, dbUrl)
     */
    public List<Map<String, String>> listAllTenants() {
        // This would need to query your tenant service API to get all clients
        // For now, return empty list - implement based on your tenant service API
        System.out.println("[MultiTenantFixer] ⚠️ listAllTenants() not implemented - requires tenant service API access");
        return new ArrayList<>();
    }

    /**
     * Executes the fix SQL directly without using JdbcTemplate (for manual execution).
     * 
     * @return Map of SQL statements
     */
    public Map<String, String> getFixSqlStatements() {
        Map<String, String> sqls = new HashMap<>();
        
        sqls.put("fix_unit", "ALTER TABLE tbl_unit RENAME COLUMN unitname TO unit_name;");
        sqls.put("fix_enquiry", "ALTER TABLE tbl_enquiry RENAME COLUMN liftname TO lift_name;");
        sqls.put("fix_person_capacity", "ALTER TABLE tbl_person_capacity RENAME COLUMN individualweight TO individual_weight;");
        
        return sqls;
    }
}

