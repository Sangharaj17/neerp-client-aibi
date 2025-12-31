package com.aibi.neerp.newInstallation.invoice.service;

import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.exception.ResourceInUseException;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.NewLeads;
import com.aibi.neerp.leadmanagement.repository.CombinedEnquiryRepository;
import com.aibi.neerp.leadmanagement.repository.NewLeadsRepository;
import com.aibi.neerp.newInstallation.invoice.dto.NiInvoiceRequestDTO;
import com.aibi.neerp.newInstallation.invoice.dto.NiInvoiceResponseDTO;
import com.aibi.neerp.newInstallation.invoice.dto.NiInvoiceSummaryDTO;
import com.aibi.neerp.newInstallation.invoice.dto.PageResponse;
import com.aibi.neerp.newInstallation.invoice.entity.NiInvoice;
import com.aibi.neerp.newInstallation.invoice.repository.NiInvoiceRepository;
import com.aibi.neerp.quotation.entity.QuotationLiftDetail;
import com.aibi.neerp.quotation.entity.QuotationMain;
import com.aibi.neerp.quotation.jobs.entity.QuotationJobs;
import com.aibi.neerp.quotation.jobs.repository.QuotationJobsRepository;
import com.aibi.neerp.quotation.repository.QuotationMainRepository;
import com.aibi.neerp.settings.entity.CompanySetting;
import com.aibi.neerp.settings.repository.CompanySettingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class NiInvoiceService {

    private final NiInvoiceRepository invoiceRepo;
    private final CompanySettingRepository companySettingRepo;
    private final QuotationJobsRepository jobRepo;
    private final NewLeadsRepository leadRepo;
    private final CombinedEnquiryRepository enquiryRepo;
    private final QuotationMainRepository quotationMainRepository;
    private final EmployeeRepository employeeRepository;

    /* ================= CREATE ================= */

    public ApiResponse<NiInvoiceResponseDTO> createInvoice(NiInvoiceRequestDTO dto) {

        if (dto.getQuotationId() == null) {
            return new ApiResponse<>(
                    false,
                    "Quotation ID is required",
                    null
            );
        }

        if (dto.getJobId() == null) {
            return new ApiResponse<>(
                    false,
                    "Job ID is required",
                    null
            );
        }

        if (dto.getLeadId() == null) {
            return new ApiResponse<>(
                    false,
                    "Lead ID is required",
                    null
            );
        }

        if (dto.getCombinedEnquiryId() == null) {
            return new ApiResponse<>(
                    false,
                    "Combined Enquiry ID is required",
                    null
            );
        }

        if (dto.getCreatedBy() == null) {
            return new ApiResponse<>(
                    false,
                    "Created By (Employee ID) is required",
                    null
            );
        }

        if (dto.getAmount() == null) {
            return new ApiResponse<>(
                    false,
                    "Invoice amount is required",
                    null
            );
        }

        try {
            QuotationMain quotation = quotationMainRepository.findById(dto.getQuotationId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Quotation not found"));

            CompanySetting settings = companySettingRepo.findById("COMPANY_SETTINGS_1")
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Company settings not found"));

            Employee createdBy = employeeRepository.findById(dto.getCreatedBy())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Employee not found with ID: " + dto.getCreatedBy()));

            /* ================= PHP LOGIC ================= */

            BigDecimal quotationAmount = BigDecimal.ZERO;
            BigDecimal pwdAmount = BigDecimal.ZERO;

            if (quotation.getLiftDetails() != null) {
                quotationAmount = BigDecimal.valueOf(quotation.getTotalAmount());

                pwdAmount = quotation.getLiftDetails().stream()
                        .filter(l -> Boolean.TRUE.equals(l.getPwdIncludeExclude()))
                        .map(l -> BigDecimal.valueOf(
                                l.getPwdAmount() != null ? l.getPwdAmount() : 0.0))
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
            }

            BigDecimal xAmount = quotationAmount.subtract(pwdAmount);

            BigDecimal taxPercentage =
                    BigDecimal.valueOf(settings.getGstRateNewInstallationTotalPercentage());

            BigDecimal cgstPer = taxPercentage.divide(BigDecimal.valueOf(2), 2, RoundingMode.HALF_UP);
            BigDecimal sgstPer = cgstPer;

            BigDecimal baseAmount = dto.getAmount().divide(
                    BigDecimal.ONE.add(taxPercentage.divide(BigDecimal.valueOf(100))),
                    2,
                    RoundingMode.HALF_UP
            );

            BigDecimal cgstAmt = baseAmount.multiply(cgstPer)
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            BigDecimal sgstAmt = baseAmount.multiply(sgstPer)
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            BigDecimal totalInvAmt = baseAmount.add(cgstAmt).add(sgstAmt)
                    .setScale(0, RoundingMode.HALF_UP);

            /* ================= INVOICE NO ================= */

            String lastNo = invoiceRepo.findLastInvoiceNo();
            int next = lastNo == null ? 1 : Integer.parseInt(lastNo) + 1;
            String invoiceNo = String.format("%03d", next);

            /* ================= SAVE ================= */

            NiInvoice invoice = NiInvoice.builder()
                    .invoiceNo(invoiceNo)
                    .invoiceDate(dto.getInvoiceDate())
                    .job(jobRepo.getReferenceById(dto.getJobId()))
                    .lead(leadRepo.getReferenceById(dto.getLeadId()))
                    .combinedEnquiry(enquiryRepo.getReferenceById(dto.getCombinedEnquiryId()))
                    .quotationMain(quotation)
                    .quotationNo(dto.getQuotationNo())
                    .sacCode(settings.getSacCodeNewInstallation())
                    .baseAmount(baseAmount)
                    .cgstAmount(cgstAmt)
                    .sgstAmount(sgstAmt)
                    .totalAmount(totalInvAmt)
                    .payFor(dto.getPayFor())
                    .isCleared(false)
                    .createdAt(LocalDateTime.now())
                    .createdBy(createdBy)
                    .build();

            invoiceRepo.save(invoice);

            return new ApiResponse<>(
                    true,
                    "Invoice created successfully",
                    mapToDto(invoice)
            );

        } catch (Exception e) {
            log.error("Error creating invoice", e);
            return new ApiResponse<>(
                    false,
                    e.getMessage(),
                    null
            );
        }
    }

    /* ================= READ ================= */

    public ApiResponse<NiInvoiceResponseDTO> getById(Integer id) {

        return invoiceRepo.findById(id)
                .map(invoice -> new ApiResponse<>(
                        true,
                        "Invoice fetched successfully",
                        mapToDto(invoice)
                ))
                .orElseGet(() -> new ApiResponse<>(
                        false,
                        "Invoice not found with ID: " + id,
                        null
                ));
    }

    public ApiResponse<List<NiInvoiceResponseDTO>> getAll() {

        List<NiInvoiceResponseDTO> list = invoiceRepo.findAll()
                .stream()
                .map(this::mapToDto)
                .toList();

        return new ApiResponse<>(
                true,
                "Invoices fetched successfully",
                list
        );
    }

    /* ================= UPDATE ================= */

    public ApiResponse<NiInvoiceResponseDTO> update(Integer id, NiInvoiceRequestDTO dto) {

        NiInvoice existing = invoiceRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Invoice not found with ID: " + id));

        // ❗ Business rule: invoice should not be edited if cleared
        if (Boolean.TRUE.equals(existing.getIsCleared())) {
            throw new ResourceInUseException("Cleared invoice cannot be modified");
        }

        // Reuse create logic safely
        invoiceRepo.delete(existing);
        return createInvoice(dto);
    }

    /* ================= DELETE ================= */

    public ApiResponse<String> delete(Integer id) {

        NiInvoice invoice = invoiceRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Invoice not found with ID: " + id));

        if (Boolean.TRUE.equals(invoice.getIsCleared())) {
            throw new ResourceInUseException("Cleared invoice cannot be deleted");
        }

        invoiceRepo.delete(invoice);

        return new ApiResponse<>(
                true,
                "Invoice deleted successfully",
                "DELETED"
        );
    }

    public ApiResponse<NiInvoiceSummaryDTO> getSummary() {

        long total = invoiceRepo.count();
        long paid = invoiceRepo.countByIsClearedTrue();
        long pending = invoiceRepo.countByIsClearedFalse();
        BigDecimal received = invoiceRepo.sumPaidAmount();

        return new ApiResponse<>(
                true,
                "Invoice summary fetched successfully",
                NiInvoiceSummaryDTO.builder()
                        .totalInvoices(total)
                        .paidInvoices(paid)
                        .pendingInvoices(pending)
                        .totalAmountReceived(received)
                        .build()
        );
    }

    private String resolveSortColumn(String sortBy) {
        return switch (sortBy) {
            case "invoiceNo" -> "invoiceNo";
            case "siteName" -> "site.siteName";
            case "siteAddress" -> "site.siteAddress";
            case "invoiceDate" -> "invoiceDate";
            case "totalAmount" -> "totalAmount";
            case "payFor" -> "payFor";
            case "status" -> "isCleared";
            case "customerName" -> "lead.customerName";
            case "createdAt" -> "createdAt";
            default -> "createdAt";
        };
    }

    public ApiResponse<PageResponse<NiInvoiceResponseDTO>> getAll(
            int page,
            int size,
            String search,
            String sortBy,
            String direction
    ) {

        if (sortBy == null || sortBy.isBlank()) {
            sortBy = "createdAt";
        }

        String orderBy = resolveSortColumn(sortBy);
        String dir = direction.equalsIgnoreCase("asc") ? "ASC" : "DESC";

        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(resolveSortColumn(sortBy)).ascending()
                : Sort.by(resolveSortColumn(sortBy)).descending();


        // Don't pass sort to PageRequest - the native query handles ORDER BY
        Pageable pageable = PageRequest.of(page, size);

        Page<NiInvoice> invoicePage =
                invoiceRepo.searchInvoices(
                        (search == null || search.isBlank()) ? null : search,
                        sortBy,
                        direction,
                        pageable
                );

        List<NiInvoiceResponseDTO> content = invoicePage.getContent()
                .stream()
                .map(this::mapToDto)
                .toList();

        return new ApiResponse<>(
                true,
                "Invoices fetched successfully",
                PageResponse.<NiInvoiceResponseDTO>builder()
                        .content(content)
                        .page(invoicePage.getNumber())
                        .size(invoicePage.getSize())
                        .totalElements(invoicePage.getTotalElements())
                        .totalPages(invoicePage.getTotalPages())
                        .build()
        );
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<NiInvoiceResponseDTO>> getInvoicesByJob(
            Integer jobId,
            boolean onlyPending
    ) {
        if (jobId == null) {
            return new ApiResponse<>(
                    false,
                    "Job ID is required",
                    null
            );
        }

        // Validate job exists
        jobRepo.findById(jobId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Job not found with ID: " + jobId)
                );

        List<NiInvoice> invoices = onlyPending
                ? invoiceRepo.findByJob_JobIdAndIsClearedFalseOrderByInvoiceDateAsc(jobId)
                : invoiceRepo.findByJob_JobIdOrderByInvoiceDateAsc(jobId);

        List<NiInvoiceResponseDTO> dtoList = invoices.stream()
                .map(this::mapToDto)
                .toList();

        return new ApiResponse<>(
                true,
                "Invoices fetched successfully",
                dtoList
        );
    }


    /* ================= MAPPER ================= */

    private NiInvoiceResponseDTO mapToDto(NiInvoice i) {
        return NiInvoiceResponseDTO.builder()
                .invoiceId(i.getInvoiceId())
                .invoiceNo(i.getInvoiceNo())
                .invoiceDate(i.getInvoiceDate())
                .baseAmount(i.getBaseAmount())
                .cgstAmount(i.getCgstAmount())
                .sgstAmount(i.getSgstAmount())
                .totalAmount(i.getTotalAmount())
                .sacCode(i.getSacCode())
                .payFor(i.getPayFor())
                .status(Boolean.TRUE.equals(i.getIsCleared()) ? "Paid" : "Pending")
                .siteName(i.getJob().getSite().getSiteName())
                .siteAddress(i.getJob().getSite().getSiteAddress())
                .customerName(i.getLead().getCustomerName())
                .isCleared(i.getIsCleared())
                .build();
    }
}
