package com.aibi.neerp.amc.jobs.EmployeeDashboardData.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aibi.neerp.amc.jobs.EmployeeDashboardData.dto.ActivityDetailsData;
import com.aibi.neerp.amc.jobs.EmployeeDashboardData.dto.EmpActivitiesCountsData;
import com.aibi.neerp.amc.jobs.EmployeeDashboardData.dto.TopEmplByActivityData;
import com.aibi.neerp.amc.jobs.EmployeeDashboardData.dto.YearlyActivityData;
import com.aibi.neerp.amc.jobs.EmployeeDashboardData.service.EmplDashboardReportService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/employee-dashboard")
public class EmployeeDashboardReportController {

    @Autowired
    private EmplDashboardReportService emplDashboardReportService;

    /**
     * Get top employees by activity count within a date range
     * @param startDate - Start date for the report (format: yyyy-MM-dd)
     * @param endDate - End date for the report (format: yyyy-MM-dd)
     * @return TopEmplByActivityData containing top 10 employees
     */
    @GetMapping("/top-activity-employees")
    public ResponseEntity<TopEmplByActivityData> getTopEmployeesByActivity(
            @RequestParam("startDate")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        try {
            log.info("Fetching top employees by activity for date range: {} to {}", startDate, endDate);
            
            // Validate date parameters
            if (startDate == null || endDate == null) {
                log.warn("Invalid request: startDate or endDate is null");
                return ResponseEntity.badRequest().build();
            }

            if (startDate.isAfter(endDate)) {
                log.warn("Invalid request: startDate {} is after endDate {}", startDate, endDate);
                return ResponseEntity.badRequest().build();
            }

            TopEmplByActivityData result = emplDashboardReportService.topEmplByActivityData(startDate, endDate);
            
            if (result == null || result.getEmplActivityDatas() == null) {
                log.info("No data found for date range: {} to {}", startDate, endDate);
                return ResponseEntity.noContent().build();
            }

            log.info("Successfully retrieved {} top employees by activity", result.getEmplActivityDatas().size());
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("Error fetching top employees by activity for date range: {} to {}", startDate, endDate, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get yearly monthly activity data for the last 12 months
     * @return YearlyActivityData containing monthly activity counts
     */
    @GetMapping("/yearly-activity")
    public ResponseEntity<YearlyActivityData> getYearlyActivityData() {

        try {
            log.info("Fetching yearly activity data for the last 12 months");
            
            YearlyActivityData result = emplDashboardReportService.getYearlyActivityData();
            
            if (result == null || result.getMonthlyActivityCounts() == null) {
                log.info("No yearly activity data found");
                return ResponseEntity.noContent().build();
            }

            log.info("Successfully retrieved yearly activity data with {} months", 
                    result.getMonthlyActivityCounts().size());
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("Error fetching yearly activity data", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/employee/activities-counts")
    public ResponseEntity<List<EmpActivitiesCountsData>> getEmployeeActivitiesCounts(
            @RequestParam LocalDate fromDate,
            @RequestParam LocalDate toDate) {

        try {
            log.info("Fetching employee activities counts from {} to {}", fromDate, toDate);

            List<EmpActivitiesCountsData> result =
            		emplDashboardReportService.activitiesCountsDatas(fromDate, toDate);

            if (result == null || result.isEmpty()) {
                log.info("No employee activity data found between {} and {}", fromDate, toDate);
                return ResponseEntity.noContent().build();
            }

            log.info("Successfully retrieved employee activities counts for {} employees",
                    result.size());

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("Error fetching employee activities counts", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/employeeDetails/activities/by/empId/JobActivityType/InititalJob")
    public List<ActivityDetailsData> getActivities(
            @RequestParam LocalDate from,
            @RequestParam LocalDate to,
            @RequestParam Integer empId,
            @RequestParam String type
    ) {
        return emplDashboardReportService.emplActivityDatasForInitialJobs(
                from, to, empId, type
        );
    }

    
    @GetMapping("/employeeDetails/activities/by/empId/JobActivityType/RenewalJob")
    public List<ActivityDetailsData> getRenewalJobActivities(
            @RequestParam LocalDate from,
            @RequestParam LocalDate to,
            @RequestParam Integer empId,
            @RequestParam String type
    ) {
        return emplDashboardReportService.emplActivityDatasForRenewalJobs(
                from, to, empId, type
        );
    }





}