package com.aibi.neerp.leadmanagement.controller;

import com.aibi.neerp.leadmanagement.dto.EnquiryTypeRequestDto;
import com.aibi.neerp.leadmanagement.dto.EnquiryTypeResponseDto;
import com.aibi.neerp.leadmanagement.service.EnquiryTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enquiry-types")
public class EnquiryTypeController {

    @Autowired
    private EnquiryTypeService enquiryTypeService;

    @PostMapping
    public ResponseEntity<EnquiryTypeResponseDto> create(@RequestBody EnquiryTypeRequestDto dto) {
        return ResponseEntity.ok(enquiryTypeService.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<EnquiryTypeResponseDto>> getAll() {
        return ResponseEntity.ok(enquiryTypeService.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<EnquiryTypeResponseDto> update(@PathVariable Integer id,
                                                         @RequestBody EnquiryTypeRequestDto dto) {
        return ResponseEntity.ok(enquiryTypeService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        enquiryTypeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
