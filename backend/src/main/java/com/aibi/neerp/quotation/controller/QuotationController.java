package com.aibi.neerp.quotation.controller;

import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.quotation.dto.LiftSaveStatusRequestDTO;
import com.aibi.neerp.quotation.dto.QuotationIdRequestDTO;
import com.aibi.neerp.quotation.dto.QuotationMainRequestDTO;
import com.aibi.neerp.quotation.dto.QuotationMainResponseDTO;
import com.aibi.neerp.quotation.service.QuotationService;
import com.aibi.neerp.quotation.utility.PaginationResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quotations")
@RequiredArgsConstructor
@Slf4j
public class QuotationController {

    private final QuotationService quotationService;

    // =========================================================
    // 🔹 CREATE OR UPDATE QUOTATION
    @PostMapping("/save")
    public ApiResponse<QuotationMainResponseDTO> saveQuotation(@RequestBody QuotationMainRequestDTO dto) {
        log.info("Received request to save/update quotation: {}", dto.getQuotationNo());
        System.out.println("------controller start call service-----------");
        return quotationService.saveQuotation(dto);
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
    @GetMapping
    public ApiResponse<List<QuotationMainResponseDTO>> getAllQuotations() {
        log.info("Fetching all quotations...");
        return quotationService.getAllQuotations();
    }

    // =========================================================
    // 🔹 GET QUOTATION BY ID
    @GetMapping("/{id}")
    public ApiResponse<QuotationMainResponseDTO> getQuotationById(@PathVariable Integer id) {
        log.info("Fetching quotation with ID: {}", id);
        return quotationService.getQuotationById(id);
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
    /**
     * ✅ Fetch quotations and their associated lift details for a given lead and combined enquiry.
     *
     * Example API call:
     *  GET /api/quotations/by-lead-and-combined-enquiry?leadId=12&combinedEnquiryId=45
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
    // 🔹 GET EXISTING ALL QUOTATIONS WITHOUT LIFTS DETAILS
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

    // =========================================================
    // 🔹 GET PAGE WISE QUOTATIONS WITHOUT LIFTS DETAILS
    @GetMapping("/pagination-quotations-without-lifts")
    public ResponseEntity<ApiResponse<PaginationResponse<QuotationMainResponseDTO>>> getAllQuotationsList(
            // 💡 Spring automatically creates Pageable from request params:
            // ?page=0&size=10&sort=id,desc (or sort=totalAmount,asc)
            @PageableDefault(page = 0, size = 10, sort = "id") Pageable pageable
    ) {
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
    /**
     * Finalizes a specific quotation by ID.
     * @param quotationId The ID of the quotation to finalize.
     * @param request The ID of the employee who finalize.
     * @return ApiResponse containing success status and message.
     */
    @PutMapping("/{quotationId}/finalize")
    public ResponseEntity<ApiResponse<Void>> finalizeQuotation(@PathVariable Integer quotationId, @RequestBody QuotationIdRequestDTO request) {
        log.info("REST request to finalize Quotation ID: {} by Employee ID: {}",
                quotationId, request.getEmployeeId());

        System.out.println("REST request to finalize Quotation ID: "+quotationId+" by Employee ID: "+
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
    /**
     * Delete a specific quotation by ID.
     * @param quotationId The ID of the quotation to finalize.
     * @param request The ID of the employee who finalize.
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
    // 🔹 HEALTH CHECK / DEBUG
    @GetMapping("/ping")
    public String ping() {
        return "QuotationController is up and running ✅";
    }
}
