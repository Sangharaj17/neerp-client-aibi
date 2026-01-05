package com.aibi.neerp.amc.quatation.pdf.controller;

import com.aibi.neerp.amc.quatation.pdf.dto.*;
import com.aibi.neerp.amc.quatation.pdf.service.AmcQuotationPdfService;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/amc/quotation/pdf")
public class AmcQuotationPdfController {

    private final AmcQuotationPdfService service;

    public AmcQuotationPdfController(AmcQuotationPdfService service) {
        this.service = service;
    }

    // -----------------------------------------------------------
    // 1️⃣ CREATE HEADING
    // -----------------------------------------------------------
    @PostMapping("/headings")
    public ResponseEntity<AmcQuotationPdfHeadingsDto> createHeading(
            @RequestBody AmcQuotationPdfHeadingsDto dto) {
        try {
            return ResponseEntity.ok(service.createHeading(dto));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // -----------------------------------------------------------
    // 2️⃣ GET ALL HEADINGS
    // -----------------------------------------------------------
    @GetMapping("/headings")
    public ResponseEntity<List<AmcQuotationPdfHeadingsDto>> getAllHeadings() {
        return ResponseEntity.ok(service.getAllHeadings());
    }

    // -----------------------------------------------------------
    // 3️⃣ DELETE HEADING
    // -----------------------------------------------------------
    @DeleteMapping("/headings/{id}")
    public ResponseEntity<String> deleteHeading(@PathVariable Integer id) {
        try {
            service.deleteHeading(id);
            return ResponseEntity.ok("Heading deleted");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    // -----------------------------------------------------------
    // 4️⃣ CREATE CONTENT
    // -----------------------------------------------------------
    @PostMapping("/contents")
    public ResponseEntity<AmcQuotationPdfHeadingsContentsDto> createContent(
            @RequestBody AmcQuotationPdfHeadingsContentsDto dto) {
        try {
            return ResponseEntity.ok(service.createContent(dto));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // -----------------------------------------------------------
    // 5️⃣ GET CONTENTS FOR A HEADING
    // -----------------------------------------------------------
//    @GetMapping("/contents/{headingId}")
//    public ResponseEntity<List<AmcQuotationPdfHeadingsContentsDto>> getContentsByHeading(
//            @PathVariable Integer headingId) {
//        return ResponseEntity.ok(service.getContentsByHeading(headingId));
//    }

    // -----------------------------------------------------------
    // 6️⃣ DELETE CONTENT
    // -----------------------------------------------------------
    @DeleteMapping("/contents/{id}")
    public ResponseEntity<String> deleteContent(@PathVariable Integer id) {
        try {
            service.deleteContent(id);
            return ResponseEntity.ok("Content deleted");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    // -----------------------------------------------------------
    // 7️⃣ BULK UPDATE (Headings + Contents)
    //     - Works like Company Setting POST
    //     - Supports: add/update/delete contents
    //     - Supports: update headings
    // -----------------------------------------------------------
    @PostMapping(
        value = "/update-all",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<?> updateAll(
            @RequestBody List<AmcQuotationPdfHeadingWithContentsDto> dtoList) {

        try {
            service.updateMultipleHeadingsAndContents(dtoList);
            return ResponseEntity.ok("Updated Successfully");

        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + ex.getMessage());
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<AmcQuotationPdfHeadingWithContentsDto>> getAllHeadingsWithContents() {
        try {
            return ResponseEntity.ok(service.getAllHeadingsWithContents(""));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @GetMapping("/pdf-data")
    public ResponseEntity<AmcQuotationPdfGetData> getPdfData(
            @RequestParam(required = false) Integer amcQuatationId,
            @RequestParam(required = false) Integer revisedQuatationId,
            @RequestParam(required = false) Integer renewalQuaId,
            @RequestParam(required = false) Integer revisedRenewalId
    ) {
        AmcQuotationPdfGetData data = service
                .amcQuotationPdfGetData(amcQuatationId, revisedQuatationId, renewalQuaId, revisedRenewalId);
        return ResponseEntity.ok(data);
    }
    
    @GetMapping("/headings-with-contents")
    public ResponseEntity<List<AmcQuotationPdfHeadingWithContentsDto>> getHeadingsWithContents() {
        List<AmcQuotationPdfHeadingWithContentsDto> response =
        		service.amcQuotationPdfHeadingWithContentsDtos();

        return ResponseEntity.ok(response);
    }
    
    
    @GetMapping("/background-image")
    public ResponseEntity<String> getMainContentBackground() {
        String picture = service.getMainContentBackgroundPage();

        if (picture == null) {
            // Returns 204 No Content if the database had no record
            return ResponseEntity.noContent().build();
        }

        // Returns 200 OK with the picture string (URL or Base64)
        return ResponseEntity.ok(picture);
    }


}
