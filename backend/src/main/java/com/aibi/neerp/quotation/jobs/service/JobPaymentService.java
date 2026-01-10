package com.aibi.neerp.quotation.jobs.service;

import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.newInstallation.invoice.entity.NiInvoice;
import com.aibi.neerp.newInstallation.invoice.repository.NiInvoiceRepository;
import com.aibi.neerp.quotation.jobs.dto.InvoicePaymentSummaryDTO;
import com.aibi.neerp.quotation.jobs.dto.JobPaymentRequestDTO;
import com.aibi.neerp.quotation.jobs.dto.JobPaymentResponseDTO;
import com.aibi.neerp.quotation.jobs.entity.JobPayment;
import com.aibi.neerp.quotation.jobs.entity.QuotationJobs;
import com.aibi.neerp.quotation.jobs.repository.JobPaymentRepository;
import com.aibi.neerp.quotation.jobs.repository.QuotationJobsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class JobPaymentService {

    private final JobPaymentRepository paymentRepo;
    private final NiInvoiceRepository invoiceRepo;
    private final QuotationJobsRepository jobRepo;
    private final EmployeeRepository employeeRepo;

    public ApiResponse<JobPaymentResponseDTO> createPayment(JobPaymentRequestDTO dto) {

        NiInvoice invoice = invoiceRepo.findById(dto.getInvoiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));

        QuotationJobs job = jobRepo.findById(dto.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        Employee createdBy = null;

        if (dto.getCreatedBy() != null) {
            createdBy = employeeRepo.findById(dto.getCreatedBy())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Employee not found with ID: " + dto.getCreatedBy()
                            ));
        }

        Boolean manualCleared = dto.getPaymentCleared();

        BigDecimal totalPaidSoFar =
                paymentRepo.getTotalPaidByInvoice(invoice.getInvoiceId());

        BigDecimal newTotalPaid = totalPaidSoFar.add(dto.getAmountPaid());

        BigDecimal invoiceTotal = invoice.getTotalAmount();

        boolean isFullyPaid =
                newTotalPaid.compareTo(invoiceTotal) >= 0;

        JobPayment payment = JobPayment.builder()
                .job(job)
                .invoice(invoice)
                .invoiceNo(invoice.getInvoiceNo())
                .paymentDate(dto.getPaymentDate())
                .amountPaid(dto.getAmountPaid())
                .paymentType(dto.getPaymentType())
                .chequeNo(dto.getChequeNo())
                .bankName(dto.getBankName())
                .branchName(dto.getBranchName())
                .payFor(dto.getPayFor())
                //.paymentCleared(isFullyPaid)
                .paymentCleared(
                        manualCleared != null ? manualCleared : isFullyPaid
                )
                .createdBy(createdBy)
                .build();

        paymentRepo.save(payment);

        // ✅ Auto-clear invoice only when fully paid
        //invoice.setIsCleared(isFullyPaid);
        if (Boolean.TRUE.equals(manualCleared)) {
            invoice.setIsCleared(true);
        } else {
            invoice.setIsCleared(false);
        }

        invoiceRepo.save(invoice);

        return new ApiResponse<>(
                true,
                isFullyPaid ? "Invoice fully paid" : "Partial payment recorded",
                mapToResponse(payment)
        );
    }

    public ApiResponse<List<JobPaymentResponseDTO>> getPaymentsByInvoice(Integer invoiceId) {
        List<JobPaymentResponseDTO> list =
                paymentRepo.findByInvoice_InvoiceId(invoiceId)
                        .stream()
                        .map(this::mapToResponse)
                        .toList();

        return new ApiResponse<>(true, "Payments fetched", list);
    }

    public Page<JobPaymentResponseDTO> getAllPaymentsPaged(String search, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "payment_id"));
        return paymentRepo.searchPayments(search, pageRequest)
                .map(this::mapToResponse);
    }

    public ApiResponse<InvoicePaymentSummaryDTO> getInvoicePaymentSummary(Integer invoiceId) {

        NiInvoice invoice = invoiceRepo.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));

        BigDecimal paid =
                paymentRepo.getTotalPaidByInvoice(invoiceId);

        BigDecimal balance =
                invoice.getTotalAmount().subtract(paid);

        InvoicePaymentSummaryDTO summary =
                InvoicePaymentSummaryDTO.builder()
                        .invoiceId(invoiceId)
                        .invoiceNo(invoice.getInvoiceNo())
                        .invoiceAmount(invoice.getTotalAmount())
                        .totalPaid(paid)
                        .balanceAmount(balance.max(BigDecimal.ZERO))
                        .isCleared(balance.compareTo(BigDecimal.ZERO) <= 0)
                        .build();

        return new ApiResponse<>(true, "Invoice payment summary", summary);
    }

    private JobPaymentResponseDTO mapToResponse(JobPayment p) {
        return JobPaymentResponseDTO.builder()
                .paymentId(p.getPaymentId())
                .jobId(p.getJob().getJobId())
                .jobNo(p.getJob().getJobNo())
                .jobType(p.getJob().getJobType().getEnquiryTypeName()) // Assuming EnquiryType has getName()
                .startDate(p.getJob().getStartDate())
                .invoiceId(p.getInvoice().getInvoiceId())
                .invoiceNo(p.getInvoiceNo())
                .paymentDate(p.getPaymentDate())
                .amountPaid(p.getAmountPaid())
                .paymentType(p.getPaymentType())
                .chequeNo(p.getChequeNo())
                .bankName(p.getBankName())
                .branchName(p.getBranchName())
                .paymentCleared(p.getPaymentCleared())
                .payFor(p.getPayFor())
                .customerName(p.getJob().getCustomer().getCustomerName()) // Assuming Customer has getCustomerName()
                .siteName(p.getJob().getSite().getSiteName())
                .createdAt(p.getCreatedAt())
                .build();
    }
}

