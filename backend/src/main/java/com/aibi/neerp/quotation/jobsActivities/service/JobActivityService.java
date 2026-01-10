package com.aibi.neerp.quotation.jobsActivities.service;

import com.aibi.neerp.amc.common.entity.JobActivityType;
import com.aibi.neerp.amc.common.repository.JobActivityTypeRepository;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.exception.FileStorageException;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.quotation.jobs.entity.QuotationJobs;
import com.aibi.neerp.quotation.jobs.entity.NiJobDocument;
import com.aibi.neerp.quotation.jobs.repository.QuotationJobsRepository;
import com.aibi.neerp.quotation.jobsActivities.dto.JobActivityPhotoDTO;
import com.aibi.neerp.quotation.jobsActivities.dto.JobActivityRequestDTO;
import com.aibi.neerp.quotation.jobsActivities.dto.JobActivityResponseDTO;
import com.aibi.neerp.quotation.jobsActivities.dto.JobActivitySignatureDTO;
import com.aibi.neerp.quotation.jobsActivities.entity.NiJobActivity;
import com.aibi.neerp.quotation.jobsActivities.entity.NiJobActivityPhoto;
import com.aibi.neerp.quotation.jobsActivities.entity.NiJobActivityType;
import com.aibi.neerp.quotation.jobsActivities.repository.NiJobActivityPhotoRepository;
import com.aibi.neerp.quotation.jobsActivities.repository.NiJobActivityRepository;
import com.aibi.neerp.quotation.jobsActivities.repository.NiJobActivityTypeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
public class JobActivityService {

        @Autowired
        private NiJobActivityRepository activityRepository;

        @Autowired
        private NiJobActivityPhotoRepository photoRepository;

        @Autowired
        private QuotationJobsRepository jobRepository;

        @Autowired
        private NiJobActivityTypeRepository niJobActivityTypeRepository;

        @Autowired
        private EmployeeRepository employeeRepository;

        @Autowired
        private FileStorageService fileStorageService;

        @Autowired
        private JobActivityEmailService emailService;

        @Value("${app.backend.url:http://localhost:8080}")
        private String backendUrl;

        private static final int MAX_PHOTOS = 5;

    /**
     * Create new job activity
     */
//    public List<JobActivityResponseDTO> createJobActivity(JobActivityRequestDTO request) {
    public JobActivityResponseDTO createJobActivity(JobActivityRequestDTO request) {

                // Validate job exists
                QuotationJobs job = jobRepository.findById(request.getJobId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Job not found with ID: " + request.getJobId()));

        // Validate activity type if provided
        NiJobActivityType activityType = null;
        if (request.getJobActivityTypeId() != null) {
            activityType = niJobActivityTypeRepository.findById(Long.valueOf(request.getJobActivityTypeId()))
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Activity type not found with ID: " + request.getJobActivityTypeId()));
        }

                // Validate employees
                Employee activityBy = null;
                if (request.getJobActivityBy() != null) {
                        activityBy = employeeRepository.findById(request.getJobActivityBy())
                                        .orElseThrow(() -> new ResourceNotFoundException(
                                                        "Employee not found with ID: " + request.getJobActivityBy()));
                }

                Employee createdBy = employeeRepository.findById(request.getCreatedBy())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Employee not found with ID: " + request.getCreatedBy()));

                // Build entity
                NiJobActivity activity = NiJobActivity.builder()
                                .job(job)
                                .jobActivityType(activityType)
                                .activityDate(request.getActivityDate())
                                .activityTitle(request.getActivityTitle())
                                .activityDescription(request.getActivityDescription())
                                .jobActivityBy(activityBy)
                                .remark(request.getRemark())
                                .mailSent(false)
                                .createdBy(createdBy)
                                .signaturePersonName(request.getSignaturePersonName())
                                .signatureUrl(request.getSignatureUrl())
                                .status("ACTIVE")
                                .build();

                // Save first to get ID
                activity = activityRepository.save(activity);
                log.info("Job activity created for jobId={}", job.getJobId());

                JobActivityResponseDTO response = mapToResponseDTO(activity);

        // Send email automatically after creation
        try {
            sendActivityEmail(activity.getJobActivityId());
        } catch (Exception e) {
            log.error("Failed to send email for activity {}, but activity was created", 
                    activity.getJobActivityId(), e);
            // Don't fail the activity creation if email fails
        }

        return response;
    }
    
    /**
     * Send activity email manually
     */
    public void sendActivityEmail(Integer activityId) {
        NiJobActivity activity = activityRepository.findByIdAndNotDeleted(activityId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Activity not found with ID: " + activityId));

        JobActivityResponseDTO activityDTO = mapToResponseDTO(activity);
        
        // Get customer email from job
//        String customerEmail = activity.getJob().getCustomer().getEmailId();
//        String customerName = activity.getJob().getCustomer().getCustomerName();
//
//        if (customerEmail == null || customerEmail.isEmpty()) {
//            throw new IllegalStateException("Customer email not found for job: " + activity.getJob().getJobId());
//        }

        // Send email with PDF
//        emailService.sendActivityEmailWithPDF(activityDTO, customerEmail, customerName);
        emailService.sendActivityEmailWithPDF(activityDTO, activity);

        // Update mailSent flag
        activity.setMailSent(true);
        activityRepository.save(activity);
        
        log.info("Email sent successfully for activity: {}", activityId);
    }

        /**
         * Upload photos for activity
         */
        public List<JobActivityPhotoDTO> uploadPhotos(Integer activityId,
                        List<MultipartFile> photos,
                        Integer clientId,
                        Integer jobId) {

                // Validate activity exists
                NiJobActivity activity = activityRepository.findByIdAndNotDeleted(activityId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Activity not found with ID: " + activityId));

                // Check existing photo count
                Long existingCount = photoRepository.countByJobActivityId(activityId);

                if (existingCount + photos.size() > MAX_PHOTOS) {
                        throw new IllegalArgumentException(
                                        String.format("Maximum %d photos allowed. Current: %d, Attempting to add: %d",
                                                        MAX_PHOTOS, existingCount, photos.size()));
                }

                List<NiJobActivityPhoto> savedPhotos = new ArrayList<>();

        for (MultipartFile photo : photos) {
            try {
                String photoPath = fileStorageService.storePhoto(
                        photo,
                        clientId,
                        activity.getJob().getJobId(),
                        activityId
                );

                                NiJobActivityPhoto photoEntity = NiJobActivityPhoto.builder()
                                                .jobActivity(activity)
                                                .photoPath(photoPath)
                                                .createdBy(activity.getCreatedBy())
                                                .deleted(false)
                                                .build();

                                savedPhotos.add(photoRepository.save(photoEntity));

                        } catch (IOException e) {
                                log.error("Failed to upload photo for activity: {}", activityId, e);
                                throw new RuntimeException("Failed to upload photo", e);
                        }
                }

        log.info("Uploading {} photos for client: {} jobId: {} activity: {} ", photos.size(), clientId, jobId, activityId);

                return savedPhotos.stream()
                                .map(this::mapToPhotoDTO)
                                .collect(Collectors.toList());
        }

        /**
         * Delete activity photo
         */
        public void deleteActivityPhoto(Integer photoId) {
                NiJobActivityPhoto photo = photoRepository.findById(photoId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Photo not found with ID: " + photoId));

                // Delete physical file
                try {
                        fileStorageService.deleteFile(photo.getPhotoPath());
                } catch (Exception e) {
                        log.warn("Failed to delete physical file: {}", photo.getPhotoPath(), e);
                        // Continue with database deletion even if file deletion fails
                }

                // Delete from database
                photoRepository.delete(photo);
                log.info("Deleted photo: {}", photoId);
        }

//    /**
//     * Upload documents for job (via activity context or direct)
//     */
//    /**
//     * Upload documents for job (via activity context or direct)
//     */
//    public List<NiJobDocuments> uploadJobDocuments(
//                                                                 List<MultipartFile> files,
//                                                                 Integer clientId,
//                                                                 Integer jobId) {
//
//        QuotationJobs job = jobRepository.findById(jobId)
//                .orElseThrow(() -> new ResourceNotFoundException(
//                        "Job not found with ID: " + jobId));
//
//        if (files.size() > 10) {
//            throw new IllegalArgumentException("Maximum 10 files allowed at a time");
//        }
//
//        List<AttachedJobDocument> savedDocs = new ArrayList<>();
//
//        for (MultipartFile file : files) {
//            try {
//                // Store file in JOB folder
//                String docPath = fileStorageService.storeJobDocument(
//                        file,
//                        clientId,
//                        jobId
//                );
//
//                NiJobDocuments docEntity = NiJobDocuments.builder()
//                        .job(job)
//                        .documentName(file.getOriginalFilename())
//                        .filePath(docPath)
//                        .fileType(file.getContentType())
//                        .fileSize(file.getSize())
//                        // Storing employee object (Job Creator) - assuming creator exists
//                        .docAddedBy(job.getCreatedBy())
//                        .status("ACTIVE")
//                        .docAddDate(LocalDateTime.now())
//                        .build();
//
//                savedDocs.add(attachedJobDocumentRepository.save(docEntity));
//
//            } catch (IOException e) {
//                log.error("Failed to upload document for job: {}", jobId, e);
//                throw new RuntimeException("Failed to upload document", e);
//            }
//        }
//
//        log.info("Uploaded {} documents for job: {}", files.size(), jobId);
//        return savedDocs;
//    }
//
//    public List<AttachedJobDocument> getDocumentsByJob(Integer jobId) {
//         return attachedJobDocumentRepository.findByJob_JobIdAndStatusIgnoreCase(jobId, "ACTIVE");
//    }


        /**
         * Upload signature for activity
         */
        public String uploadSignature(Integer activityId,
                        MultipartFile file,
                        Integer clientId,
                        Integer jobId) {

                NiJobActivity activity = activityRepository.findById(activityId)
                                .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));

        try {
            String filePath = fileStorageService.storeSignature(
                    file,
                    clientId,
                    activity.getJob().getJobId(),
                    activityId,
                    activity.getSignaturePersonName()
            );

                        activity.setSignatureUrl(filePath);
                        activityRepository.save(activity);

                        return filePath;

        } catch (IOException e) {
            log.error("Failed to store signature for activity {}", activityId, e);
            throw new FileStorageException("Failed to upload signature");
        }
    }


        /**
         * Fetch photos for an activity
         */
        public List<JobActivityPhotoDTO> getPhotosByActivity(Integer activityId, Integer jobId, String clientId) {

                log.info("Fetching photos for activityId={} jobId={} clientId={}", activityId, jobId, clientId);

        // 1️⃣ Validate activity
        NiJobActivity activity = activityRepository
                .findByJobActivityIdAndStatusNot(
                        activityId,
                        "DELETED"
                )
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Activity not found with ID: " + activityId
                ));

        // 2️⃣ Fetch photos
        List<NiJobActivityPhoto> photos =
                photoRepository.findByJobActivity_JobActivityIdAndDeletedFalse(
                        activity.getJobActivityId()
                );

        // 3️⃣ Convert to DTO
        return photos.stream()
                .map(photo -> JobActivityPhotoDTO.builder()
                        .photoId(photo.getPhotoId())
                        .photoUrl(photo.getPhotoPath())
                        //.(photo.getOriginalFileName())
                        .createdAt(photo.getCreatedAt())
                        .createdById(photo.getCreatedBy().getEmployeeId())
                        .createdByName(photo.getCreatedBy().getEmployeeName())
                        .build())
                .toList();
    }


        /**
         * Fetch signature details for an activity
         */
        public JobActivitySignatureDTO getSignatureByActivity(Integer activityId, Integer jobId, String clientId) {

                log.info("Fetching signature for activityId={} jobId={} clientId={}", activityId, jobId, clientId);

        NiJobActivity activity = activityRepository
                .findByJobActivityIdAndStatusNot(
                        activityId,
                        "DELETED"
                )
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Activity not found with ID: " + activityId
                ));

        return JobActivitySignatureDTO.builder()
                .signatureUrl(activity.getSignatureUrl())
                .signaturePersonName(activity.getSignaturePersonName())
                .build();
    }


        /**
         * Get activity by ID
         */
        @Transactional(readOnly = true)
        public JobActivityResponseDTO getActivityById(Integer activityId) {
                NiJobActivity activity = activityRepository.findByIdAndNotDeleted(activityId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Activity not found with ID: " + activityId));

                return mapToResponseDTO(activity);
        }

        /**
         * Get all activities for a job
         */
        @Transactional(readOnly = true)
        public List<JobActivityResponseDTO> getActivitiesByJobId(Integer jobId) {
                List<NiJobActivity> activities = activityRepository.findByJobIdAndStatusNot(jobId);

                return activities.stream()
                                .map(this::mapToResponseDTO)
                                .collect(Collectors.toList());
        }

        /**
         * Update activity
         */
        public JobActivityResponseDTO updateActivity(Integer activityId,
                        JobActivityRequestDTO request) {

                NiJobActivity activity = activityRepository.findByIdAndNotDeleted(activityId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Activity not found with ID: " + activityId));

                // Update fields
                if (request.getJobActivityTypeId() != null) {
                        NiJobActivityType activityType = niJobActivityTypeRepository
                                        .findById(Long.valueOf(request.getJobActivityTypeId()))
                                        .orElseThrow(() -> new ResourceNotFoundException(
                                                        "Activity type not found"));
                        activity.setJobActivityType(activityType);
                }

                if (request.getActivityDate() != null) {
                        activity.setActivityDate(request.getActivityDate());
                }

                if (request.getActivityTitle() != null) {
                        activity.setActivityTitle(request.getActivityTitle());
                }

                if (request.getActivityDescription() != null) {
                        activity.setActivityDescription(request.getActivityDescription());
                }

                if (request.getRemark() != null) {
                        activity.setRemark(request.getRemark());
                }

                activity = activityRepository.save(activity);

                log.info("Activity updated: {}", activityId);

                return mapToResponseDTO(activity);
        }

        /**
         * Delete activity (soft delete)
         */
        public void deleteActivity(Integer activityId) {
                NiJobActivity activity = activityRepository.findByIdAndNotDeleted(activityId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Activity not found with ID: " + activityId));

                activity.setStatus("DELETED");
                activityRepository.save(activity);

                log.info("Activity deleted: {}", activityId);
        }

        @Transactional
        public void hardDeleteActivity(Integer activityId) {

                NiJobActivity activity = activityRepository.findById(activityId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Activity not found with ID: " + activityId));

        // 1️⃣ Delete photo files + DB records
        List<NiJobActivityPhoto> photos =
                photoRepository.findByJobActivityId(activityId);

                for (NiJobActivityPhoto photo : photos) {
                        try {
                                fileStorageService.deleteFile(photo.getPhotoPath());
                        } catch (Exception e) {
                                log.error("Failed to delete photo file: {}", photo.getPhotoPath(), e);
                        }
                }

                // delete photo records
                photoRepository.deleteAll(photos);

                // 2️⃣ Delete signature file (if exists)
                if (activity.getSignatureUrl() != null && !activity.getSignatureUrl().isBlank()) {
                        try {
                                fileStorageService.deleteFile(activity.getSignatureUrl());
                        } catch (Exception e) {
                                log.error("Failed to delete signature file: {}", activity.getSignatureUrl(), e);
                        }
                }

                // 3️⃣ Delete activity record
                activityRepository.delete(activity);

                log.info("Activity hard deleted with photos & signature. ActivityId={}", activityId);
        }


//    public void hardDeleteActivity(Integer activityId) {
//        NiJobActivity activity = activityRepository.findById(activityId)
//                .orElseThrow(() -> new ResourceNotFoundException(
//                        "Activity not found with ID: " + activityId));
//
//        activityRepository.delete(activity);
//
//        log.info("Activity permanently deleted with ID: {}", activityId);
//    }

        /**
         * Delete photo
         */
        public void deletePhoto(Integer photoId) {
                NiJobActivityPhoto photo = photoRepository.findById(photoId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Photo not found with ID: " + photoId));

                // Delete file from storage
                fileStorageService.deleteFile(photo.getPhotoPath());

                // Delete from database
                photoRepository.delete(photo);

                log.info("Photo deleted: {}", photoId);
        }

        private JobActivityResponseDTO mapToResponseDTO(NiJobActivity activity) {
                List<JobActivityPhotoDTO> photos = photoRepository
                                .findByJobActivityId(activity.getJobActivityId())
                                .stream()
                                .map(this::mapToPhotoDTO)
                                .collect(Collectors.toList());

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
                .jobActivityTypeId(
                        activity.getJobActivityType() != null
                                ? activity.getJobActivityType().getId()
                                : null
                )
                .jobActivityTypeName(activity.getJobActivityType() != null ?
                        activity.getJobActivityType().getTypeName() : null)
                .remark(activity.getRemark())
                .mailSent(activity.getMailSent())
                .createdBy(activity.getCreatedBy().getEmployeeId())
                .createdByName(activity.getCreatedBy().getEmployeeName())
                .signaturePersonName(activity.getSignaturePersonName())
                .signatureUrl(activity.getSignatureUrl() != null ?
                        buildFileUrl(activity.getSignatureUrl()) : null)
                .status(activity.getStatus())
                .createdAt(activity.getCreatedAt())
                .photos(photos)
                .build();
    }

        private JobActivityPhotoDTO mapToPhotoDTO(NiJobActivityPhoto photo) {
                return JobActivityPhotoDTO.builder()
                                .photoId(photo.getPhotoId())
                                .photoUrl(buildFileUrl(photo.getPhotoPath()))
                                .createdAt(photo.getCreatedAt())
                                .build();
        }

    private String buildFileUrl(String filePath) {
        String safeBackendUrl = backendUrl != null && backendUrl.endsWith("/")
                ? backendUrl.substring(0, backendUrl.length() - 1)
                : backendUrl;
        return String.format("%s/api/job-activities/files/%s", safeBackendUrl, filePath);
    }

}