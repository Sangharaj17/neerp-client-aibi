package com.aibi.neerp.amc.quatation.pdf.controller;

import com.aibi.neerp.amc.quatation.pdf.dto.CssStyleDto;
import com.aibi.neerp.amc.quatation.pdf.service.CssStyleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/css-styles")
public class CssStyleController {

    @Autowired
    private CssStyleService cssStyleService;

    @PostMapping
    public ResponseEntity<CssStyleDto> createCssStyle(@RequestBody CssStyleDto dto) {
        CssStyleDto created = cssStyleService.createCssStyle(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CssStyleDto> getCssStyleById(@PathVariable Integer id) {
        CssStyleDto dto = cssStyleService.getCssStyleById(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<List<CssStyleDto>> getAllCssStyles() {
        List<CssStyleDto> list = cssStyleService.getAllCssStyles();
        return ResponseEntity.ok(list);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CssStyleDto> updateCssStyle(@PathVariable Integer id, @RequestBody CssStyleDto dto) {
        CssStyleDto updated = cssStyleService.updateCssStyle(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCssStyle(@PathVariable Integer id) {
        cssStyleService.deleteCssStyle(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Get CSS styles by AMC Quotation PDF Heading ID
     */
    @GetMapping("/by-heading/{headingId}")
    public ResponseEntity<CssStyleDto> getCssStylesByHeadingId(
            @PathVariable Integer headingId) {

        CssStyleDto style =
                cssStyleService.getCssStyleByHeadingId(headingId);

        return ResponseEntity.ok(style);
    }
    
    @PutMapping("/by-heading/{headingId}")
    public ResponseEntity<CssStyleDto> updateCssStyleByHeadingId(
            @PathVariable Integer headingId,
            @RequestBody CssStyleDto dto) {

        CssStyleDto updated =
                cssStyleService.updateCssStyleByHeadingId(headingId, dto);

        return ResponseEntity.ok(updated);
    }

    
    @GetMapping("/by-heading-name/{name}")
    public ResponseEntity<CssStyleDto> getCssStylesByHeadingName(
            @PathVariable String name) {
        
        // Example call: /by-heading-name/MAIN CONTENT BACKGROUND PAGE
        CssStyleDto style = cssStyleService.getCssStyleByHeadingName(name);
        
        return ResponseEntity.ok(style);
    }
    
    
}