package com.aibi.neerp.amc.payments.service;

import com.aibi.neerp.amc.invoice.entity.AmcInvoice;
import com.aibi.neerp.amc.invoice.repository.AmcInvoiceRepository;
import com.aibi.neerp.amc.jobs.initial.entity.AmcJob;
import com.aibi.neerp.amc.jobs.initial.repository.AmcJobRepository;
import com.aibi.neerp.amc.jobs.renewal.entity.AmcRenewalJob;
import com.aibi.neerp.amc.jobs.renewal.repository.AmcRenewalJobRepository;
import com.aibi.neerp.amc.payments.dto.AmcJobPaymentRequestDto;
import com.aibi.neerp.amc.payments.dto.AmcJobPaymentResponseDto;
import com.aibi.neerp.amc.payments.dto.PaymentSummaryDto;
import com.aibi.neerp.amc.payments.dto.PaymentTypeCount;
import com.aibi.neerp.amc.payments.entity.AmcJobPayment;
import com.aibi.neerp.amc.payments.repository.AmcJobPaymentRepository;
import com.aibi.neerp.customer.entity.Customer;
import com.aibi.neerp.customer.entity.Site;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
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

 // ✅ Refactored Service Layer Method
    public Page<AmcJobPaymentResponseDto> getPaymentsPaged(
            String search, 
            LocalDate date, 
            int page, 
            int size, 
            String sortBy, 
            String direction) {
        
       // log.info("Fetching AMC Payments with search='{}', date='{}', page={}, size={}, sortBy={}, direction={}", 
         //        search, date, page, size, sortBy, direction);

        // 1. Build Sort and Pageable
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        // 2. Prepare search parameters
        String finalSearch = (search == null || search.trim().isEmpty()) ? "" : search; 
        String dateSearchString = date != null ? date.toString() : null;


        // 3. Execute the search query
        Page<AmcJobPayment> results = paymentRepository.searchAllPayments(
                finalSearch,
                dateSearchString, 
                pageable
        );

        // 4. Convert the Page of Entities to a Page of DTOs
        return results.map(this::mapToResponse);
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
    	
    	AmcJob amcJob = null;
        AmcRenewalJob amcRenewalJob = null;
        
        String customerName = "";
        String siteName = "";
        
        Customer customer = null;
        Site site = null;
        		
        if(entity.getAmcJob()!=null) {
        	
        	amcJob = entity.getAmcJob();
        	customer = amcJob.getCustomer();
        	site = amcJob.getSite();
        	
        	if(customer!=null) {
        		customerName = customer.getCustomerName();
        	}
        	if(site!=null) {
        		siteName = site.getSiteName();
        	}
        	
        }else if(entity.getAmcRenewalJob()!=null){
        	amcRenewalJob = entity.getAmcRenewalJob();
        	customer = amcRenewalJob.getCustomer();
        	site = amcRenewalJob.getSite();
        	
        	if(customer!=null) {
        		customerName = customer.getCustomerName();
        	}
        	if(site!=null) {
        		siteName = site.getSiteName();
        	}
        }
    	
        return AmcJobPaymentResponseDto.builder()
                .paymentId(entity.getPaymentId())
                .paymentDate(entity.getPaymentDate())
                .invoiceNo(entity.getInvoiceNo())
                .payFor(entity.getPayFor())
                .paymentType(entity.getPaymentType())
                .customerName(customerName)
                .siteName(siteName)
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
    
    
    
    public PaymentSummaryDto getPaymentSummary() {

        // ✅ Fetch main stats list (1 row only)
        List<Object[]> resultList = paymentRepository.getPaymentMainSummaryStatistics();
        Object[] stats = resultList.isEmpty() ? new Object[4] : resultList.get(0);

        long totalPaymentsCount = stats[0] != null ? ((Number) stats[0]).longValue() : 0L;
        long clearedPaymentsCount = stats[1] != null ? ((Number) stats[1]).longValue() : 0L;
        long unclearedPaymentsCount = stats[2] != null ? ((Number) stats[2]).longValue() : 0L;
        BigDecimal totalClearedAmount = stats[3] != null ? (BigDecimal) stats[3] : BigDecimal.ZERO;

        // ✅ Fetch payment type breakdown
        List<Object[]> breakdownList = paymentRepository.getPaymentTypeBreakdown();

        List<PaymentTypeCount> typeCounts = breakdownList.stream()
                .map(row -> new PaymentTypeCount(
                        (String) row[0],
                        ((Number) row[1]).longValue(),
                        row[2] != null ? (BigDecimal) row[2] : BigDecimal.ZERO
                ))
                .collect(Collectors.toList());

        // ✅ Assemble DTO
        return PaymentSummaryDto.builder()
                .totalPaymentsCount(totalPaymentsCount)
                .clearedPaymentsCount(clearedPaymentsCount)
                .unclearedPaymentsCount(unclearedPaymentsCount)
                .totalClearedAmount(totalClearedAmount)
                .paymentTypeCounts(typeCounts)
                .build();
    }

    
    
    
    
}
