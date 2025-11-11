// src/main/java/com/aibi/neerp/settings/controller/CompanySettingController.java

package com.aibi.neerp.settings.controller;

import com.aibi.neerp.settings.dto.CompanySettingDTO;
import com.aibi.neerp.settings.service.CompanySettingService;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/settings")
public class CompanySettingController {

    private final CompanySettingService service;

    public CompanySettingController(CompanySettingService service) {
        this.service = service;
    }

    /**
     * Retrieves company settings by the reference name (e.g., "SMASH").
     */
    @GetMapping("/{refName}")
    public ResponseEntity<CompanySettingDTO> getSettings(@PathVariable String refName) {
        return service.getCompanySettings(refName)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Saves or updates company settings + optional logo in one request.
     */
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CompanySettingDTO> saveSettings(@RequestBody CompanySettingDTO settingsDTO) {
        try {
            CompanySettingDTO saved = service.saveInitialSettings(settingsDTO);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    
    @GetMapping("/{refName}/logo")
    public ResponseEntity<Map<String, String>> getLogo(@PathVariable String refName) {
        String logoBase64 = service.getCompanyLogo(refName);

        if (logoBase64 == null || logoBase64.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Map<String, String> response = new HashMap<>();
        response.put("logo", logoBase64);

        return ResponseEntity.ok(response);
    }
    
    
    
}