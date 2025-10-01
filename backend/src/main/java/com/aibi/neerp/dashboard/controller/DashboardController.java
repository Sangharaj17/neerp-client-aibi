package com.aibi.neerp.dashboard.controller;

import com.aibi.neerp.amc.jobs.initial.dto.AmcJobsServiceEnginnersServicesReport;
import com.aibi.neerp.amc.jobs.initial.dto.AmcServiceAlertData;
import com.aibi.neerp.amc.jobs.initial.dto.BreakdownTodoResponseDto;
import com.aibi.neerp.amc.jobs.initial.service.AmcJobsService;
import com.aibi.neerp.amc.jobs.initial.service.BreakdownTodoService;
import com.aibi.neerp.customer.dto.CustomerSiteTodoResponseDto;
import com.aibi.neerp.customer.service.CustomerSiteTodoService;
import com.aibi.neerp.dashboard.dto.DashboardCountsData;
import com.aibi.neerp.dashboard.dto.DashboardTodoDto;
import com.aibi.neerp.dashboard.dto.OfficeActivityResponseDto;
import com.aibi.neerp.dashboard.service.DashboardService;
import com.aibi.neerp.dashboard.service.OfficeActivityService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final CustomerSiteTodoService todoService;
    private final AmcJobsService amcJobsService;
    private final BreakdownTodoService breakdownTodoService;
    private final OfficeActivityService officeActivityService;

    @GetMapping("/leadsTodoList")
    public Page<DashboardTodoDto> getTodos(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return dashboardService.getDashboardTodoList(search, page, size);
    }

    @GetMapping("/leads-missed-no-activity")
    public Page<DashboardTodoDto> getMissedTodosWithoutActivity(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return dashboardService.getMissedTodoListWithoutActivity(search, page, size);
    }

    @GetMapping("/customerSiteNotPerformedTodos")
    public Page<CustomerSiteTodoResponseDto> getUpcomingTodos(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return todoService.getUpcomingTodos(search, createPageable(page, size));
    }

    @GetMapping("/customerSiteMissedActivities")
    public Page<CustomerSiteTodoResponseDto> getMissedTodos(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return todoService.getMissedTodos(search, createPageable(page, size));
    }

    @GetMapping("/amc-service-alerts")
    public Page<AmcServiceAlertData> getAmcServiceAlerts(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "jobId") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        return amcJobsService.serviceAlertDatas(search, page, size, sortBy, direction);
    }

    @GetMapping("/service-engineers-report")
    public ResponseEntity<AmcJobsServiceEnginnersServicesReport> getAmcJobsServiceEngineersReport() {
        return ResponseEntity.ok(amcJobsService.amcJobsServiceEnginnersServicesReport());
    }

    @GetMapping("/breakdown/notPerformed")
    public Page<BreakdownTodoResponseDto> getUpcomingBreakdownTodos(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return breakdownTodoService.getUpcomingBreakdownTodos(search, createPageable(page, size));
    }

    @GetMapping("/breakdown/missed")
    public Page<BreakdownTodoResponseDto> getMissedBreakdownTodos(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return breakdownTodoService.getMissedBreakdownTodos(search, createPageable(page, size));
    }

    @GetMapping("/pendingOfficeActivities")
    public Page<OfficeActivityResponseDto> getPendingActivities(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return officeActivityService.getPendingOfficeActivities(search, createPageable(page, size));
    }

    @GetMapping("/counts")
    public ResponseEntity<DashboardCountsData> getDashboardCounts() {
        return ResponseEntity.ok(dashboardService.getDashboardCountsData());
    }

    // ✅ Small helper method to avoid repeating PageRequest.of everywhere
    private Pageable createPageable(int page, int size) {
        return PageRequest.of(page, size);
    }
}
