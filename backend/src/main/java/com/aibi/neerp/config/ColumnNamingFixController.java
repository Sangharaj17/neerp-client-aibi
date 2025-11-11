package com.aibi.neerp.config;

import com.aibi.neerp.client.dto.Client;
import com.aibi.neerp.client.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller to fix column naming issues across tenant databases.
 * 
 * <p><b>Warning:</b> This should be secured in production! Add authentication/authorization.
 */
@RestController
@RequestMapping("/api/admin/column-fix")
public class ColumnNamingFixController {

    @Autowired
    private MultiTenantColumnNamingFixer multiTenantFixer;
    
    @Autowired
    private ClientService clientService;

    /**
     * Generate SQL scripts for manual execution.
     */
    @GetMapping("/scripts")
    public ResponseEntity<Map<String, String>> getFixScripts() {
        Map<String, String> response = new HashMap<>();
        response.put("sqlScript", multiTenantFixer.generateFixScripts());
        response.put("message", "Copy and run this SQL script on each tenant database");
        return ResponseEntity.ok(response);
    }

    /**
     * Get individual SQL statements.
     */
    @GetMapping("/sql-statements")
    public ResponseEntity<Map<String, String>> getSqlStatements() {
        return ResponseEntity.ok(multiTenantFixer.getFixSqlStatements());
    }

    /**
     * Fix column naming for a specific tenant by domain.
     */
    @PostMapping("/fix-tenant/{domain}")
    public ResponseEntity<Map<String, Object>> fixTenant(@PathVariable String domain) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Client client = clientService.getClientByDomain(domain);
            if (client == null) {
                response.put("success", false);
                response.put("message", "Tenant not found: " + domain);
                return ResponseEntity.badRequest().body(response);
            }
            
            boolean success = multiTenantFixer.fixTenantDatabase(client);
            
            response.put("success", success);
            response.put("domain", domain);
            response.put("message", success ? "Column naming fixed successfully" : "Some columns may have failed to fix");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            response.put("error", e.getClass().getName());
            return ResponseEntity.status(500).body(response);
        }
    }
}


