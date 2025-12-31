package com.aibi.neerp.quotation.jobs.controller;

import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.quotation.jobs.dto.InvoicePaymentSummaryDTO;
import com.aibi.neerp.quotation.jobs.dto.JobPaymentRequestDTO;
import com.aibi.neerp.quotation.jobs.dto.JobPaymentResponseDTO;
import com.aibi.neerp.quotation.jobs.service.JobPaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;

import java.util.List;

@RestController
@RequestMapping("/api/job-payments")
@RequiredArgsConstructor
@Slf4j
public class JobPaymentController {

    private final JobPaymentService jobPaymentService;

    @PostMapping
    public ApiResponse<JobPaymentResponseDTO> createPayment(
            @Valid @RequestBody JobPaymentRequestDTO dto
    ) {
        return jobPaymentService.createPayment(dto);
    }

    @GetMapping("/invoice/{invoiceId}")
    public ApiResponse<List<JobPaymentResponseDTO>> getPaymentsByInvoice(
            @PathVariable Integer invoiceId
    ) {
        return jobPaymentService.getPaymentsByInvoice(invoiceId);
    }

    @GetMapping("/invoice/{invoiceId}/summary")
    public ApiResponse<InvoicePaymentSummaryDTO> getInvoiceSummary(
            @PathVariable Integer invoiceId
    ) {
        return jobPaymentService.getInvoicePaymentSummary(invoiceId);
    }

    @GetMapping("/getAllPaymentsPaged")
    public Page<JobPaymentResponseDTO> getAllPaymentsPaged(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return jobPaymentService.getAllPaymentsPaged(search, page, size);
    }
}

