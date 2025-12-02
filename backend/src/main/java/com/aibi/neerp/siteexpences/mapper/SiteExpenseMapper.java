package com.aibi.neerp.siteexpences.mapper;

import com.aibi.neerp.amc.jobs.initial.entity.AmcJob;
import com.aibi.neerp.amc.jobs.renewal.entity.AmcRenewalJob;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.siteexpences.dto.SiteExpenseRequestDTO;
import com.aibi.neerp.siteexpences.dto.SiteExpenseListDTO; // NEW Import
import com.aibi.neerp.siteexpences.entity.SiteExpense;
import org.springframework.stereotype.Component;

/**
 * Maps SiteExpenseRequestDTO to SiteExpense entity (for creation)
 * and SiteExpense entity to SiteExpenseListDTO (for listing).
 */
@Component
public class SiteExpenseMapper {

    // -------------------------------------------------------------
    // CREATE: Entity to DTO (Unchanged)
    // -------------------------------------------------------------
    public SiteExpense toEntity(
            SiteExpenseRequestDTO dto,
            Employee employee,
            Employee expenseHandoverTo,
            AmcJob amcJob,
            AmcRenewalJob amcRenewalJob) {
        
        return SiteExpense.builder()
                .expenseType(dto.getExpenseType())
                .amount(dto.getAmount())
                .expenseDate(dto.getExpenseDate())
                .paymentMethod(dto.getPaymentMethod())
                .narration(dto.getNarration())
                
                .employee(employee) 
                .expenseHandoverTo(expenseHandoverTo)
                .amcJob(amcJob)
                .amcRenewalJob(amcRenewalJob)
                
                .build();
    }

    // -------------------------------------------------------------
    // READ: Entity to List DTO (NEW Method)
    // -------------------------------------------------------------
    /**
     * Maps the SiteExpense Entity to the List DTO, resolving complex nested data 
     * like Site Name and Employee Name for display.
     * * @param entity The SiteExpense entity, potentially with lazy-loaded data.
     * @return The flattened SiteExpenseListDTO.
     */
    public SiteExpenseListDTO toDto(SiteExpense entity) {
        
        // Resolve the Site Name and Job Type (Requires navigating the object graph)
        String siteName = null;
//        String jobType = null;
//        
//        // Check AMC Job first
//        if (entity.getAmcJob() != null && entity.getAmcJob().getSite() != null) {
//            siteName = entity.getAmcJob().getSite().getSiteName();
//            jobType = "AMC Initial";
//        } 
//        // Then check AMC Renewal Job
//        else if (entity.getAmcRenewalJob() != null && entity.getAmcRenewalJob().getSite() != null) {
//            siteName = entity.getAmcRenewalJob().getSite().getSiteName();
//            jobType = "AMC Renewal";
//        }

        // Assuming Employee has a 'getName()' method
        String employeeName = entity.getEmployee() != null ? entity.getEmployee().getEmployeeName() : "N/A";
        String handoverName = entity.getExpenseHandoverTo() != null ? entity.getExpenseHandoverTo().getEmployeeName() : null;

        return SiteExpenseListDTO.builder()
                .expenseId(entity.getExpenseId())
                .amount(entity.getAmount())
                .expenseDate(entity.getExpenseDate())
                .expenseType(entity.getExpenseType())
                .paymentMethod(entity.getPaymentMethod())
                .narration(entity.getNarration())
                .employeeName(employeeName)
                .expenseHandoverToName(handoverName)
                .siteName(siteName) 
                .jobType(entity.getJobType())
                .build();
    }
}