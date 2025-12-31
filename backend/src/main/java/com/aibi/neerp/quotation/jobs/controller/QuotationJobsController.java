package com.aibi.neerp.quotation.jobs.controller;

import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.quotation.jobs.dto.JobForPaymentResponseDTO;
import com.aibi.neerp.quotation.jobs.dto.NiJobDetailPageResponseDto;
import com.aibi.neerp.quotation.jobs.dto.QuotationJobRequestDTO;
import com.aibi.neerp.quotation.jobs.dto.QuotationJobResponseDTO;
import com.aibi.neerp.quotation.jobs.service.QuotationJobsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class QuotationJobsController {

    private final QuotationJobsService service;

    @PostMapping
    public ResponseEntity<ApiResponse<QuotationJobResponseDTO>> create(@RequestBody QuotationJobRequestDTO dto) {
        log.info("Request to create job");
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<QuotationJobResponseDTO>> update(@PathVariable Integer id,
                                                                 @RequestBody QuotationJobRequestDTO dto) {
        log.info("Request to update job {}", id);
        ApiResponse<QuotationJobResponseDTO> response = service.update(id, dto);
        
        if (!response.isSuccess()) {
             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/without-activities")
    public ResponseEntity<ApiResponse<QuotationJobResponseDTO>> get(@PathVariable Integer id) {
        log.info("Request to get job {}", id);
        ApiResponse<QuotationJobResponseDTO> response = service.getById(id);

        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/invoice")
    public ResponseEntity<ApiResponse<QuotationJobResponseDTO>> getForInvoice(@PathVariable Integer id) {
        log.info("Request to get job to add invoice {}", id);
        ApiResponse<QuotationJobResponseDTO> response = service.getByIdToAddInvoice(id);

        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<QuotationJobResponseDTO>> getWithActivities(
            @PathVariable Integer id) {
        log.info("Request to get job {} with activities", id);
        ApiResponse<QuotationJobResponseDTO> response = service.getByIdWithActivities(id);

        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/details/{jobId}")
    public ApiResponse<NiJobDetailPageResponseDto> getJobDetailPage(@PathVariable Integer jobId) {

        log.info("Fetching NI Job detail page for jobId={}", jobId);

        return new ApiResponse<>(
                true,
                "NI Job Detail Page Fetched Successfully",
                service.getJobDetailPage(jobId)
        );
    }



    @GetMapping
    public ResponseEntity<ApiResponse<List<QuotationJobResponseDTO>>> getAll() {
        log.info("Request to get all jobs");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/payment")
    public ResponseEntity<ApiResponse<List<JobForPaymentResponseDTO>>> getJobsForPayment() {
        log.info("Fetching jobs for payment");
        return ResponseEntity.ok(service.getAllJobsForPayment());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Integer id) {
        log.info("Request to delete job {}", id);
        ApiResponse<String> response = service.delete(id);
        
        if (!response.isSuccess()) {
             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        return ResponseEntity.ok(response);
    }

    /**
     * Upload Documents for Job
     * User requested path: /api/jobs/${clientId}/${jobId}/${activityId}/document
     * We include activityId in path but treat it as Job Document.
     */
    /**
     * Upload Documents for Job
     * User requested path: /api/jobs/${clientId}/${jobId}/document
     */
    @PostMapping("/{clientId}/{jobId}/document")
    public ResponseEntity<ApiResponse<List<com.aibi.neerp.quotation.jobs.entity.NiJobDocument>>> uploadJobDocuments(
            @PathVariable Integer clientId,
            @PathVariable Integer jobId,
            @RequestParam("files") List<org.springframework.web.multipart.MultipartFile> files) {

        log.info("Uploading documents for job {}.", jobId);

        List<com.aibi.neerp.quotation.jobs.entity.NiJobDocument> docs =
                service.uploadJobDocuments(files, clientId, jobId);

        return ResponseEntity.ok(new ApiResponse<>(true, "Documents uploaded successfully", docs));
    }

    @GetMapping("/{clientId}/{jobId}/document")
    public ResponseEntity<ApiResponse<List<com.aibi.neerp.quotation.jobs.entity.NiJobDocument>>> getJobDocuments(
            @PathVariable Integer clientId,
            @PathVariable Integer jobId) {

        List<com.aibi.neerp.quotation.jobs.entity.NiJobDocument> docs =
                service.getDocumentsByJob(jobId);

        return ResponseEntity.ok(new ApiResponse<>(true, "Documents fetched", docs));
    }

    @DeleteMapping("/{clientId}/{jobId}/document/{documentId}")
    public ResponseEntity<ApiResponse<String>> deleteJobDocument(
            @PathVariable Integer clientId,
            @PathVariable Integer jobId,
            @PathVariable Long documentId) {

        log.info("Deleting document {} for job {}", documentId, jobId);

        try {
            service.deleteJobDocument(documentId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Document deleted successfully", null));
        } catch (Exception e) {
            log.error("Failed to delete document: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to delete document: " + e.getMessage(), null));
        }
    }
}
