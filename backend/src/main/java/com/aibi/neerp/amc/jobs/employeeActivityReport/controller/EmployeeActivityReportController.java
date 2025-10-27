package com.aibi.neerp.amc.jobs.employeeActivityReport.controller;

import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aibi.neerp.amc.jobs.employeeActivityReport.dto.ActivityCountsData;
import com.aibi.neerp.amc.jobs.employeeActivityReport.dto.ActivityData;
import com.aibi.neerp.amc.jobs.employeeActivityReport.service.EmployeeActivityReportService;

@RestController
@RequestMapping("/api/jobs/employeeActivityReports/employee-activity")
public class EmployeeActivityReportController {

    @Autowired
    private EmployeeActivityReportService reportService;

    // API 1: Get Activity Counts (No change)
    @GetMapping("/counts")
    public ResponseEntity<ActivityCountsData> getActivityCounts(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam Integer empId) {

        ActivityCountsData counts = reportService.calculateActivityCounts(startDate, endDate, empId);
        return ResponseEntity.ok(counts);
    }

    // API 2: Get Paginated Non-Renewal Data (UPDATED for searchTerm)
    @GetMapping("/non-renewal-data")
    public ResponseEntity<Page<ActivityData>> getNonRenewalActivityData(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam Integer empId,
            @RequestParam(required = false) String searchTerm, // <-- NEW SEARCH PARAMETER
            Pageable pageable) { 

        Page<ActivityData> dataPage = reportService.getNonRenewalActivityData(startDate, endDate, empId, searchTerm, pageable);
        return ResponseEntity.ok(dataPage);
    }

    // API 3: Get Paginated Renewal Data (UPDATED for searchTerm)
    @GetMapping("/renewal-data")
    public ResponseEntity<Page<ActivityData>> getRenewalActivityData(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam Integer empId,
            @RequestParam(required = false) String searchTerm, // <-- NEW SEARCH PARAMETER
            Pageable pageable) { 

        Page<ActivityData> dataPage = reportService.getRenewalActivityData(startDate, endDate, empId, searchTerm, pageable);
        return ResponseEntity.ok(dataPage);
    }
}