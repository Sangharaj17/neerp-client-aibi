package com.aibi.neerp.config;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * Global utility to detect and fix database column naming inconsistencies.
 * 
 * <p><b>Goal:</b> Ensure Hibernate's CamelCaseToUnderscoresNamingStrategy works correctly
 * by renaming database columns from camelCase (e.g., "unitname") to snake_case (e.g., "unit_name").
 * 
 * <p><b>How it works:</b>
 * <ul>
 *   <li>Detects columns that don't match Hibernate's naming strategy expectations</li>
 *   <li>Automatically renames columns from camelCase to snake_case</li>
 *   <li>Ensures Java field names (camelCase) automatically map to database columns (snake_case)</li>
 *   <li>Allows removal of explicit @Column(name = "...") annotations</li>
 * </ul>
 * 
 * <p><b>Example:</b>
 * <ul>
 *   <li>Java field: <code>private String unitName;</code></li>
 *   <li>Hibernate expects: <code>unit_name</code> (via CamelCaseToUnderscoresNamingStrategy)</li>
 *   <li>Old DB column: <code>unitname</code> (incorrect)</li>
 *   <li>After fix: <code>unit_name</code> (correct - matches Hibernate's expectation)</li>
 * </ul>
 * 
 * <p><b>Safety:</b> Column renaming is safe and preserves all data. The rename operation
 * is atomic in PostgreSQL.
 */
@Component
public class DatabaseColumnNamingFixer {

    private final JdbcTemplate jdbcTemplate;
    
    // Mapping of known column naming issues: (table_name, hibernate_expected_name) -> actual_database_name
    private static final Map<String, Map<String, String>> KNOWN_COLUMN_MAPPINGS = new HashMap<>();
    
    static {
        // tbl_unit table mappings
        Map<String, String> unitMappings = new HashMap<>();
        unitMappings.put("unit_name", "unitname");  // Hibernate expects unit_name, DB has unitname
        KNOWN_COLUMN_MAPPINGS.put("tbl_unit", unitMappings);
        
        // tbl_enquiry table mappings
        Map<String, String> enquiryMappings = new HashMap<>();
        enquiryMappings.put("lift_name", "liftname");  // Hibernate expects lift_name, DB has liftname
        KNOWN_COLUMN_MAPPINGS.put("tbl_enquiry", enquiryMappings);
        
        // tbl_person_capacity table mappings
        Map<String, String> personCapacityMappings = new HashMap<>();
        personCapacityMappings.put("individual_weight", "individualweight");  // Already has explicit mapping, but document it
        KNOWN_COLUMN_MAPPINGS.put("tbl_person_capacity", personCapacityMappings);
    }

    public DatabaseColumnNamingFixer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Validates and fixes column naming issues for all known tables.
     * This method should be called during database initialization.
     * 
     * @return true if all validations passed or fixes were applied successfully
     */
    @Transactional
    public boolean validateAndFixColumnNames() {
        System.out.println("[ColumnNamingFixer] ===== Starting column naming validation and fix =====");
        boolean allFixed = true;
        
        try {
            for (Map.Entry<String, Map<String, String>> tableEntry : KNOWN_COLUMN_MAPPINGS.entrySet()) {
                String tableName = tableEntry.getKey();
                Map<String, String> columnMappings = tableEntry.getValue();
                
                if (!tableExists(tableName)) {
                    System.out.println("[ColumnNamingFixer] ⚠️ Table " + tableName + " does not exist, skipping...");
                    continue;
                }
                
                for (Map.Entry<String, String> columnEntry : columnMappings.entrySet()) {
                    String hibernateExpectedName = columnEntry.getKey();
                    String actualDbColumnName = columnEntry.getValue();
                    
                    boolean fixed = validateAndFixColumn(tableName, hibernateExpectedName, actualDbColumnName);
                    if (!fixed) {
                        allFixed = false;
                    }
                }
            }
            
            if (allFixed) {
                System.out.println("[ColumnNamingFixer] ✅ All column naming issues validated and fixed successfully");
            } else {
                System.out.println("[ColumnNamingFixer] ⚠️ Some column naming issues could not be fixed automatically");
            }
            
        } catch (Exception e) {
            System.err.println("[ColumnNamingFixer] ❌ Error during column naming validation: " + e.getMessage());
            e.printStackTrace();
            allFixed = false;
        }
        
        System.out.println("[ColumnNamingFixer] ===== Column naming validation complete =====");
        return allFixed;
    }

    /**
     * Validates a specific column and fixes it by renaming to match Hibernate's naming strategy.
     * 
     * <p><b>Goal:</b> Ensure database columns use snake_case so Hibernate's CamelCaseToUnderscoresNamingStrategy
     * works automatically without needing explicit @Column annotations.
     * 
     * <p><b>Strategy:</b>
     * <ul>
     *   <li>If Hibernate-expected column (snake_case) exists → Perfect! Nothing to do.</li>
     *   <li>If old column (camelCase) exists but not snake_case → Rename it to snake_case</li>
     *   <li>If neither exists → Hibernate will create it with correct name</li>
     *   <li>If both exist → Log warning (data inconsistency)</li>
     * </ul>
     * 
     * @param tableName The table name
     * @param hibernateExpectedName The column name Hibernate expects (snake_case) via naming strategy
     * @param actualDbColumnName The old column name in the database (camelCase without underscores)
     * @return true if the column exists with the correct name or was successfully renamed
     */
    private boolean validateAndFixColumn(String tableName, String hibernateExpectedName, String actualDbColumnName) {
        try {
            // Check if the Hibernate-expected column (snake_case) exists
            boolean hibernateColumnExists = columnExists(tableName, hibernateExpectedName);
            
            // Check if the old column (camelCase) exists
            boolean oldColumnExists = columnExists(tableName, actualDbColumnName);
            
            if (hibernateColumnExists) {
                // Perfect! Column already has the correct snake_case name
                System.out.println("[ColumnNamingFixer] ✅ Table " + tableName + 
                    ": Column '" + hibernateExpectedName + "' exists (matches Hibernate naming strategy)");
                
                // If both columns exist, that's unusual - log a warning
                if (oldColumnExists) {
                    System.out.println("[ColumnNamingFixer] ⚠️ Warning: Table " + tableName + 
                        ": Both '" + actualDbColumnName + "' and '" + hibernateExpectedName + "' exist!");
                    System.out.println("[ColumnNamingFixer] 💡 Consider dropping the old column '" + actualDbColumnName + "'");
                }
                return true;
            }
            
            if (oldColumnExists && !hibernateColumnExists) {
                // Old column exists but not the snake_case version - rename it!
                System.out.println("[ColumnNamingFixer] 🔧 Table " + tableName + 
                    ": Renaming column '" + actualDbColumnName + "' → '" + hibernateExpectedName + "'");
                return renameColumn(tableName, actualDbColumnName, hibernateExpectedName);
            }
            
            // Neither column exists - Hibernate will create it with the correct name
            System.out.println("[ColumnNamingFixer] ℹ️ Table " + tableName + 
                ": Column '" + hibernateExpectedName + "' does not exist (will be created by Hibernate with correct name)");
            return true;
            
        } catch (Exception e) {
            System.err.println("[ColumnNamingFixer] ❌ Error validating/fixing column " + tableName + 
                "." + actualDbColumnName + ": " + e.getMessage());
            return false;
        }
    }

    /**
     * Renames a column in the database.
     * This is a safe operation that preserves all data - it's just a metadata change in PostgreSQL.
     * 
     * @param tableName The table name
     * @param oldColumnName The current column name (camelCase)
     * @param newColumnName The new column name (snake_case)
     * @return true if the rename was successful
     */
    private boolean renameColumn(String tableName, String oldColumnName, String newColumnName) {
        try {
            // PostgreSQL stores unquoted identifiers in lowercase
            // Hibernate's naming strategy generates lowercase snake_case (e.g., "unit_name")
            // So we don't need to quote the new column name - it will be stored as lowercase anyway
            // We quote the table and old column name to handle any case-sensitivity issues
            
            // For the new column name, we use it unquoted since it's already lowercase
            // and matches what Hibernate expects (lowercase snake_case)
            String sql = String.format(
                "ALTER TABLE %s RENAME COLUMN %s TO %s",
                quoteIdentifier(tableName),
                quoteIdentifier(oldColumnName),
                newColumnName.toLowerCase()  // Ensure lowercase, don't quote (standard PostgreSQL convention)
            );
            
            System.out.println("[ColumnNamingFixer] Executing: " + sql);
            jdbcTemplate.execute(sql);
            
            System.out.println("[ColumnNamingFixer] ✅ Successfully renamed column " + tableName + 
                "." + oldColumnName + " → " + newColumnName + " (data preserved)");
            
            // Verify the rename was successful
            boolean newColumnExists = columnExists(tableName, newColumnName);
            boolean oldColumnStillExists = columnExists(tableName, oldColumnName);
            
            if (newColumnExists && !oldColumnStillExists) {
                System.out.println("[ColumnNamingFixer] ✅ Verified: Column rename confirmed");
                return true;
            } else {
                System.err.println("[ColumnNamingFixer] ⚠️ Warning: Column rename may not have completed correctly");
                return false;
            }
            
        } catch (Exception e) {
            System.err.println("[ColumnNamingFixer] ❌ Failed to rename column " + tableName + 
                "." + oldColumnName + " to " + newColumnName);
            System.err.println("[ColumnNamingFixer] Error: " + e.getMessage());
            System.err.println("[ColumnNamingFixer] 💡 This may happen if:");
            System.err.println("[ColumnNamingFixer]   1. Column doesn't exist (already renamed?)");
            System.err.println("[ColumnNamingFixer]   2. New column name already exists");
            System.err.println("[ColumnNamingFixer]   3. Insufficient database permissions");
            System.err.println("[ColumnNamingFixer]   4. Column is referenced by views or constraints");
            
            // Don't throw - allow initialization to continue
            // If the column already has the correct name, Hibernate will work fine
            return false;
        }
    }

    /**
     * Checks if a table exists in the database.
     * PostgreSQL table names are case-insensitive unless quoted.
     */
    private boolean tableExists(String tableName) {
        try {
            String sql = "SELECT EXISTS (" +
                "SELECT FROM information_schema.tables " +
                "WHERE table_schema = 'public' AND LOWER(table_name) = LOWER(?)" +
                ")";
            Boolean exists = jdbcTemplate.queryForObject(sql, Boolean.class, tableName);
            return Boolean.TRUE.equals(exists);
        } catch (Exception e) {
            System.err.println("[ColumnNamingFixer] Error checking if table exists: " + e.getMessage());
            return false;
        }
    }

    /**
     * Checks if a column exists in a table.
     * PostgreSQL column names are case-insensitive unless quoted, so we check both lowercase and original case.
     */
    private boolean columnExists(String tableName, String columnName) {
        try {
            // PostgreSQL stores unquoted identifiers in lowercase, so we check lowercase
            String sql = "SELECT EXISTS (" +
                "SELECT FROM information_schema.columns " +
                "WHERE table_schema = 'public' " +
                "AND LOWER(table_name) = LOWER(?) " +
                "AND LOWER(column_name) = LOWER(?)" +
                ")";
            Boolean exists = jdbcTemplate.queryForObject(sql, Boolean.class, 
                tableName, columnName);
            return Boolean.TRUE.equals(exists);
        } catch (Exception e) {
            System.err.println("[ColumnNamingFixer] Error checking if column exists: " + e.getMessage());
            return false;
        }
    }

    /**
     * Quotes an identifier for safe use in SQL (PostgreSQL).
     * PostgreSQL column names are case-insensitive unless quoted, but we quote to be explicit.
     */
    private String quoteIdentifier(String identifier) {
        // PostgreSQL identifiers are case-insensitive unless quoted
        // We quote them to preserve case and avoid any ambiguity
        // Escape any double quotes in the identifier name
        return "\"" + identifier.replace("\"", "\"\"") + "\"";
    }

    /**
     * Validates all column names without making changes (dry-run mode).
     * Useful for checking what would be fixed without actually making changes.
     * 
     * @return A map of table names to lists of column naming issues found
     */
    public Map<String, List<String>> validateColumnNamesDryRun() {
        Map<String, List<String>> issues = new HashMap<>();
        
        System.out.println("[ColumnNamingFixer] ===== Dry-run: Validating column names =====");
        
        for (Map.Entry<String, Map<String, String>> tableEntry : KNOWN_COLUMN_MAPPINGS.entrySet()) {
            String tableName = tableEntry.getKey();
            Map<String, String> columnMappings = tableEntry.getValue();
            
            if (!tableExists(tableName)) {
                continue;
            }
            
            List<String> tableIssues = new ArrayList<>();
            
            for (Map.Entry<String, String> columnEntry : columnMappings.entrySet()) {
                String hibernateExpectedName = columnEntry.getKey();
                String actualDbColumnName = columnEntry.getValue();
                
                boolean hibernateColumnExists = columnExists(tableName, hibernateExpectedName);
                boolean actualColumnExists = columnExists(tableName, actualDbColumnName);
                
                if (!hibernateColumnExists && actualColumnExists) {
                    String issue = String.format(
                        "Column '%s' exists but Hibernate expects '%s'",
                        actualDbColumnName, hibernateExpectedName
                    );
                    tableIssues.add(issue);
                    System.out.println("[ColumnNamingFixer] ⚠️ " + tableName + ": " + issue);
                }
            }
            
            if (!tableIssues.isEmpty()) {
                issues.put(tableName, tableIssues);
            }
        }
        
        if (issues.isEmpty()) {
            System.out.println("[ColumnNamingFixer] ✅ No column naming issues found");
        }
        
        return issues;
    }

    /**
     * Adds a custom column mapping for a table.
     * This allows extending the fixer with additional mappings if needed.
     * 
     * @param tableName The table name
     * @param hibernateExpectedName The column name Hibernate expects
     * @param actualDbColumnName The actual column name in the database
     */
    public static void addColumnMapping(String tableName, String hibernateExpectedName, String actualDbColumnName) {
        KNOWN_COLUMN_MAPPINGS
            .computeIfAbsent(tableName, k -> new HashMap<>())
            .put(hibernateExpectedName, actualDbColumnName);
    }
}

