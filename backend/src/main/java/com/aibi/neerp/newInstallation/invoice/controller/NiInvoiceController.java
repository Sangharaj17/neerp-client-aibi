package com.aibi.neerp.newInstallation.invoice.controller;

import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.newInstallation.invoice.dto.NiInvoiceRequestDTO;
import com.aibi.neerp.newInstallation.invoice.dto.NiInvoiceResponseDTO;
import com.aibi.neerp.newInstallation.invoice.dto.NiInvoiceSummaryDTO;
import com.aibi.neerp.newInstallation.invoice.dto.PageResponse;
import com.aibi.neerp.newInstallation.invoice.service.NiInvoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ni-invoices")
@RequiredArgsConstructor
@Slf4j
public class NiInvoiceController {

    private final NiInvoiceService service;

    /* ================= CREATE ================= */

    @PostMapping
    public ResponseEntity<ApiResponse<NiInvoiceResponseDTO>> create(
            @Valid @RequestBody NiInvoiceRequestDTO dto) {

        log.info("Request to create NI Invoice");

        ApiResponse<NiInvoiceResponseDTO> response = service.createInvoice(dto);

        if (!response.isSuccess()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(response);
        }

        return ResponseEntity.ok(response);
    }

    /* ================= GET BY ID ================= */

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NiInvoiceResponseDTO>> get(
            @PathVariable Integer id) {

        log.info("Request to get NI Invoice {}", id);

        ApiResponse<NiInvoiceResponseDTO> response = service.getById(id);

        if (!response.isSuccess()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(response);
        }

        return ResponseEntity.ok(response);
    }

    /* ================= GET ALL ================= */

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<NiInvoiceResponseDTO>>> listAll() {

        log.info("Request to get all NI Invoices");

        return ResponseEntity.ok(service.getAll());
    }

    /**
     * 🔹 Fetch invoices by Job
     * @param jobId Job ID
     * @param pendingOnly true → only unpaid invoices
     */
    @GetMapping("/by-job/{jobId}")
    public ApiResponse<List<NiInvoiceResponseDTO>> getInvoicesByJob(
            @PathVariable Integer jobId,
            @RequestParam(defaultValue = "true") boolean pendingOnly
    ) {
        log.info("Fetching invoices for jobId={}, pendingOnly={}", jobId, pendingOnly);
        return service.getInvoicesByJob(jobId, pendingOnly);
    }


    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<NiInvoiceResponseDTO>>> listPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {

        log.info("Request to get paginated NI invoices");

        return ResponseEntity.ok(
                service.getAll(page, size, search, sortBy, direction)
        );
    }


    /* ================= UPDATE ================= */

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NiInvoiceResponseDTO>> update(
            @PathVariable Integer id,
            @RequestBody NiInvoiceRequestDTO dto) {

        log.info("Request to update NI Invoice {}", id);

        ApiResponse<NiInvoiceResponseDTO> response = service.update(id, dto);

        if (!response.isSuccess()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(response);
        }

        return ResponseEntity.ok(response);
    }

    /* ================= DELETE ================= */

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(
            @PathVariable Integer id) {

        log.info("Request to delete NI Invoice {}", id);

        ApiResponse<String> response = service.delete(id);

        if (!response.isSuccess()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(response);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<NiInvoiceSummaryDTO>> summary() {
        log.info("Request to get NI Invoice summary");
        return ResponseEntity.ok(service.getSummary());
    }
}
