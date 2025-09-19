package com.aibi.neerp.customer.controller;

import com.aibi.neerp.customer.dto.SiteDto;
import com.aibi.neerp.customer.service.SiteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sites")
@RequiredArgsConstructor
public class SiteController {

    private final SiteService siteService;

    // ✅ Create or Update Site
    @PostMapping
    public ResponseEntity<SiteDto> createSite(@Valid @RequestBody SiteDto siteDto) {
        SiteDto saved = siteService.saveSite(siteDto);
        return ResponseEntity.ok(saved);
    }

    // ✅ Get All Sites
    @GetMapping
    public ResponseEntity<List<SiteDto>> getAllSites() {
        return ResponseEntity.ok(siteService.getAllSites());
    }

    // ✅ Get Site by ID
    @GetMapping("/{id}")
    public ResponseEntity<SiteDto> getSiteById(@PathVariable Integer id) {
        return ResponseEntity.ok(siteService.getSiteById(id));
    }

    // ✅ Delete Site
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSite(@PathVariable Integer id) {
        siteService.deleteSite(id);
        return ResponseEntity.noContent().build();
    }
}
