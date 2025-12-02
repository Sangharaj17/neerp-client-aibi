package com.aibi.neerp.siteexpences.service;

import com.aibi.neerp.amc.jobs.initial.repository.AmcJobRepository;
import com.aibi.neerp.amc.jobs.renewal.repository.AmcRenewalJobRepository;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.amc.jobs.initial.entity.AmcJob;
import com.aibi.neerp.amc.jobs.renewal.entity.AmcRenewalJob;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.siteexpences.dto.SiteExpenseRequestDTO;
import com.aibi.neerp.siteexpences.dto.SiteExpenseListDTO;
import com.aibi.neerp.siteexpences.dto.SiteExpenseDashboardDTO;
import com.aibi.neerp.siteexpences.dto.SiteExpenseDashboardDTO.*;
import com.aibi.neerp.siteexpences.entity.SiteExpense;
import com.aibi.neerp.siteexpences.enums.JobType;
import com.aibi.neerp.siteexpences.mapper.SiteExpenseMapper;
import com.aibi.neerp.siteexpences.repository.SiteExpenseRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SiteExpenseService {

    private final SiteExpenseRepository siteExpenseRepository;
    private final EmployeeRepository employeeRepository;
    private final AmcJobRepository amcJobRepository;
    private final AmcRenewalJobRepository amcRenewalJobRepository;
    private final SiteExpenseMapper mapper;

    @Autowired
    public SiteExpenseService(
            SiteExpenseRepository siteExpenseRepository,
            EmployeeRepository employeeRepository,
            AmcJobRepository amcJobRepository,
            AmcRenewalJobRepository amcRenewalJobRepository,
            SiteExpenseMapper mapper
    ) {
        this.siteExpenseRepository = siteExpenseRepository;
        this.employeeRepository = employeeRepository;
        this.amcJobRepository = amcJobRepository;
        this.amcRenewalJobRepository = amcRenewalJobRepository;
        this.mapper = mapper;
    }

    // Helper method to fetch and validate required Employee entity
    private Employee getEmployee(Integer employeeId, String fieldName) {
        if (employeeId == null) {
             if ("employeeId".equals(fieldName)) {
                 throw new IllegalArgumentException("The employeeId (claimant) is mandatory.");
             }
             return null; 
        }
        return employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(fieldName + " with ID " + employeeId + " not found."));
    }

    // CREATE: Service Method to Save a New Site Expense
    @Transactional
    public Integer createSiteExpenseEntry(SiteExpenseRequestDTO requestDTO) {
        log.info("Attempting to create Site Expense entry for Employee ID: {}", requestDTO.getEmployeeId());

        if (requestDTO.getExpenseType() == null || requestDTO.getAmount() == null || 
            requestDTO.getExpenseDate() == null || requestDTO.getPaymentMethod() == null) {
            throw new IllegalArgumentException("Expense Type, Amount, Date, and Payment Method are mandatory fields.");
        }
        
        Employee employee = getEmployee(requestDTO.getEmployeeId(), "employeeId");
        Employee expenseHandoverTo = getEmployee(requestDTO.getExpenseHandoverToEmployeeId(), "expenseHandoverToEmployeeId");
        
        String jobType = "";
        
        AmcJob amcJob = null;
        if (requestDTO.getAmcJobId() != null) {
        	jobType = JobType.AMC_INITIAL.toString();
            amcJob = amcJobRepository.findById(requestDTO.getAmcJobId())
                .orElseThrow(() -> new ResourceNotFoundException("AmcJob with ID " + requestDTO.getAmcJobId() + " not found."));
        }
        
        AmcRenewalJob amcRenewalJob = null;
        if (requestDTO.getAmcRenewalJobId() != null) {
        	jobType = JobType.AMC_RENEWAL.toString();
            amcRenewalJob = amcRenewalJobRepository.findById(requestDTO.getAmcRenewalJobId())
                .orElseThrow(() -> new ResourceNotFoundException("AmcRenewalJob with ID " + requestDTO.getAmcRenewalJobId() + " not found."));
        }
        
        SiteExpense siteExpense = mapper.toEntity(
                requestDTO,
                employee,
                expenseHandoverTo,
                amcJob,
                amcRenewalJob
        );
        siteExpense.setJobType(jobType);
        
        
        return siteExpenseRepository.save(siteExpense).getExpenseId();
    }
    
    // READ: Service Method to Fetch Paginated and Searchable List
    public Page<SiteExpenseListDTO> getAllSiteExpenses(
            String search,
            LocalDate dateSearch,
            int page,
            int size,
            String sortBy,
            String direction
    ) {
        log.info("Fetching Site Expenses with search='{}', date='{}', page={}, size={}, sortBy={}, direction={}",
                search, dateSearch, page, size, sortBy, direction);

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        String dateSearchStr = dateSearch != null ? dateSearch.toString() : null;

        Page<SiteExpense> results = siteExpenseRepository.searchAllSiteExpenses(
                search == null ? "" : search,
                dateSearchStr,
                pageable
        );

        return results.map(mapper::toDto);
    }

    // ==================== DASHBOARD METHODS ====================
    
    @Transactional(readOnly = true)
    public SiteExpenseDashboardDTO getDashboardData() {
        log.info("Fetching dashboard data for site expenses");
        
        SiteExpenseDashboardDTO dashboard = new SiteExpenseDashboardDTO();
        
        // 1. Summary Cards
        dashboard.setSummaryCards(getSummaryCards());
        
        // 2. Category-wise Expenses
        dashboard.setCategoryWiseExpenses(getCategoryWiseExpenses());
        
        // 3. Monthly Expense Trend
        dashboard.setMonthlyExpenseTrend(getMonthlyExpenseTrend());
        
        // 4. Top 5 Expensive Projects
        dashboard.setTopExpensiveProjects(getTopExpensiveProjects());
        
        // 5. Latest 10 Expenses
        dashboard.setLatestExpenses(getLatestExpenses());
        
        return dashboard;
    }
    
    private SummaryCards getSummaryCards() {
        LocalDate today = LocalDate.now();
        YearMonth currentMonth = YearMonth.now();
        
        BigDecimal totalExpenses = siteExpenseRepository.getTotalExpenses();
        
        System.out.println("totalExpenses is:= "+totalExpenses);
        
        Long totalCount = siteExpenseRepository.getTotalExpenseCount();
        
        BigDecimal todayExpenses = siteExpenseRepository.getTodayExpenses(today);
        Long todayCount = siteExpenseRepository.getTodayExpenseCount(today);
        
        BigDecimal monthExpenses = siteExpenseRepository.getThisMonthExpenses(
                currentMonth.getYear(), 
                currentMonth.getMonthValue()
        );
        Long monthCount = siteExpenseRepository.getThisMonthExpenseCount(
                currentMonth.getYear(), 
                currentMonth.getMonthValue()
        );
        
        return new SummaryCards(
                totalExpenses != null ? totalExpenses : BigDecimal.ZERO,
                todayExpenses != null ? todayExpenses : BigDecimal.ZERO,
                monthExpenses != null ? monthExpenses : BigDecimal.ZERO,
                totalCount != null ? totalCount : 0L,
                todayCount != null ? todayCount : 0L,
                monthCount != null ? monthCount : 0L
        );
    }
    
    private CategoryWiseExpenses getCategoryWiseExpenses() {
        List<Object[]> results = siteExpenseRepository.getExpensesByCategory();
        
        Map<String, BigDecimal> expensesByCategory = results.stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0],
                        row -> (BigDecimal) row[1],
                        (existing, replacement) -> existing,
                        LinkedHashMap::new
                ));
        
        return new CategoryWiseExpenses(expensesByCategory);
    }
    
    private MonthlyExpenseTrend getMonthlyExpenseTrend() {
        LocalDate startDate = LocalDate.now().minusMonths(11).withDayOfMonth(1);
        List<Object[]> results = siteExpenseRepository.getMonthlyExpenseTrend(startDate);
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");
        
        List<MonthlyData> monthlyData = results.stream()
                .map(row -> {
                    String monthStr = (String) row[0]; // Format: "2024-01"
                    YearMonth yearMonth = YearMonth.parse(monthStr);
                    String formattedMonth = yearMonth.format(formatter);
                    
                    return new MonthlyData(
                            formattedMonth,
                            (BigDecimal) row[1],
                            ((Number) row[2]).longValue()
                    );
                })
                .collect(Collectors.toList());
        
        return new MonthlyExpenseTrend(monthlyData);
    }
    
    private List<TopExpensiveProject> getTopExpensiveProjects() {
        Pageable top5 = PageRequest.of(0, 5);
        
        List<TopExpensiveProject> projects = new ArrayList<>();
        
       
     // Get AMC Jobs
        List<Object[]> amcJobs = siteExpenseRepository.getTopExpensiveAmcJobs(top5);

        amcJobs.forEach(row -> {
            projects.add(new TopExpensiveProject(
                    (String) row[0],                    // customerName
                    (String) row[1],                    // jobType
                    (String) row[2],                    // siteName
                    (BigDecimal) row[3],                // totalExpense
                    ((Number) row[4]).longValue()       // expenseCount
            ));
        });

        
        List<Object[]> amcRenewalJobs = siteExpenseRepository.getTopExpensiveAmcRenewalJobs(top5);

        amcRenewalJobs.forEach(row -> {
            projects.add(new TopExpensiveProject(
                    (String) row[0],                    // customerName
                    (String) row[1],                    // jobType ("AMC_RENEWAL_JOB")
                    (String) row[2],                    // siteName
                    (BigDecimal) row[3],                // totalExpense
                    ((Number) row[4]).longValue()       // expenseCount
            ));
        });

        
        // Sort by total expense and take top 5
        return projects.stream()
                .sorted(Comparator.comparing(TopExpensiveProject::getTotalExpense).reversed())
                .limit(5)
                .collect(Collectors.toList());
    }
    
    private List<SiteExpenseListDTO> getLatestExpenses() {
        Pageable top10 = PageRequest.of(0, 10);
        List<SiteExpense> latestExpenses = siteExpenseRepository.getLatestExpenses(top10);
        
        return latestExpenses.stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }
}