package com.aibi.neerp.amc.payments.service;

import com.aibi.neerp.amc.invoice.entity.AmcInvoice;
import com.aibi.neerp.amc.invoice.repository.AmcInvoiceRepository;
import com.aibi.neerp.amc.jobs.initial.entity.AmcJob;
import com.aibi.neerp.amc.jobs.initial.repository.AmcJobRepository;
import com.aibi.neerp.amc.jobs.renewal.entity.AmcRenewalJob;
import com.aibi.neerp.amc.jobs.renewal.repository.AmcRenewalJobRepository;
import com.aibi.neerp.amc.payments.dto.AmcJobPaymentRequestDto;
import com.aibi.neerp.amc.payments.dto.AmcJobPaymentResponseDto;
import com.aibi.neerp.amc.payments.entity.AmcJobPayment;
import com.aibi.neerp.amc.payments.repository.AmcJobPaymentRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AmcJobPaymentService {

    private final AmcJobPaymentRepository paymentRepository;
    private final AmcJobRepository jobRepository;
    private final AmcRenewalJobRepository renewalJobRepository;
    private final AmcInvoiceRepository invoiceRepository;
    private final AmcJobRepository amcJobRepository;
    private final AmcRenewalJobRepository amcRenewalJobRepository;

    // ✅ Create new payment
    public AmcJobPaymentResponseDto createPayment(AmcJobPaymentRequestDto dto) {

        AmcJob amcJob = (dto.getJobId() != null)
                ? jobRepository.findById(dto.getJobId()).orElse(null)
                : null;

        AmcRenewalJob amcRenewalJob = (dto.getRenewalJobId() != null)
                ? renewalJobRepository.findById(dto.getRenewalJobId()).orElse(null)
                : null;

        AmcInvoice amcInvoice = (dto.getInvoiceId() != null)
                ? invoiceRepository.findById(dto.getInvoiceId()).orElse(null)
                : null;

        AmcJobPayment payment = AmcJobPayment.builder()
                .paymentDate(dto.getPaymentDate())
                .invoiceNo(dto.getInvoiceNo())
                .payFor(dto.getPayFor())
                .paymentType(dto.getPaymentType())
                .chequeNo(dto.getChequeNo())
                .bankName(dto.getBankName())
                .branchName(dto.getBranchName())
                .amountPaid(dto.getAmountPaid())
                .paymentCleared(dto.getPaymentCleared())
                .amcJob(amcJob)
                .amcRenewalJob(amcRenewalJob)
                .amcInvoice(amcInvoice)
                .build();

        AmcJobPayment saved = paymentRepository.save(payment);
        
        updateInvoice(dto.getAmountPaid(), amcJob, amcRenewalJob, amcInvoice, dto.getPaymentCleared());
        
        return mapToResponse(saved);
    }
    
    private void updateJobAmount(BigDecimal deducedAmount, AmcJob amcJob, AmcRenewalJob amcRenewalJob) {

        if (deducedAmount == null || deducedAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Invalid payment amount: " + deducedAmount);
        }

        if (amcJob != null) {
            BigDecimal balanceAmount = amcJob.getBalanceAmount() != null ? amcJob.getBalanceAmount() : BigDecimal.ZERO;

            BigDecimal newBalance = balanceAmount.subtract(deducedAmount);
            if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
                newBalance = BigDecimal.ZERO; // prevent negative balance
            }

            amcJob.setBalanceAmount(newBalance);
            amcJobRepository.save(amcJob);

        } else if (amcRenewalJob != null) {
            BigDecimal balanceAmount = amcRenewalJob.getBalanceAmount() != null ? amcRenewalJob.getBalanceAmount() : BigDecimal.ZERO;

            BigDecimal newBalance = balanceAmount.subtract(deducedAmount);
            if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
                newBalance = BigDecimal.ZERO; // prevent negative balance
            }

            amcRenewalJob.setBalanceAmount(newBalance);
            amcRenewalJobRepository.save(amcRenewalJob);

        } else {
            throw new IllegalArgumentException("Both AMC Job and AMC Renewal Job are null. Cannot update balance.");
        }
    }

    
    private void updateInvoice(BigDecimal deducedAmount , AmcJob amcJob , AmcRenewalJob amcRenewalJob ,
    		AmcInvoice amcInvoice , String paymentCleared) {
    	
    	if(paymentCleared.equalsIgnoreCase("yes")) {
    		amcInvoice.setIsCleared(1);
    		updateJobAmount(deducedAmount, amcJob, amcRenewalJob);
    	}else {
    		amcInvoice.setIsCleared(0);
    	}
    	
    	invoiceRepository.save(amcInvoice);
    	
    }

    // ✅ Get all payments
    public List<AmcJobPaymentResponseDto> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ✅ Get payment by ID
    public AmcJobPaymentResponseDto getPaymentById(Integer id) {
        AmcJobPayment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + id));
        return mapToResponse(payment);
    }

    // ✅ Delete payment
    public void deletePayment(Integer id) {
        paymentRepository.deleteById(id);
    }

    // ✅ Convert Entity → Response DTO
    private AmcJobPaymentResponseDto mapToResponse(AmcJobPayment entity) {
        return AmcJobPaymentResponseDto.builder()
                .paymentId(entity.getPaymentId())
                .paymentDate(entity.getPaymentDate())
                .invoiceNo(entity.getInvoiceNo())
                .payFor(entity.getPayFor())
                .paymentType(entity.getPaymentType())
                .chequeNo(entity.getChequeNo())
                .bankName(entity.getBankName())
                .branchName(entity.getBranchName())
                .amountPaid(entity.getAmountPaid())
                .paymentCleared(entity.getPaymentCleared())
                .jobId(entity.getAmcJob() != null ? entity.getAmcJob().getJobId() : null)
                .renewalJobId(entity.getAmcRenewalJob() != null ? entity.getAmcRenewalJob().getRenewalJobId() : null)
                .invoiceId(entity.getAmcInvoice() != null ? entity.getAmcInvoice().getInvoiceId() : null)
                .build();
    }
}
