package com.aibi.neerp.quotation.jobs.service;

import com.aibi.neerp.amc.jobs.initial.dto.EmployeeDto;
import com.aibi.neerp.amc.jobs.initial.dto.LiftData;
import com.aibi.neerp.amc.jobs.initial.service.AmcJobsService;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.customer.entity.Customer;
import com.aibi.neerp.customer.entity.Site;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.EnquiryType;
import com.aibi.neerp.leadmanagement.entity.NewLeads;
import com.aibi.neerp.quotation.entity.QuotationLiftDetail;
import com.aibi.neerp.quotation.entity.QuotationMain;
import com.aibi.neerp.quotation.jobs.dto.JobForPaymentResponseDTO;
import com.aibi.neerp.quotation.jobs.dto.NiJobDetailPageResponseDto;
import com.aibi.neerp.quotation.jobs.dto.QuotationJobRequestDTO;
import com.aibi.neerp.quotation.jobs.dto.QuotationJobResponseDTO;
import com.aibi.neerp.quotation.jobs.entity.QuotationJobs;
import com.aibi.neerp.quotation.jobs.repository.JobPaymentRepository;
import com.aibi.neerp.quotation.jobs.repository.QuotationJobsRepository;
import com.aibi.neerp.quotation.jobsActivities.dto.JobActivityPhotoDTO;
import com.aibi.neerp.quotation.jobsActivities.dto.JobActivityResponseDTO;
import com.aibi.neerp.quotation.jobsActivities.entity.NiJobActivity;
import com.aibi.neerp.quotation.jobsActivities.entity.NiJobActivityPhoto;
import com.aibi.neerp.quotation.utility.PaginationResponse;
import com.aibi.neerp.settings.dto.CompanySettingDTO;
import com.aibi.neerp.settings.entity.CompanySetting;
import com.aibi.neerp.settings.service.CompanySettingService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import com.aibi.neerp.quotation.jobs.entity.NiJobDocument;
import com.aibi.neerp.quotation.jobsActivities.service.FileStorageService;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;


@Service
@RequiredArgsConstructor
@Slf4j
public class QuotationJobsService {

    private final QuotationJobsRepository repo;
    private final com.aibi.neerp.quotation.repository.QuotationMainRepository quotationMainRepo;
    private final EntityManager em;
    private final AmcJobsService amcJobsService;
    private final CompanySettingService companySettingService;
    private final com.aibi.neerp.quotation.jobs.repository.NiJobDocumentRepository niJobDocumentRepository;
    private final com.aibi.neerp.quotation.jobsActivities.service.FileStorageService fileStorageService;
    private final JobPaymentRepository jobPaymentRepo;


    @Value("${app.backend.url:http://localhost:8080}")
    private String backendUrl;


    private String buildFileUrl(String filePath) {
        return backendUrl + "/api/job-activities/files/" + filePath;
    }

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

            return new ApiResponse<>(true, "Job Created Successfully", mapToResponse(job, false));
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
            return new ApiResponse<>(true, "Job Updated Successfully", mapToResponse(job, false));

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

            return new ApiResponse<>(true, "Job Fetched Successfully", mapToResponse(job, true));

        } catch (EntityNotFoundException e) {
            log.warn("Job not found: {}", e.getMessage());
            return new ApiResponse<>(false, e.getMessage(), null);
        } catch (Exception e) {
            log.error("Error fetching job: {}", e.getMessage(), e);
            return new ApiResponse<>(false, "Error fetching job: " + e.getMessage(), null);
        }
    }


    public ApiResponse<QuotationJobResponseDTO> getByIdToAddInvoice(Integer id) {
        log.info("Fetching job by ID to add invoice: {}", id);
        try {
            if (id == null) {
                return new ApiResponse<>(false, "Job ID is required", null);
            }

            QuotationJobs job = repo.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Job not found with ID: " + id));

            return new ApiResponse<>(true, "Job Fetched Successfully", mapToResponseForInvoice(job));

        } catch (EntityNotFoundException e) {
            log.warn("Job not found: {}", e.getMessage());
            return new ApiResponse<>(false, e.getMessage(), null);
        } catch (Exception e) {
            log.error("Error fetching job: {}", e.getMessage(), e);
            return new ApiResponse<>(false, "Error fetching job: " + e.getMessage(), null);
        }
    }

    @Transactional(readOnly = true)
    public ApiResponse<QuotationJobResponseDTO> getByIdWithActivities(Integer id) {
        log.info("Fetching job with activities by ID: {}", id);
        try {
            if (id == null) {
                return new ApiResponse<>(false, "Job ID is required", null);
            }

            QuotationJobs job = repo.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Job not found with ID: " + id));

            // Include all activities in response
            return new ApiResponse<>(true, "Job Fetched Successfully", mapToResponse(job, true));

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
                    .map(job -> mapToResponse(job, false))
                    .collect(Collectors.toList());
            return new ApiResponse<>(true, "Jobs Fetched Successfully", jobs);
        } catch (Exception e) {
            log.error("Error fetching all jobs: {}", e.getMessage(), e);
            return new ApiResponse<>(false, "Error fetching jobs: " + e.getMessage(), null);
        }
    }

    public PaginationResponse<QuotationJobResponseDTO> getPagewiseJobs(
            Pageable pageable, String search) {

        log.info("Fetching pagewise jobs search: {}", search);

        Specification<QuotationJobs> spec = (root, query, cb) -> {

            if (search == null || search.trim().isEmpty()) {
                return cb.conjunction();
            }

            String raw = search.trim().toLowerCase();
            String like = "%" + raw + "%";
            String numericOnly = raw.replaceAll("[^0-9]", "");

            Join<QuotationJobs, Customer> customerJoin = root.join("customer", JoinType.LEFT);
            Join<QuotationJobs, Site> siteJoin = root.join("site", JoinType.LEFT);
            Join<QuotationJobs, EnquiryType> typeJoin = root.join("jobType", JoinType.LEFT);

            List<Predicate> predicates = new ArrayList<>();

            /* ---------- BASIC SEARCH ---------- */
            predicates.add(cb.like(cb.lower(root.get("jobNo")), like));
            predicates.add(cb.like(cb.lower(customerJoin.get("customerName")), like));
            predicates.add(cb.like(cb.lower(siteJoin.get("siteName")), like));
            predicates.add(cb.like(cb.lower(typeJoin.get("enquiryTypeName")), like));
            predicates.add(cb.like(cb.lower(root.get("jobStatus")), like));

            /* ---------- JOB ID SEARCH (1, :1, Company:1) ---------- */
            if (!numericOnly.isEmpty()) {
                predicates.add(
                        cb.equal(root.get("jobId"), Integer.valueOf(numericOnly))
                );
            }

            /* ---------- YEAR SEARCH (2025 / 2026) ---------- */
//            if (numericOnly.matches("\\d{4}")) {
//                Integer year = Integer.valueOf(numericOnly);
//
//                Expression<Integer> startYear =
//                        cb.function("year", Integer.class, root.get("startDate"));
//
//                predicates.add(cb.equal(startYear, year));
//                predicates.add(cb.equal(cb.sum(startYear, 1), year));
//            }

            /* ---------- JOB ID SEARCH (1, :1 etc.) ---------- */
            /* ---------- SMART SEARCH (Formatted String) ---------- */
            // Handle: "Customer:123(2025-2026)" -> Extract "123"
            if (search.contains(":") && search.contains("(")) {
                try {
                    int start = search.lastIndexOf(":") + 1;
                    int end = search.indexOf("(", start);
                    if (start > 0 && end > start) {
                        String idPart = search.substring(start, end);
                        if (idPart.matches("\\d+")) {
                            predicates.add(cb.equal(root.get("jobId"), Integer.valueOf(idPart)));
                        }
                    }
                } catch (Exception e) {
                    // ignore parsing errors
                }
            }

            /* ---------- JOB ID SEARCH ---------- */
            // Fix for Postgres: Use 'text' function explicitly for casting to string
            predicates.add(
                    cb.like(cb.function("text", String.class, root.get("jobId")), like)
            );

            /* ---------- YEAR/DATE SEARCH ---------- */
            // Fix for Postgres: Use 'text' function for date
            predicates.add(
                    cb.like(cb.function("text", String.class, root.get("startDate")), like)
            );

            return cb.or(predicates.toArray(new Predicate[0]));
        };

        Page<QuotationJobs> page = repo.findAll(spec, pageable);

        return new PaginationResponse<>(
                page.getContent().stream()
                        .map(job -> mapToResponse(job, false))
                        .collect(Collectors.toList()),
                page.getNumber(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.getSize()
        );
    }

    public ApiResponse<String> delete(Integer id) {
        log.info("Deleting job with id {}", id);
        try {
            if (id == null) {
                return new ApiResponse<>(false, "Job ID is required", null);
            }

            QuotationJobs job = repo.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Job not found with ID: " + id));


            // Check if job has activities
            if (job.getJobActivities() != null && !job.getJobActivities().isEmpty()) {
                long activeActivities = job.getJobActivities().stream()
                        .filter(activity -> !"DELETED".equals(activity.getStatus()))
                        .count();

                if (activeActivities > 0) {
                    return new ApiResponse<>(false,
                            "Cannot delete job with active activities. Delete activities first.",
                            null);
                }
            }

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

    // ================= JOB DOCUMENT UPLOAD (NiJobDocument) =================
    @Transactional
    public List<NiJobDocument> uploadJobDocuments(List<MultipartFile> files,
                                                  Integer clientId,
                                                  Integer jobId) {

        log.info("Uploading {} documents for job {}", files.size(), jobId);

        QuotationJobs job = repo.findById(jobId)
                .orElseThrow(() -> new EntityNotFoundException("Job not found with ID: " + jobId));

        if (files.size() > 10) {
            throw new IllegalArgumentException("Maximum 10 files allowed at a time");
        }

        List<NiJobDocument> savedDocs = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                // Store file in JOB folder (ignoring activityId for folder structure as requested "not activity related")
                // We use storeJobDocument method in FileStorageService
                String docPath = fileStorageService.storeJobDocument(
                        file,
                        clientId,
                        jobId
                );

                NiJobDocument docEntity = NiJobDocument.builder()
                        .job(job)
                        .jobNo(job.getJobNo())
                        .documentName(file.getOriginalFilename())
                        .filePath(docPath)
                        .fileType(file.getContentType())
                        .fileSize(file.getSize())
                        .status("ACTIVE")
                        .docAddDate(LocalDateTime.now())
                        .docAddedBy(job.getCreatedBy() != null ? job.getCreatedBy().getEmployeeName() : "System")
                        .build();

                savedDocs.add(niJobDocumentRepository.save(docEntity));

            } catch (IOException e) {
                log.error("Failed to upload document for job: {}", jobId, e);
                throw new RuntimeException("Failed to upload document", e);
            }
        }

        return savedDocs;
    }

    @Transactional(readOnly = true)
    public List<NiJobDocument> getDocumentsByJob(Integer jobId) {
        return niJobDocumentRepository.findByJob_JobIdAndStatus(jobId, "ACTIVE");
    }

    @Transactional
    public void deleteJobDocument(Long documentId) {
        log.info("Deleting job document with ID: {}", documentId);

        NiJobDocument document = niJobDocumentRepository.findById(documentId)
                .orElseThrow(() -> new EntityNotFoundException("Document not found with ID: " + documentId));

        // Soft delete by setting status to DELETED
        document.setStatus("DELETED");
        niJobDocumentRepository.save(document);

        // Optionally delete the physical file
        try {
            if (document.getFilePath() != null) {
                fileStorageService.deleteFile(document.getFilePath());
            }
        } catch (Exception e) {
            log.warn("Failed to delete physical file for document {}: {}", documentId, e.getMessage());
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

    private QuotationJobResponseDTO mapToResponse(QuotationJobs job, boolean includeActivities) {

        QuotationJobResponseDTO res = new QuotationJobResponseDTO();

        res.setJobId(job.getJobId());
        res.setLeadId(job.getLead() != null ? job.getLead().getLeadId() : null);
        res.setCombinedEnquiryId(job.getCombinedEnquiry() != null ? job.getCombinedEnquiry().getId() : null);
        res.setCustomerId(job.getCustomer() != null ? job.getCustomer().getCustomerId() : null);
        res.setCustomerName(job.getCustomer() != null ? job.getCustomer().getCustomerName() : null);
        res.setSiteId(job.getSite() != null ? job.getSite().getSiteId() : null);
        res.setSiteName(job.getSite() != null ? job.getSite().getSiteName() : null);
        res.setSiteAddress(job.getSite() != null ? job.getSite().getSiteAddress() : null);

        res.setNiQuotationId(
                job.getNiQuotation() != null ? job.getNiQuotation().getId() : null
        );
        res.setQuotationNo(
                job.getNiQuotation() != null ? job.getNiQuotation().getQuotationNo() : null
        );
        res.setServiceEngineerId(
                job.getServiceEngineer() != null ? job.getServiceEngineer().getEmployeeId() : null
        );
        res.setServiceEngineerName(
                job.getServiceEngineer() != null ? job.getServiceEngineer().getEmployeeName() : null
        );
        res.setSalesExecutiveId(
                job.getSalesExecutive() != null ? job.getSalesExecutive().getEmployeeId() : null
        );
        res.setSalesExecutiveName(
                job.getSalesExecutive() != null ? job.getSalesExecutive().getEmployeeName() : null
        );
        BigDecimal paidAmount =
                jobPaymentRepo.getTotalPaidByJob(job.getJobId());

        res.setPaidAmount(paidAmount);

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
        res.setCreatedById(job.getCreatedBy() != null ? job.getCreatedBy().getEmployeeId() : null);
        res.setCreatedByName(job.getCreatedBy() != null ? job.getCreatedBy().getEmployeeName() : null);
        res.setCreatedAt(job.getCreatedAt());

        // ✅ NEW: Include job activities information
        if (job.getJobActivities() != null) {
            List<NiJobActivity> activeActivities = job.getJobActivities().stream()
                    .filter(activity -> !"DELETED".equals(activity.getStatus()))
                    .collect(Collectors.toList());

            res.setTotalActivities(activeActivities.size());

            // Include recent activities if requested
            if (includeActivities && !activeActivities.isEmpty()) {
                List<JobActivityResponseDTO> recentActivities = activeActivities.stream()
                        .sorted(Comparator.comparing(NiJobActivity::getActivityDate).reversed()
                                .thenComparing(Comparator.comparing(NiJobActivity::getCreatedAt).reversed()))
//                        .limit(5)
                        .map(this::mapActivityToDTO)
                        .collect(Collectors.toList());

                res.setRecentActivities(recentActivities);
            }
        } else {
            res.setTotalActivities(0);
        }

        return res;
    }

    private JobActivityResponseDTO mapActivityToDTO(NiJobActivity activity) {
        return JobActivityResponseDTO.builder()
                .jobActivityId(activity.getJobActivityId())
                .jobId(activity.getJob().getJobId())
                .jobNumber(activity.getJob().getJobNo())
//                .jobActivityTypeId(activity.getJobActivityType() != null ?
//                        activity.getJobActivityType().getActivityTypeId() : null)
//                .jobActivityTypeName(activity.getJobActivityType() != null ?
//                        activity.getJobActivityType().getActivityTypeName() : null)
                .activityDate(activity.getActivityDate())
                .activityTitle(activity.getActivityTitle())
                .activityDescription(activity.getActivityDescription())
                .jobActivityBy(activity.getJobActivityBy() != null ?
                        activity.getJobActivityBy().getEmployeeId() : null)
                .jobActivityByName(activity.getJobActivityBy() != null ?
                        activity.getJobActivityBy().getEmployeeName() : null)
                .remark(activity.getRemark())
                .mailSent(activity.getMailSent())
                .status(activity.getStatus())
                .createdAt(activity.getCreatedAt())
                .build();
    }

    private QuotationJobResponseDTO mapToResponseForInvoice(QuotationJobs job) {

        QuotationJobResponseDTO res = new QuotationJobResponseDTO();

        res.setJobId(job.getJobId());
        res.setLeadId(job.getLead() != null ? job.getLead().getLeadId() : null);
        res.setCombinedEnquiryId(job.getCombinedEnquiry() != null ? job.getCombinedEnquiry().getId() : null);

        res.setCustomerId(job.getCustomer() != null ? job.getCustomer().getCustomerId() : null);
        res.setCustomerName(job.getCustomer() != null ? job.getCustomer().getCustomerName() : null);
        res.setSiteId(job.getSite() != null ? job.getSite().getSiteId() : null);
        res.setSiteName(job.getSite() != null ? job.getSite().getSiteName() : null);

        QuotationMain quotationMain = job.getNiQuotation();

        res.setNiQuotationId(
                quotationMain != null ? quotationMain.getId() : null
        );
        res.setQuotationNo(
                quotationMain != null ? quotationMain.getQuotationNo() : null
        );

        double pwdAmount = 0;
        boolean pwdIncluded = false;
        Integer noOfLifts = 0;

        if (quotationMain != null && quotationMain.getLiftDetails() != null) {
            List<QuotationLiftDetail> lifts = quotationMain.getLiftDetails();
//            Checks if at least one lift has PWD included
            pwdIncluded = lifts.stream()
                    .anyMatch(l -> Boolean.TRUE.equals(l.getPwdIncludeExclude()));

            pwdAmount = lifts.stream()
                    .filter(l -> Boolean.TRUE.equals(l.getPwdIncludeExclude()))
                    .map(l -> l.getPwdAmount() != null ? l.getPwdAmount() : 0.0)
                    .mapToDouble(Double::doubleValue)
                    .sum();

            noOfLifts = lifts.size();
        }
        res.setNoOfLifts(noOfLifts);
        res.setPwdIncluded(pwdIncluded);
        res.setPwdAmount(pwdAmount);

        res.setJobNo(job.getJobNo());
        res.setJobTypeId(job.getJobType() != null ? job.getJobType().getEnquiryTypeId() : null);
        res.setJobTypeName(job.getJobType() != null ? job.getJobType().getEnquiryTypeName() : null);
        res.setJobAmount(job.getJobAmount());
        res.setJobStatus(job.getJobStatus());
        res.setJobLiftDetail(job.getJobLiftDetail());
        BigDecimal paidAmount =
                jobPaymentRepo.getTotalPaidByJob(job.getJobId());

        res.setPaidAmount(paidAmount);

        return res;
    }


    //-----------------------------for job view page----------------------->
    @Transactional(readOnly = true)
    public NiJobDetailPageResponseDto getJobDetailPage(Integer jobId) {

        QuotationJobs job = repo.findById(jobId)
                .orElseThrow(() -> new EntityNotFoundException("Job not found with id " + jobId));


        // ---------------- Company Name ----------------
        String companyName = companySettingService.getCompanyName("COMPANY_SETTINGS_1");
        if (companyName == null) {
            companyName = "COMPANY";
        }

        // ---------------- Year Calculation ----------------
        LocalDate startDate = job.getStartDate();
        String yearRange = "";

        if (startDate != null) {
            int startYear = startDate.getYear();
            int nextYear = startYear + 1;
            yearRange = "(" + startYear + "-" + nextYear + ")";
        }


        LocalDateTime orderDate = null;

        // ---------------- Formatted Job Ref ----------------
        String formattedJobRef =
                companyName + ":" + job.getJobId() + yearRange;

        // ---------------- Job Details ----------------
        QuotationJobResponseDTO jobDetail = new QuotationJobResponseDTO();

        jobDetail.setJobId(jobId);
        jobDetail.setJobNo(job.getJobNo());
        jobDetail.setJobNoFormatted(formattedJobRef);
        jobDetail.setCustomerName(job.getCustomer() != null ? job.getCustomer().getCustomerName() : null);
        jobDetail.setSiteName(job.getSite() != null ? job.getSite().getSiteName() : null);
//        jobDetail.setStartDate(job.getStartDate());

        jobDetail.setJobLiftDetail(job.getJobLiftDetail());
        jobDetail.setSalesExecutiveName(job.getSalesExecutive() != null ? job.getSalesExecutive().getEmployeeName() : null);
        jobDetail.setServiceEngineerName(job.getServiceEngineer() != null ? job.getServiceEngineer().getEmployeeName() : null);

        jobDetail.setJobStatus(job.getJobStatus());
        jobDetail.setPaymentTerm(job.getPaymentTerm());
        jobDetail.setCombinedEnquiryId(job.getCombinedEnquiry().getId());
        jobDetail.setLeadId(job.getLead().getLeadId());
        jobDetail.setNiQuotationId(job.getNiQuotation().getId());
        jobDetail.setJobTypeId(job.getJobType() != null ? job.getJobType().getEnquiryTypeId() : null);
        jobDetail.setJobTypeName(job.getJobType() != null ? job.getJobType().getEnquiryTypeName() : null);

        jobDetail.setSiteName(job.getSite() != null ? job.getSite().getSiteName() : null);
        jobDetail.setSiteAddress(job.getSite() != null ? job.getSite().getSiteAddress() : null);
        jobDetail.setStartDate(job.getStartDate());
        jobDetail.setDealDate(job.getDealDate());

        jobDetail.setJobAmount(job.getJobAmount());
        // need to set=====================>from "SELECT SUM(amount_paid) as paid_amount from tbl_job_payment where job_id= '$job_id'";
        jobDetail.setPaidAmount(BigDecimal.valueOf(0));
        jobDetail.setCustomerGstNo(job.getCustomerGstNo());
        jobDetail.setCreatedAt(job.getCreatedAt());
        jobDetail.setCreatedById(job.getCreatedBy().getEmployeeId());
        jobDetail.setCreatedByName(job.getCreatedBy().getEmployeeName());


        // ---------------- Job Activities ----------------
//        List<JobActivityResponseDTO> activityDtos =
//                job.getJobActivities().stream()
//                        .filter(a -> !"DELETED".equalsIgnoreCase(a.getStatus()))
//                        .sorted(Comparator.comparing(NiJobActivity::getActivityDate).reversed())
//                        .map(this::mapActivityToDto)
//                        .collect(Collectors.toList());

        // Backend - Fix sorting to use jobActivityId in ascending order

        List<JobActivityResponseDTO> activityDtos =
                job.getJobActivities().stream()
                        .filter(a -> !"DELETED".equalsIgnoreCase(a.getStatus()))
                        .sorted(Comparator.comparing(NiJobActivity::getJobActivityId)) // ✅ Changed to jobActivityId ASC
                        .map(this::mapActivityToDto)
                        .collect(Collectors.toList());

        // ---------------- Lift Data ----------------
        List<LiftData> liftDatas = null;
        if (job.getNiQuotation() != null && job.getNiQuotation().getCombinedEnquiry() != null) {
            liftDatas = amcJobsService.buildLiftData(
                    job.getNiQuotation().getCombinedEnquiry()
            );

            orderDate = job.getNiQuotation().getFinalizedAt();
        }

        jobDetail.setOrderDate(orderDate);

        // ---------------- Employees (Route / Team) ----------------
        List<EmployeeDto> employeeDtos = new ArrayList<>();

        if (job.getServiceEngineer() != null) {
            employeeDtos.add(buildEmployeeDto(job.getServiceEngineer()));
        }

        if (job.getSalesExecutive() != null) {
            employeeDtos.add(buildEmployeeDto(job.getSalesExecutive()));
        }

        // ---------------- Documents ----------------
//        List<NiJobDocument> documents = getDocumentsByJob(jobId);

        long attachedDocumentCount = niJobDocumentRepository.countByJob_JobIdAndStatus(jobId, "ACTIVE");
        jobDetail.setAttachedDocumentCount(attachedDocumentCount);

        List<NiJobDocument> documents = niJobDocumentRepository.findByJob_JobIdAndStatus(jobId, "ACTIVE");

        return new NiJobDetailPageResponseDto(
                jobDetail,
                activityDtos,
                liftDatas,
                employeeDtos,
                documents
        );
    }

    // ---------------- Helper Methods ----------------

    private JobActivityResponseDTO mapActivityToDto(NiJobActivity act) {
        List<JobActivityPhotoDTO> photoDtos =
                act.getActivityPhotos() == null
                        ? List.of()
                        : act.getActivityPhotos()
                        .stream()
                        .filter(p -> Boolean.FALSE.equals(p.getDeleted()))
                        .map(this::mapPhotoToDto)
                        .toList();

        return JobActivityResponseDTO.builder()
                .jobActivityId(act.getJobActivityId())
                .activityDate(LocalDate.from(act.getCreatedAt()))
                .jobActivityByName(act.getJobActivityBy() != null
                        ? act.getJobActivityBy().getEmployeeName()
                        : null)
                .activityTitle(act.getActivityTitle())
                .activityDescription(act.getActivityDescription())
                .remark(act.getRemark())
                .signatureUrl(act.getSignatureUrl() != null ? act.getSignatureUrl() : null)
//                .signatureUrl(
//                        act.getSignatureUrl() != null
//                                ? buildFileUrl(act.getSignatureUrl())
//                                : null
//                )
                .signaturePersonName(act.getSignaturePersonName())
                .status(act.getStatus())
                .createdBy(act.getCreatedBy().getEmployeeId())
                .createdByName(act.getCreatedBy().getEmployeeName())
                .createdAt(act.getCreatedAt())
                .jobActivityBy(act.getJobActivityBy().getEmployeeId())
                .jobActivityTypeId(act.getJobActivityType().getId())
                .jobActivityTypeName(act.getJobActivityType().getTypeName())
                .jobId(act.getJob().getJobId())
                .jobNumber(act.getJob().getJobNo())
                .mailSent(act.getMailSent())
                .photos(photoDtos)
                .build();
    }

    private JobActivityPhotoDTO mapPhotoToDto(NiJobActivityPhoto photo) {
        return JobActivityPhotoDTO.builder()
                .photoId(photo.getPhotoId())
                .photoUrl(photo.getPhotoPath())
//                .photoUrl(buildFileUrl(photo.getPhotoPath()))
                .createdAt(photo.getCreatedAt())
                .createdById(
                        photo.getCreatedBy() != null
                                ? photo.getCreatedBy().getEmployeeId()
                                : null
                )
                .createdByName(
                        photo.getCreatedBy() != null
                                ? photo.getCreatedBy().getEmployeeName()
                                : null
                )
                .build();
    }

    private EmployeeDto buildEmployeeDto(Employee employee) {
        EmployeeDto dto = new EmployeeDto();
        dto.setEmployeeId(employee.getEmployeeId());
        dto.setName(employee.getEmployeeName());
        dto.setAddress(employee.getAddress());
        dto.setRole(employee.getRole() != null ? employee.getRole().getRole() : null);
        return dto;
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<JobForPaymentResponseDTO>> getAllJobsForPayment() {

        CompanySettingDTO settings = companySettingService
                .getCompanySettings("COMPANY_SETTINGS_1")
                .orElseThrow(() ->
                        new ResourceNotFoundException("Company settings not found")
                );

        List<JobForPaymentResponseDTO> jobs =
                repo.findAll().stream().map(job -> {

                    BigDecimal paidAmount = BigDecimal.ZERO; // future-proof

                    return JobForPaymentResponseDTO.builder()
                            .jobId(job.getJobId())
                            .jobNo(job.getJobNo())
                            .jobTypeName(
                                    job.getJobType() != null
                                            ? job.getJobType().getEnquiryTypeName()
                                            : null
                            )
                            .customerName(
                                    job.getCustomer() != null
                                            ? job.getCustomer().getCustomerName()
                                            : null
                            )
                            .siteName(
                                    job.getSite() != null
                                            ? job.getSite().getSiteName()
                                            : null
                            )
                            .jobAmount(job.getJobAmount())
                            .paidAmount(paidAmount)
                            .companyName(settings.getCompanyName())   // ✅ OK
                            .companyMail(settings.getCompanyMail())   // ✅ OK
                            .build();
                }).toList();

        return new ApiResponse<>(
                true,
                "Jobs Fetched Successfully",
                jobs
        );
    }

}
