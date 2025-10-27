package com.aibi.neerp.amc.jobs.employeeActivityReport.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

// Assuming these DTOs and Entities exist in your project
import com.aibi.neerp.amc.jobs.employeeActivityReport.dto.ActivityCountsData;
import com.aibi.neerp.amc.jobs.employeeActivityReport.dto.ActivityData;
import com.aibi.neerp.amc.jobs.initial.entity.AmcJobActivity;
import com.aibi.neerp.amc.jobs.initial.repository.AmcJobActivityRepository;
import com.aibi.neerp.amc.jobs.renewal.entity.AmcRenewalJobActivity;
import com.aibi.neerp.amc.jobs.renewal.repository.AmcRenewalJobActivityRepository;

@Service
public class EmployeeActivityReportService {
    
    @Autowired private AmcJobActivityRepository amcJobActivityRepository;
    @Autowired private AmcRenewalJobActivityRepository amcRenewalJobActivityRepository;
    
    private static final LocalDate MIN_DEFAULT_DATE = LocalDate.of(2000, 1, 1);

    /**
     * Helper method to determine the actual date range, defaulting if dates are null.
     */
    private LocalDate[] getDefaultDateRange(LocalDate startDate, LocalDate endDate) {
        LocalDate maxDate = LocalDate.now();
        if (startDate == null && endDate == null) return new LocalDate[] {MIN_DEFAULT_DATE, maxDate};
        else if (startDate == null) return new LocalDate[] {MIN_DEFAULT_DATE, endDate};
        else if (endDate == null) return new LocalDate[] {startDate, maxDate};
        else return new LocalDate[] {startDate, endDate};
    }
    
    // ----------------------------------------------------------------------------------
	// --- 1. API for Activity Counts (CORRECTED IMPLEMENTATION) ---
	// ----------------------------------------------------------------------------------

    /**
     * Calculates all activity counts for a given employee and date range.
     * Uses the existing List-returning repository methods.
     */
    public ActivityCountsData calculateActivityCounts(LocalDate startDate, LocalDate endDate, Integer empId) {
        
        // 1. Determine the actual date range using the default logic
        LocalDate[] dates = getDefaultDateRange(startDate, endDate);
        LocalDate actualStartDate = dates[0];
        LocalDate actualEndDate = dates[1];

        // 2. Fetch ALL relevant entities (List, not Page) from the repositories
        // We assume the repository has the standard list method:
        // List<T> findByActivityDateBetweenAndJobActivityByEmployeeId(LocalDate startDate, LocalDate endDate, Integer employeeId);
        
        List<AmcJobActivity> nonRenewalActivities = amcJobActivityRepository
                .findByActivityDateBetweenAndJobActivityByEmployeeId(actualStartDate, actualEndDate, empId);
        
        List<AmcRenewalJobActivity> renewalActivities = amcRenewalJobActivityRepository
                .findByActivityDateBetweenAndJobActivityByEmployeeId(actualStartDate, actualEndDate, empId);
        
        // 3. Process the lists to calculate counts based on activityType
        // Note: You need a field or relationship to determine 'Service', 'Breakdown', 'Job' status.
        // Assuming activityType is determined by the entity structure or a field in JobActivityType
        
        long totalNonRenewalJobActivityCount = nonRenewalActivities.size();
        long totalRenewalJobActivityCount = renewalActivities.size();
        
        // Placeholder logic - REPLACE WITH YOUR ACTUAL BUSINESS LOGIC FOR TYPES
        long totalNonRenewalServiceActivityCount = nonRenewalActivities.stream()
                .filter(a -> "Service".equalsIgnoreCase(a.getJobActivityType().getActivityName()))
                .count();
        
        long totalRenewalServiceActivityCount = renewalActivities.stream()
                .filter(a -> "Service".equalsIgnoreCase(a.getJobActivityType().getActivityName()))
                .count();

        long totalNonRenewalBreakdownActivityRenewalCount = nonRenewalActivities.stream()
                .filter(a -> "Breakdown".equalsIgnoreCase(a.getJobActivityType().getActivityName()))
                .count();
        
        long totalRenewalBreakdownActivityCount = renewalActivities.stream()
                .filter(a -> "Breakdown".equalsIgnoreCase(a.getJobActivityType().getActivityName()))
                .count();

        // 4. Construct the final DTO
        return new ActivityCountsData(
                totalNonRenewalJobActivityCount,
                totalRenewalJobActivityCount,
                totalNonRenewalServiceActivityCount,
                totalRenewalServiceActivityCount,
                totalNonRenewalBreakdownActivityRenewalCount,
                totalRenewalBreakdownActivityCount
        );
    }

	// ----------------------------------------------------------------------------------
	// --- 2. API for Paginated Non-Renewal Data (Search Enabled) ---
	// ----------------------------------------------------------------------------------
	
	public Page<ActivityData> getNonRenewalActivityData(
			LocalDate startDate, LocalDate endDate, Integer empId, String searchTerm, Pageable nonRenewalPageable) {
		// ... (implementation remains the same as in previous response)
		LocalDate[] dates = getDefaultDateRange(startDate, endDate);
        LocalDate actualStartDate = dates[0];
        LocalDate actualEndDate = dates[1];
        
		Page<AmcJobActivity> nonRenewalActivitiesPage = 
				amcJobActivityRepository.findActivitiesWithSearch(actualStartDate, actualEndDate, empId, searchTerm, nonRenewalPageable);
		
		List<ActivityData> nonRenewalEmpActivityDatas = 
				nonRenewalActivitiesPage.getContent().stream()
				.map(this::amcJobActivityEntityToDto)
				.collect(Collectors.toList());
		
		return new PageImpl<>(nonRenewalEmpActivityDatas, nonRenewalActivitiesPage.getPageable(), nonRenewalActivitiesPage.getTotalElements());
	}

	// ----------------------------------------------------------------------------------
	// --- 3. API for Paginated Renewal Data (Search Enabled) ---
	// ----------------------------------------------------------------------------------
	
	public Page<ActivityData> getRenewalActivityData(
			LocalDate startDate, LocalDate endDate, Integer empId, String searchTerm, Pageable renewalPageable) {
            
        // ... (implementation remains the same as in previous response)
        LocalDate[] dates = getDefaultDateRange(startDate, endDate);
        LocalDate actualStartDate = dates[0];
        LocalDate actualEndDate = dates[1];
        
		Page<AmcRenewalJobActivity> renewalActivitiesPage = 
				amcRenewalJobActivityRepository.findActivitiesWithSearch(actualStartDate, actualEndDate, empId, searchTerm, renewalPageable);
		
		List<ActivityData> renewalEmpActivityDatas = 
				renewalActivitiesPage.getContent().stream()
				.map(this::amcRenewalJobActivityEntityToDto)
				.collect(Collectors.toList());
		
		return new PageImpl<>(renewalEmpActivityDatas, renewalActivitiesPage.getPageable(), renewalActivitiesPage.getTotalElements());
	}
    
    // NOTE: You must provide the mapping methods: amcJobActivityEntityToDto and amcRenewalJobActivityEntityToDto
    // And ensure the ActivityCountsData DTO exists.
    
    // Example DTO mapping placeholder (essential for compilation)
    private ActivityData amcJobActivityEntityToDto(AmcJobActivity entity) { 
        return new ActivityData(
            entity.getActivityDate(), 
            entity.getJob().getCustomer().getCustomerName(), 
            entity.getJob().getSite().getSiteName(), 
            entity.getJobActivityType().getActivityName(),
            entity.getJobActivityBy().getEmployeeName()
        ); 
    }
    
    private ActivityData amcRenewalJobActivityEntityToDto(AmcRenewalJobActivity entity) { 
         return new ActivityData(
            entity.getActivityDate(), 
            entity.getAmcRenewalJob().getCustomer().getCustomerName(), 
            entity.getAmcRenewalJob().getSite().getSiteName(), 
            entity.getJobActivityType().getActivityName(),
            entity.getJobActivityBy().getEmployeeName()
        );
    }
}