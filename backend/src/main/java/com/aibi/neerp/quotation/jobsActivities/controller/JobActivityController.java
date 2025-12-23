package com.aibi.neerp.quotation.jobsActivities.controller;

import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.quotation.jobsActivities.dto.JobActivityPhotoDTO;
import com.aibi.neerp.quotation.jobsActivities.dto.JobActivityRequestDTO;
import com.aibi.neerp.quotation.jobsActivities.dto.JobActivityResponseDTO;
import com.aibi.neerp.quotation.jobsActivities.dto.JobActivitySignatureDTO;
import com.aibi.neerp.quotation.jobs.entity.NiJobDocument;
import com.aibi.neerp.quotation.jobsActivities.service.FileStorageService;
import com.aibi.neerp.quotation.jobsActivities.service.JobActivityService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/job-activities")
@Slf4j
@CrossOrigin(origins = "*")
public class JobActivityController {

    @Autowired
    private JobActivityService activityService;

    @Autowired
    private FileStorageService fileStorageService;

    /**
     * Create new job activity
     */
    @PostMapping
//    public ResponseEntity<ApiResponse<List<JobActivityResponseDTO>>> createActivity(
//            @Valid @RequestBody JobActivityRequestDTO request) {
    public ResponseEntity<ApiResponse<JobActivityResponseDTO>> createActivity(
            @Valid @RequestBody JobActivityRequestDTO request) {

        log.info("Creating job activity for job: {}", request.getJobId());

//        List<JobActivityResponseDTO> response = activityService.createJobActivity(request);

        JobActivityResponseDTO response = activityService.createJobActivity(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Job activity created successfully", response));
    }

    /**
     * Upload photos for activity
     */
    @PostMapping("{clientId}/{jobId}/{activityId}/photos") //("{tenantId}/{activityId}/photos")
    public ResponseEntity<ApiResponse<List<JobActivityPhotoDTO>>> uploadPhotos(
            @PathVariable Integer activityId,
            @PathVariable Integer clientId,
            @PathVariable Integer jobId,
            @RequestParam("photos") List<MultipartFile> photos) {

        log.info("Uploading {} photos for client: {} jobId: {} activity: {} ", photos.size(), clientId, jobId, activityId);

        if (photos.size() > 5) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Maximum 5 photos allowed", null));
        }

        List<JobActivityPhotoDTO> uploadedPhotos =
                activityService.uploadPhotos(activityId, photos, clientId, jobId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Photos uploaded successfully", uploadedPhotos));
    }

    /**
     * Upload signature for activity
     */
    @PostMapping("{clientId}/{jobId}/{activityId}/signature")
    public ResponseEntity<ApiResponse<String>> uploadSignature(
            @PathVariable Integer activityId,
            @PathVariable Integer clientId,
            @PathVariable Integer jobId,
            @RequestParam("signature") MultipartFile signature) {

        String path = activityService.uploadSignature(activityId, signature, clientId, jobId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Signature uploaded", path)
        );
    }

    /**
     * Delete activity photo
     */
    @DeleteMapping("/photos/{photoId}")
    public ResponseEntity<ApiResponse<String>> deleteActivityPhoto(
            @PathVariable Integer photoId) {

        log.info("Deleting photo: {}", photoId);

        try {
            activityService.deleteActivityPhoto(photoId);
            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Photo deleted successfully", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            log.error("Failed to delete photo: {}", photoId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to delete photo", null));
        }
    }

//    /**
//     * Upload documents for JOB (via Activity Controller)
//     * Path: /api/job-activities/{clientId}/{jobId}/document
//     */
//    @PostMapping("{clientId}/{jobId}/document")
//    public ResponseEntity<ApiResponse<List<AttachedJobDocument>>> uploadJobDocuments(
//            @PathVariable Integer clientId,
//            @PathVariable Integer jobId,
//            @RequestParam("files") List<MultipartFile> files) {
//
//        log.info("Uploading {} documents for job: {}", files.size(), jobId);
//
//        if (files.size() > 10) {
//            return ResponseEntity.badRequest()
//                    .body(new ApiResponse<>(false, "Maximum 10 files allowed", null));
//        }
//
//        List<AttachedJobDocument> uploadedDocs =
//                activityService.uploadJobDocuments(files, clientId, jobId);
//
//        return ResponseEntity.ok(
//                new ApiResponse<>(true, "Documents uploaded successfully", uploadedDocs));
//    }
//
//    @GetMapping("{clientId}/{jobId}/document")
//    public ResponseEntity<ApiResponse<List<AttachedJobDocument>>> getJobDocuments(
//            @PathVariable Integer jobId,
//            @PathVariable String clientId) {
//
//        List<AttachedJobDocument> docs =
//                activityService.getDocumentsByJob(jobId);
//
//        return ResponseEntity.ok(
//                new ApiResponse<>(true, "Documents fetched", docs)
//        );
//    }

    @GetMapping("{clientId}/{jobId}/{activityId}/photos")
    public ResponseEntity<ApiResponse<List<JobActivityPhotoDTO>>> getActivityPhotos(
            @PathVariable Integer activityId,
            @PathVariable Integer jobId,
            @PathVariable String clientId) {

        List<JobActivityPhotoDTO> photos =
                activityService.getPhotosByActivity(activityId, jobId, clientId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Photos fetched", photos)
        );
    }

    /**
     * Send activity email manually
     */
    @PostMapping("/{activityId}/send-activity-email")
    public ResponseEntity<ApiResponse<String>> sendActivityEmail(
            @PathVariable Integer activityId) {

        log.info("Sending email for activity: {}", activityId);

        try {
            activityService.sendActivityEmail(activityId);
            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Email sent successfully", null));
        } catch (IllegalStateException e) {
            log.error("Email sending failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            log.error("Failed to send email for activity: {}", activityId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to send email: " + e.getMessage(), null));
        }
    }

    @GetMapping("{clientId}/{jobId}/{activityId}/signature")
    public ResponseEntity<ApiResponse<JobActivitySignatureDTO>> getActivitySignature(
            @PathVariable Integer activityId,
            @PathVariable Integer jobId,
            @PathVariable String clientId) {

        JobActivitySignatureDTO signature =
                activityService.getSignatureByActivity(activityId, jobId, clientId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Signature fetched", signature)
        );
    }


    /**
     * Get activity by ID
     */
    @GetMapping("/{activityId}")
    public ResponseEntity<ApiResponse<JobActivityResponseDTO>> getActivity(
            @PathVariable Integer activityId) {

        log.info("Fetching activity: {}", activityId);

        JobActivityResponseDTO response = activityService.getActivityById(activityId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Activity retrieved successfully", response));
    }

    /**
     * Get all activities for a job
     */
    @GetMapping("/job/{jobId}")
    public ResponseEntity<ApiResponse<List<JobActivityResponseDTO>>> getActivitiesByJob(
            @PathVariable Integer jobId) {

        log.info("Fetching activities for job: {}", jobId);

        List<JobActivityResponseDTO> activities =
                activityService.getActivitiesByJobId(jobId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Activities retrieved successfully", activities));
    }

    /**
     * Update activity
     */
    @PutMapping("/{activityId}")
    public ResponseEntity<ApiResponse<JobActivityResponseDTO>> updateActivity(
            @PathVariable Integer activityId,
            @Valid @RequestBody JobActivityRequestDTO request) {

        log.info("Updating activity: {}", activityId);

        JobActivityResponseDTO response =
                activityService.updateActivity(activityId, request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Activity updated successfully", response));
    }

    /**
     * Delete activity (soft delete)
     */
    @DeleteMapping("/{activityId}")
    public ResponseEntity<ApiResponse<Void>> deleteActivity(
            @PathVariable Integer activityId) {

        log.info("Deleting activity: {}", activityId);

        //activityService.deleteActivity(activityId);
        activityService.hardDeleteActivity(activityId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Activity deleted from db successfully", null));
    }

//    /**
//     * Delete photo
//     */
//    @DeleteMapping("/photos/{photoId}")
//    public ResponseEntity<ApiResponse<Void>> deletePhoto(
//            @PathVariable Integer photoId) {
//
//        log.info("Deleting photo: {}", photoId);
//
//        activityService.deletePhoto(photoId);
//
//        return ResponseEntity.ok(
//                new ApiResponse<>(true, "Photo deleted successfully", null));
//    }

    /**
     * Send activity email
     */
    @PostMapping("/{activityId}/send-email")
    public ResponseEntity<ApiResponse<Void>> sendEmail(
            @PathVariable Integer activityId,
            @RequestBody Map<String, List<String>> payload) {

        log.info("Sending email for activity: {}", activityId);

        List<String> recipients = payload.get("recipients");

        if (recipients == null || recipients.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Recipients list is required", null));
        }

        log.info("Uncomment below to Send email for activity: {}", activityId);
        // activityService.sendActivityEmail(activityId, recipients);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Email sent successfully", null));
    }

    /**
     * Download/view file (photo or signature)
     */
    @GetMapping("/files/**")
    public ResponseEntity<Resource> downloadFile(HttpServletRequest request) {

        // Get the full path after /files/
        String fullPath = request.getRequestURI().split("/files/")[1];

        log.info("Downloading file: {}", fullPath);

        try {
            Resource resource = fileStorageService.loadFileAsResource(fullPath);

            // Determine content type
            String contentType = request.getServletContext()
                    .getMimeType(resource.getFile().getAbsolutePath());

            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (IOException e) {
            log.error("File not found: {}", fullPath, e);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "Job Activity Service",
                "timestamp", LocalDateTime.now().toString()
        ));
    }
}