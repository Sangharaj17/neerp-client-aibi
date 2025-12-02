package com.aibi.neerp.siteexpences.controller;

import com.aibi.neerp.siteexpences.dto.SiteExpenseRequestDTO;
import com.aibi.neerp.siteexpences.dto.SiteExpenseListDTO;
import com.aibi.neerp.amc.jobs.initial.controller.AmcJobsController.JobDropdownResponse;
import com.aibi.neerp.amc.jobs.initial.service.AmcJobsService;
import com.aibi.neerp.amc.jobs.renewal.service.AmcRenewalJobsService;
import com.aibi.neerp.siteexpences.dto.SiteExpenseDashboardDTO;
import com.aibi.neerp.siteexpences.service.SiteExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/site-expenses")
@Slf4j
public class SiteExpenseController {

    private final SiteExpenseService siteExpenseService;
    private final AmcJobsService amcJobsService;
    private final AmcRenewalJobsService amcRenewalJobsService;

    @Autowired
    public SiteExpenseController(SiteExpenseService siteExpenseService,
    		                     AmcJobsService amcJobsService,
    		                     AmcRenewalJobsService amcRenewalJobsService) {
        this.siteExpenseService = siteExpenseService;
        this.amcJobsService = amcJobsService;
        this.amcRenewalJobsService = amcRenewalJobsService;
    }

    // -------------------------------------------------------------
    // 1. GET: Dashboard Data
    // -------------------------------------------------------------
    /**
     * GET /api/site-expenses/dashboard
     * Retrieves comprehensive dashboard data including:
     * - Summary cards (total, today, this month)
     * - Category-wise expenses
     * - Monthly expense trend
     * - Top 5 expensive projects
     * - Latest 10 expense entries
     */
    @GetMapping("/dashboard")
    public ResponseEntity<SiteExpenseDashboardDTO> getDashboard() {
        log.info("Request received to fetch Site Expense Dashboard");
        SiteExpenseDashboardDTO dashboard = siteExpenseService.getDashboardData();
        return ResponseEntity.ok(dashboard);
    }

    // -------------------------------------------------------------
    // 2. GET: Fetch Paginated and Searchable List
    // -------------------------------------------------------------
    /**
     * GET /api/site-expenses
     * Retrieves a paginated list of site expenses with global search and date filtering.
     */
    @GetMapping
    public ResponseEntity<Page<SiteExpenseListDTO>> getAllSiteExpenses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateSearch,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "expenseId") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        log.info("Request received to fetch Site Expenses with search='{}', date='{}'", search, dateSearch);
        Page<SiteExpenseListDTO> expenses = siteExpenseService.getAllSiteExpenses(
                search, dateSearch, page, size, sortBy, direction
        );
        return ResponseEntity.ok(expenses);
    }

    // -------------------------------------------------------------
    // 3. POST: Create a New Site Expense
    // -------------------------------------------------------------
    /**
     * POST /api/site-expenses
     * Creates a new SiteExpense entry using a DTO.
     * @param requestDTO The DTO containing the expense data (sent in the request body).
     * @return A ResponseEntity containing success message and HttpStatus.CREATED (201).
     */
    @PostMapping
    public ResponseEntity<String> createExpense(@RequestBody SiteExpenseRequestDTO requestDTO) {
        log.info("Request received to create Site Expense for Employee ID: {}", requestDTO.getEmployeeId());

        Integer newExpenseId = siteExpenseService.createSiteExpenseEntry(requestDTO);

        String successMessage = "Site Expense created successfully with ID: " + newExpenseId;

        return new ResponseEntity<>(successMessage, HttpStatus.CREATED);
    }
    
    @GetMapping("/getAllActiveJobs")
    public List<AmcJobDropdownResponse> getAllActiveJobs() {
        log.info("API Call: Get all active jobs with customer + site names");

        return amcJobsService.getAllActiveJobs().stream()
                .map(job -> new AmcJobDropdownResponse(
                        job.getJobId(),
                        job.getCustomer() != null ? job.getCustomer().getCustomerName() : "Unknown Customer",
                        job.getSite() != null ? job.getSite().getSiteName() : "Unknown Site",
                        job.getLead().getEmailId()
                ))
                .collect(Collectors.toList());
    }
    // Updated record to include customer name
    public record AmcJobDropdownResponse(Integer jobId, String customerName, String siteName , String mailId) {}

    
    @GetMapping("/getAllActiveRenewalJobs")
    public List<AmcRenewalJobDropdownResponse> getAllActiveRenewalJobs() {
        log.info("API Call: Get all active renewal jobs with customer + site names");

        return amcRenewalJobsService.getAllActiveRenewalJobs().stream()
                .map(job -> new AmcRenewalJobDropdownResponse(
                        job.getRenewalJobId(),
                        job.getCustomer() != null ? job.getCustomer().getCustomerName() : "Unknown Customer",
                        job.getSite() != null ? job.getSite().getSiteName() : "Unknown Site",
                        job.getLead().getEmailId(),
                        "renewal"
                ))
                .collect(Collectors.toList());
    }
    // Updated record to include customer name
    public record AmcRenewalJobDropdownResponse(Integer renewalJobId, String customerName, String siteName , String mailId , String renewal) {}

}