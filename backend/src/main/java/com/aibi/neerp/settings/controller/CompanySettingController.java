// src/main/java/com/aibi/neerp/settings/controller/CompanySettingController.java

package com.aibi.neerp.settings.controller;

import com.aibi.neerp.settings.dto.CompanySettingDTO;
import com.aibi.neerp.settings.service.CompanySettingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
     * Saves or updates the company settings.
     */
    @PostMapping
    public ResponseEntity<CompanySettingDTO> saveSettings(@RequestBody CompanySettingDTO settingsDTO) {
        CompanySettingDTO savedSettings = service.saveInitialSettings(settingsDTO);
        return ResponseEntity.ok(savedSettings);
    }
}