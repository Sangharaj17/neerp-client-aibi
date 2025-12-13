package com.aibi.neerp.quotation.jobs.service;

import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.customer.entity.Customer;
import com.aibi.neerp.customer.entity.Site;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.EnquiryType;
import com.aibi.neerp.leadmanagement.entity.NewLeads;
import com.aibi.neerp.quotation.entity.QuotationMain;
import com.aibi.neerp.quotation.jobs.dto.QuotationJobRequestDTO;
import com.aibi.neerp.quotation.jobs.dto.QuotationJobResponseDTO;
import com.aibi.neerp.quotation.jobs.entity.QuotationJobs;
import com.aibi.neerp.quotation.jobs.repository.QuotationJobsRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuotationJobsService {

    private final QuotationJobsRepository repo;
    private final com.aibi.neerp.quotation.repository.QuotationMainRepository quotationMainRepo;
    private final EntityManager em;

    public ApiResponse<QuotationJobResponseDTO> create(QuotationJobRequestDTO dto) {
        log.info("Creating New Installation Job");
        try {
            QuotationJobs job = mapToEntity(dto, new QuotationJobs());
            repo.save(job);
            log.info("Job created successfully with ID: {}", job.getJobId());

            if (dto.getNiQuotationId() != null) {
                QuotationMain quotationMain = quotationMainRepo.findById(dto.getNiQuotationId())
                        .orElse(null);
                if (quotationMain != null) {
                    quotationMain.setJobStatus(1);
                    quotationMainRepo.save(quotationMain);
                    log.info("QuotationMain job_status updated to 1 for ID: {}", dto.getNiQuotationId());
                }
            }
            
            return new ApiResponse<>(true, "Job Created Successfully", mapToResponse(job));
        } catch (Exception e) {
            log.error("Error creating job: {}", e.getMessage(), e);
            return new ApiResponse<>(false, "Error creating job: " + e.getMessage(), null);
        }
    }

    public ApiResponse<QuotationJobResponseDTO> update(Integer id, QuotationJobRequestDTO dto) {
        log.info("Updating job with id {}", id);
        try {
            if (id == null) {
                return new ApiResponse<>(false, "Job ID is required", null);
            }

            QuotationJobs job = repo.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Job not found with ID: " + id));

            mapToEntity(dto, job);
            repo.save(job);
            log.info("Job updated successfully with ID: {}", id);
            return new ApiResponse<>(true, "Job Updated Successfully", mapToResponse(job));

        } catch (EntityNotFoundException e) {
            log.warn("Job not found: {}", e.getMessage());
            return new ApiResponse<>(false, e.getMessage(), null);
        } catch (Exception e) {
            log.error("Error updating job: {}", e.getMessage(), e);
            return new ApiResponse<>(false, "Error updating job: " + e.getMessage(), null);
        }
    }

    public ApiResponse<QuotationJobResponseDTO> getById(Integer id) {
        log.info("Fetching job by ID: {}", id);
        try {
            if (id == null) {
                return new ApiResponse<>(false, "Job ID is required", null);
            }

            QuotationJobs job = repo.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Job not found with ID: " + id));

            return new ApiResponse<>(true, "Job Fetched Successfully", mapToResponse(job));

        } catch (EntityNotFoundException e) {
            log.warn("Job not found: {}", e.getMessage());
            return new ApiResponse<>(false, e.getMessage(), null);
        } catch (Exception e) {
            log.error("Error fetching job: {}", e.getMessage(), e);
            return new ApiResponse<>(false, "Error fetching job: " + e.getMessage(), null);
        }
    }

    public ApiResponse<List<QuotationJobResponseDTO>> getAll() {
        log.info("Fetching all jobs");
        try {
            List<QuotationJobResponseDTO> jobs = repo.findAll().stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
            return new ApiResponse<>(true, "Jobs Fetched Successfully", jobs);
        } catch (Exception e) {
            log.error("Error fetching all jobs: {}", e.getMessage(), e);
            return new ApiResponse<>(false, "Error fetching jobs: " + e.getMessage(), null);
        }
    }

    public ApiResponse<String> delete(Integer id) {
        log.info("Deleting job with id {}", id);
        try {
            if (id == null) {
                return new ApiResponse<>(false, "Job ID is required", null);
            }

            QuotationJobs job = repo.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Job not found with ID: " + id));

            repo.delete(job);
            log.info("Job deleted successfully with ID: {}", id);
            return new ApiResponse<>(true, "Job Deleted Successfully", null);

        } catch (EntityNotFoundException e) {
            log.warn("Job not found for deletion: {}", e.getMessage());
            return new ApiResponse<>(false, e.getMessage(), null);
        } catch (Exception e) {
            log.error("Error deleting job: {}", e.getMessage(), e);
            return new ApiResponse<>(false, "Error deleting job: " + e.getMessage(), null);
        }
    }

    // -------------------- MAPPING HELPERS --------------------

    private QuotationJobs mapToEntity(QuotationJobRequestDTO dto, QuotationJobs job) {

        if (dto.getLeadId() != null)
             job.setLead(em.getReference(NewLeads.class, dto.getLeadId()));
        if (dto.getCombinedEnquiryId() != null)
            job.setCombinedEnquiry(em.getReference(CombinedEnquiry.class, dto.getCombinedEnquiryId()));
        if (dto.getCustomerId() != null)
            job.setCustomer(em.getReference(Customer.class, dto.getCustomerId()));
        if (dto.getSiteId() != null)
            job.setSite(em.getReference(Site.class, dto.getSiteId()));

        if (dto.getNiQuotationId() != null)
            job.setNiQuotation(em.getReference(QuotationMain.class, dto.getNiQuotationId()));

        if (dto.getSalesExecutiveId() != null)
            job.setSalesExecutive(em.getReference(Employee.class, dto.getSalesExecutiveId()));

        if (dto.getServiceEngineerId() != null)
            job.setServiceEngineer(em.getReference(Employee.class, dto.getServiceEngineerId()));

        if (dto.getCreatedById() != null && job.getJobId() == null) { // Only set on creation
            job.setCreatedBy(em.getReference(Employee.class, dto.getCreatedById()));
        }

        if (dto.getJobTypeId() != null)
            job.setJobType(em.getReference(EnquiryType.class, dto.getJobTypeId()));

        job.setJobNo(dto.getJobNo());
        job.setJobAmount(dto.getJobAmount());
        job.setJobStatus(dto.getJobStatus());
        job.setJobLiftDetail(dto.getJobLiftDetail());
        job.setPaymentTerm(dto.getPaymentTerm());
        job.setCustomerGstNo(dto.getCustomerGstNo());
        job.setStartDate(dto.getStartDate());
        job.setDealDate(dto.getDealDate());
        job.setIsHandover(dto.getIsHandover());
        job.setHandoverDate(dto.getHandoverDate());
        job.setPwdStatus(dto.getPwdStatus());
        job.setPwdActDate(dto.getPwdActDate());

        return job;
    }

    private QuotationJobResponseDTO mapToResponse(QuotationJobs job) {

        QuotationJobResponseDTO res = new QuotationJobResponseDTO();

        res.setJobId(job.getJobId());
        res.setLeadId(job.getLead() != null ? job.getLead().getLeadId() : null);
        res.setCombinedEnquiryId(job.getCombinedEnquiry() != null ? job.getCombinedEnquiry().getId() : null);
        res.setCustomerId(job.getCustomer() != null ? job.getCustomer().getCustomerId() : null);
        res.setSiteId(job.getSite() != null ? job.getSite().getSiteId() : null);
        
        res.setNiQuotationId(
                job.getNiQuotation() != null ? job.getNiQuotation().getId() : null
        );
        res.setServiceEngineerId(
                job.getServiceEngineer() != null ? job.getServiceEngineer().getEmployeeId() : null
        );
        res.setSalesExecutiveId(
                job.getSalesExecutive() != null ? job.getSalesExecutive().getEmployeeId() : null
        );

        res.setJobNo(job.getJobNo());
        res.setJobTypeId(job.getJobType() != null ? job.getJobType().getEnquiryTypeId() : null);
        res.setJobTypeName(job.getJobType() != null ? job.getJobType().getEnquiryTypeName() : null);
        res.setJobAmount(job.getJobAmount());
        res.setJobStatus(job.getJobStatus());
        res.setJobLiftDetail(job.getJobLiftDetail());
        res.setPaymentTerm(job.getPaymentTerm());
        res.setCustomerGstNo(job.getCustomerGstNo());
        res.setStartDate(job.getStartDate());
        res.setDealDate(job.getDealDate());
        res.setIsHandover(job.getIsHandover());
        res.setHandoverDate(job.getHandoverDate());
        res.setPwdStatus(job.getPwdStatus());
        res.setPwdActDate(job.getPwdActDate());

        return res;
    }
}
