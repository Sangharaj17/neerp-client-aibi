package com.aibi.neerp.dashboard.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aibi.neerp.dashboard.dto.OfficeActivityRequestDto;
import com.aibi.neerp.dashboard.dto.OfficeActivityResponseDto;
import com.aibi.neerp.dashboard.service.OfficeActivityService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/office-activities")
@RequiredArgsConstructor
public class OfficeActivityController {

    private final OfficeActivityService officeActivityService;
    
    // ✅ Create API
    @PostMapping("/create")
    public OfficeActivityResponseDto createActivity(@RequestBody OfficeActivityRequestDto requestDto) {
        return officeActivityService.createOfficeActivity(requestDto);
    }

    @GetMapping("/pending")
    public Page<OfficeActivityResponseDto> getPendingActivities(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return officeActivityService.getPendingOfficeActivities(search, pageable);
    }
}

