package com.aibi.neerp.quotation.controller;

import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.quotation.dto.*;
import com.aibi.neerp.quotation.service.QuotationService;
import com.aibi.neerp.quotation.utility.PaginationResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quotations")
@RequiredArgsConstructor
@Slf4j
public class QuotationController {

    private final QuotationService quotationService;

    @GetMapping("/check-existing")
    public ResponseEntity<ApiResponse<Boolean>> checkExistingQuotation(
            @RequestParam Integer combinedEnquiryId,
            @RequestParam Integer leadId) {
        return ResponseEntity.ok(
                quotationService.checkExistingQuotation(combinedEnquiryId, leadId)
        );
    }


    // =========================================================
    // 🔹 CREATE OR UPDATE QUOTATION
    @PostMapping("/save")
    public ApiResponse<QuotationMainResponseDTO> saveQuotation(@RequestBody QuotationMainRequestDTO dto) {
        log.info("Received request to save/update quotation: {}", dto.getQuotationNo());
        System.out.println("------controller start call service-----------");
        return quotationService.saveQuotation(dto);
    }


    // =========================================================
    // 🔹 CREATE NEW REVISION
    // =========================================================
    @PostMapping("/revise/{oldQuotationMainId}")
    public ApiResponse<QuotationMainResponseDTO> reviseQuotation(@PathVariable Integer oldQuotationMainId,
                                                                 @RequestBody QuotationMainRequestDTO request) {
        log.info("Received request to revise quotation: {}", oldQuotationMainId);
        System.out.println("------controller start call service for revise-----------");
        return quotationService.createRevisionFromDTO(oldQuotationMainId, request);
    }


    // =========================================================
    // 🔹 Add the missing lift to revised quotation
    // =========================================================
    @PostMapping("/{quotationMainId}/add-lift")
    public ApiResponse<QuotationMainResponseDTO> addMissingLift(
            @PathVariable Integer quotationMainId,
            @RequestBody QuotationLiftDetailRequestDTO dto
    ) {
        log.info("➡️ Add missing lift for quotation {}", quotationMainId);
        return quotationService.addMissingLift(quotationMainId, dto);
    }


    @PutMapping("/mark-saved")
    public ApiResponse<String> markLiftsAsSaved(@RequestBody LiftSaveStatusRequestDTO request) {
        log.info("🔹 Marking lifts as saved: {}", request);

        // Pass the full request object to the service layer
        quotationService.markLiftsAsSaved(request);

        return new ApiResponse<>(true, "Lifts and Quotation updated successfully!", null);
    }


//    @PutMapping("/mark-saved")
//    public ApiResponse<String> markLiftsAsSaved(@RequestBody LiftSaveStatusRequestDTO request) {
//        log.info("🔹 Marking lifts as saved: {}", request);
//        quotationService.markLiftsAsSaved(request.getLiftIds());
//        return new ApiResponse<>(true, "Lifts marked as saved successfully!", null);
//    }


    // =========================================================
    // 🔹 GET ALL QUOTATIONS
    // =========================================================
    @GetMapping
    public ApiResponse<List<QuotationMainResponseDTO>> getAllQuotations() {
        log.info("Fetching all quotations...");
        return quotationService.getAllQuotations();
    }


    // =========================================================
    // 🔹 GET QUOTATION BY ID (with full lift details)
    // =========================================================
//    @GetMapping("/{id}")
//    public ApiResponse<QuotationMainResponseDTO> getQuotationById(@PathVariable Integer id) {
//        log.info("Fetching quotation with ID: {}", id);
//        return quotationService.getQuotationById(id);
//    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<QuotationMainResponseDTO>> getQuotationById(
            @PathVariable Integer id) {

        log.info("API Hit → GET /api/quotations/{}", id);

        ApiResponse<QuotationMainResponseDTO> response = quotationService.getQuotationById(id);

        if (!response.isSuccess()) {
            // ❗ Quotation not found → return 404
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        // ✔ Return 200 OK
        return ResponseEntity.ok(response);
    }


    // =========================================================
    // 🔹 GET QUOTATION BY ID (with full lift details for revised quotation with merged lifts(get from parent lift if not exists) )
    // =========================================================
    @GetMapping("/revised/{id}")
    public ResponseEntity<ApiResponse<QuotationMainResponseDTO>> getQuotationWithMergedLifts(
            @PathVariable Integer id
    ) {
        ApiResponse<QuotationMainResponseDTO> response = quotationService.getQuotationWithMergedLifts(id);
        if (!response.isSuccess()) {
            // ❗ Quotation not found → return 404
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        // ✔ Return 200 OK
        return ResponseEntity.ok(response);
    }


    // =========================================================
    // 🔹 DELETE QUOTATION
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteQuotation(@PathVariable Integer id) {
        log.info("Deleting quotation with ID: {}", id);
        return quotationService.deleteQuotation(id);
    }


    // =========================================================
    // 🔹 GET QUOTATIONS BY LEAD ID AND COMBINED ENQUIRY ID
    // =========================================================

    /**
     * ✅ Fetch quotations and their associated lift details for a given lead and combined enquiry.
     * <p>
     * Example API call:
     * GET /api/quotations/by-lead-and-combined-enquiry?leadId=12&combinedEnquiryId=45
     */
    @GetMapping("/by-lead-and-combined-enquiry")
    public ApiResponse<List<QuotationMainResponseDTO>> getQuotationsByLeadAndCombinedEnquiry(
            @RequestParam(required = false) Integer leadId,
            @RequestParam(required = false) Integer combinedEnquiryId) {

        log.info("Controller: Fetching quotations for Lead ID: {} and Combined Enquiry ID: {}", leadId, combinedEnquiryId);
        System.out.println("➡️ Controller received request - Lead ID: " + leadId + ", Combined Enquiry ID: " + combinedEnquiryId);

        return quotationService.getQuotationsByLeadAndCombinedEnquiry(leadId, combinedEnquiryId);
    }


    // =========================================================
    // 🔹 GET ALL REVISIONS (ACTIVE & SUPERSEDED)
    // =========================================================

    /**
     * ✅ Fetches ALL editions (revisions) of a quotation chain
     * associated with a specific lead and combined enquiry, optionally filtered by quotation number,
     * and only including valid editions (edition > 0).
     * <p>
     * Example API call:
     * GET /api/quotations/all-revisions-by-enquiry?leadId=12&combinedEnquiryId=45&quotationNo=QUOT-12-001
     */
    @GetMapping("/all-revisions-by-enquiry")
    public ApiResponse<List<QuotationMainResponseDTO>> getAllRevisionsByEnquiry(
            @RequestParam(required = false) Integer leadId,
            @RequestParam(required = false) Integer combinedEnquiryId,
            @RequestParam(required = false) String quotationNo) { // 💡 New Parameter

        log.info("Controller: Fetching ALL REVISIONS. Lead ID: {}, Combined Enquiry ID: {}, Quotation No: {}",
                leadId, combinedEnquiryId, quotationNo);

        // Update the service method call to pass the new parameter
        return quotationService.getQuotationsByLeadCombinedEnquiryAndQuotationNo(
                leadId,
                combinedEnquiryId,
                quotationNo // Pass the quotation number
        );
    }


    // ================================================================================================================
    // 🔹 GET EXISTING ALL QUOTATIONS WITHOUT LIFTS DETAILS for new quotation quotation list page
    // ================================================================================================================

    /**
     * Fetches all QuotationMain records without loading the detailed lift information.
     */
    @GetMapping("/all-quotations-without-lifts")
    public ResponseEntity<ApiResponse<List<QuotationMainResponseDTO>>> getAllQuotationsListWithoutPagination() {
        log.info("REST request to fetch all QuotationMain records for list view.");

        // Call the service method
        ApiResponse<List<QuotationMainResponseDTO>> response = quotationService.getAllMainQuotations();

        // Return the response directly
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            // Use 500 Internal Server Error for generalized service exceptions
            return ResponseEntity.status(500).body(response);
        }
    }


    // ============================================================================================================
    // 🔹 GET EXISTING ALL QUOTATIONS BY QUOTATION NO WITHOUT LIFTS DETAILS for revision page
    // =============================================================================================================
    // 🔹 Fetch all editions by Quotation No
    @GetMapping("/by-quotation-no")
    public ResponseEntity<ApiResponse<?>> getByQuotationNo(
            @RequestParam String quotationNo) {

        log.info("API Call: Get quotations by Quotation No = {}", quotationNo);

        ApiResponse<List<QuotationMainResponseDTO>> response =
                quotationService.getByQuotationNo(quotationNo.trim());

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // 🔹 GET PAGE WISE QUOTATIONS WITHOUT LIFTS DETAILS
    // =========================================================
    @GetMapping("/pagination-quotations-without-lifts")
    public ResponseEntity<ApiResponse<PaginationResponse<QuotationMainResponseDTO>>> getAllQuotationsList(
            // 💡 Spring automatically creates Pageable from request params:
            // ?page=0&size=10&sort=id,desc (or sort=totalAmount,asc)
            @PageableDefault(page = 0, size = 10, sort = "id") Pageable pageable
    ) {

        // Check if sorting is requested on the DTO-only field
        Sort sort = pageable.getSort();
        // ✅ Fix sorting for DTO-only field: createdByEmployeeName
        if (sort.getOrderFor("createdByEmployeeName") != null) {
            Sort.Order order = sort.getOrderFor("createdByEmployeeName");

            // ✅ Map to REAL entity field
//            Sort newSort = Sort.by(
//                    new Sort.Order(order.getDirection(), "createdBy.employeeName").ignoreCase(),
//                    new Sort.Order(order.getDirection(), "createdBy.username").ignoreCase()
//            );

            Sort newSort = Sort.by(
                    new Sort.Order(
                            order.getDirection(),
                            "lead.activityBy.employeeName"
                    ).ignoreCase()
            );

            pageable = PageRequest.of(
                    pageable.getPageNumber(),
                    pageable.getPageSize(),
                    newSort
            );
        }

        // ✅ Case-insensitive Site Name sorting
        if (sort.getOrderFor("siteName") != null) {
            Sort.Order order = sort.getOrderFor("siteName");

            Sort siteSort = Sort.by(
                    new Sort.Order(order.getDirection(), "siteName").ignoreCase()
            );

            pageable = PageRequest.of(
                    pageable.getPageNumber(),
                    pageable.getPageSize(),
                    siteSort
            );
        }

        // ✅ Case-insensitive Customer Name sorting
        if (sort.getOrderFor("customerName") != null) {
            Sort.Order order = sort.getOrderFor("customerName");
            Sort customerSort = Sort.by(new Sort.Order(order.getDirection(), "customerName").ignoreCase());
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), customerSort);
        }

        // ✅ Case-insensitive Quotation No sorting
        if (sort.getOrderFor("quotationNo") != null) {
            Sort.Order order = sort.getOrderFor("quotationNo");
            Sort quotationNoSort = Sort.by(new Sort.Order(order.getDirection(), "quotationNo").ignoreCase());
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), quotationNoSort);
        }

        log.info("REST request to fetch paginated QuotationMain records. Pageable: {}", pageable);

        // Call the service method with Pageable
        ApiResponse<PaginationResponse<QuotationMainResponseDTO>> response = quotationService.getPageWiseMainQuotations(pageable);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(500).body(response);
        }
    }


    // =========================================================
    // 🔹 FINALIZE QUOTATION
    // =========================================================

    /**
     * Finalizes a specific quotation by ID.
     *
     * @param quotationId The ID of the quotation to finalize.
     * @param request     The ID of the employee who finalize.
     * @return ApiResponse containing success status and message.
     */
    @PutMapping("/{quotationId}/finalize")
    public ResponseEntity<ApiResponse<Void>> finalizeQuotation(@PathVariable Integer quotationId, @RequestBody QuotationIdRequestDTO request) {
        log.info("REST request to finalize Quotation ID: {} by Employee ID: {}",
                quotationId, request.getEmployeeId());

        System.out.println("REST request to finalize Quotation ID: " + quotationId + " by Employee ID: " +
                request.getEmployeeId());
        ApiResponse<Void> response = quotationService.finalizeQuotation(quotationId, request.getEmployeeId());

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            // Use 400 Bad Request if the finalization fails due to business rules (e.g., already finalized)
            return ResponseEntity.status(400).body(response);
        }
    }


    // =========================================================
    // 🔹 DELETE QUOTATION
    // =========================================================

    /**
     * Delete a specific quotation by ID.
     *
     * @param quotationId The ID of the quotation to finalize.
     * @param request     The ID of the employee who finalize.
     * @return ApiResponse containing success status and message.
     */
    @PutMapping("/{quotationId}/delete-by-status")
    public ResponseEntity<ApiResponse<Void>> deleteQuotation(@PathVariable Integer quotationId, @RequestBody QuotationIdRequestDTO request) {
        log.info("REST request to delete Quotation ID: {} by Employee ID: {}",
                quotationId, request.getEmployeeId());

        ApiResponse<Void> response = quotationService.deleteQuotation(quotationId, request.getEmployeeId());

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            // Use 400 Bad Request if the finalization fails due to business rules (e.g., already finalized)
            return ResponseEntity.status(400).body(response);
        }
    }


    // =========================================================
    // 🔹 GET ALL FINALIZED & NOT DELETED QUOTATIONS (NO LIFTS) To Add Job
    // =========================================================
    @GetMapping("/finalized-active")
    public ResponseEntity<ApiResponse<List<QuotationMinimalDTO>>> getFinalizedActiveQuotations() {

        log.info("Fetching all FINALIZED & ACTIVE (not deleted) quotations without lifts...");

        ApiResponse<List<QuotationMinimalDTO>> response =
                quotationService.getFinalizedActiveQuotations();

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(500).body(response);
        }
    }


    // =========================================================
    // 🔹 HEALTH CHECK / DEBUG
    @GetMapping("/ping")
    public String ping() {
        return "QuotationController is up and running ✅";
    }
}
