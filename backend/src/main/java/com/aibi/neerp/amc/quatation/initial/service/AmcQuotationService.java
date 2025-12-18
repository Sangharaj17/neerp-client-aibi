package com.aibi.neerp.amc.quatation.initial.service;


import com.aibi.neerp.amc.quatation.initial.dto.AmcCombinedQuotationRequestDto;
import com.aibi.neerp.amc.quatation.initial.dto.AmcQuotationRequestDto;
import com.aibi.neerp.amc.quatation.initial.dto.AmcQuotationResponseDto;
import com.aibi.neerp.amc.quatation.initial.dto.AmcQuotationViewResponseDto;
import com.aibi.neerp.amc.quatation.initial.dto.CombinedQuotationDto;
import com.aibi.neerp.amc.quatation.initial.dto.EditQuotationResponseDto;
import com.aibi.neerp.amc.quatation.initial.entity.AmcCombinedQuotation;
import com.aibi.neerp.amc.quatation.initial.entity.AmcQuotation;
import com.aibi.neerp.amc.quatation.initial.repository.AmcQuotationRepository;
import com.aibi.neerp.amc.quatation.initial.repository.RevisedAmcQuotationRepository;
import com.aibi.neerp.amc.quatation.renewal.entity.AmcRenewalQuotation;
import com.aibi.neerp.amc.quatation.renewal.entity.RevisedRenewalAmcQuotation;
import com.aibi.neerp.amc.quatation.renewal.repository.AmcRenewalQuotationRepository;
import com.aibi.neerp.amc.quatation.renewal.repository.RevisedRenewalAmcQuotationRepository;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.Enquiry;
import com.aibi.neerp.leadmanagement.entity.NewLeads;
import com.aibi.neerp.leadmanagement.repository.CombinedEnquiryRepository;
import com.aibi.neerp.leadmanagement.repository.EnquiryRepository;
import com.aibi.neerp.leadmanagement.repository.NewLeadsRepository;

import jakarta.persistence.EntityNotFoundException;

import com.aibi.neerp.customer.entity.Customer;
import com.aibi.neerp.customer.entity.Site;
import com.aibi.neerp.customer.repository.CustomerRepository;
import com.aibi.neerp.customer.repository.SiteRepository;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.amc.common.entity.ElevatorMake;
import com.aibi.neerp.amc.common.entity.NumberOfService;
import com.aibi.neerp.amc.common.entity.PaymentTerm;
import com.aibi.neerp.amc.common.repository.ElevatorMakeRepository;
import com.aibi.neerp.amc.common.repository.NumberOfServiceRepository;
import com.aibi.neerp.amc.common.repository.PaymentTermRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AmcQuotationService {

    private final AmcQuotationRepository repository;
    private final NewLeadsRepository leadRepository;
    private final EnquiryRepository enquiryRepository;
    private final CustomerRepository customerRepository;
    private final SiteRepository siteRepository;
    private final ElevatorMakeRepository elevatorMakeRepository;
    private final PaymentTermRepository paymentTermRepository;
    private final EmployeeRepository employeeRepository;
    private final RevisedAmcQuotationRepository revisedAmcQuotationRepository;
    private final AmcRenewalQuotationRepository amcRenewalQuotationRepository;
    private final RevisedRenewalAmcQuotationRepository revisedRenewalAmcQuotationRepository;
    private final CombinedEnquiryRepository combinedEnquiryRepository;
    private final NumberOfServiceRepository numberOfServiceRepository;

    // ================= CREATE =================
    public void createAmcQuotation(AmcQuotationRequestDto dto) {

        // --- Fetch foreign keys from DB ---
        NewLeads lead = dto.getLeadId() != null ? leadRepository.findById(dto.getLeadId()).orElse(null) : null;
        // Enquiry enquiry = dto.getEnquiryId() != null ? enquiryRepository.findById(dto.getEnquiryId()).orElse(null) : null;
        // Customer customer = dto.getCustomerId() != null ? customerRepository.findById(dto.getCustomerId()).orElse(null) : null;
        // Site site = dto.getSiteId() != null ? siteRepository.findById(dto.getSiteId()).orElse(null) : null;
        ElevatorMake makeOfElevator = dto.getMakeOfElevatorId() != null ? elevatorMakeRepository.findById(dto.getMakeOfElevatorId()).orElse(null) : null;
        PaymentTerm paymentTerm = dto.getPaymentTermId() != null ? paymentTermRepository.findById(dto.getPaymentTermId()).orElse(null) : null;
        Employee createdBy = dto.getCreatedById() != null ? employeeRepository.findById(dto.getCreatedById()).orElse(null) : null;

        // Using Optional and orElseThrow to throw an exception if not found
        NumberOfService numberOfService = numberOfServiceRepository
                .findById(dto.getNoOfServicesId().longValue())
                .orElseThrow(() -> new RuntimeException(
                        "NumberOfService not found with id: " + dto.getNoOfServicesId()));

        CombinedEnquiry combinedEnquiry = combinedEnquiryRepository.findById(dto.getCombinedEnquiryId())
                .orElseThrow(() -> new RuntimeException("CombinedEnquiry not found with id: " + dto.getCombinedEnquiryId()));

        // --- Build AMC Quotation ---
        AmcQuotation amcQuotation = AmcQuotation.builder()
                .quatationDate(dto.getQuatationDate() != null ? dto.getQuatationDate() : null)
                .lead(lead)
                .combinedEnquiry(combinedEnquiry)
                .makeOfElevator(makeOfElevator)
                .paymentTerm(paymentTerm)
                .createdBy(createdBy)
                .noOfElevator(dto.getNoOfElevator())
                .typeOfElevator(dto.getTypeOfElevator())
                .fromDate(dto.getFromDate())
                .toDate(dto.getToDate())
                .amountOrdinary(dto.getAmountOrdinary())
                .gstOrdinary(dto.getGstOrdinary())
                .isFinalOrdinary(dto.getIsFinalOrdinary())
                .amountSemiComp(dto.getAmountSemiComp())
                .gstSemi(dto.getGstSemi())
                .isFinalSemiComp(dto.getIsFinalSemicomp())
                .amountComp(dto.getAmountComp())
                .gstComp(dto.getGstComp())
                .isFinalComp(dto.getIsFinalComp())
                .gstPercentage(dto.getGstPercentage())
                .status(dto.getStatus())
                .typeContract(dto.getTypeContract())
                .numberOfService(numberOfService)
                .isFinal(dto.getIsFinal())
                .jobStatus(dto.getJobStatus() != null ? dto.getJobStatus() : 0)
                .forecastMonth(dto.getForecastMonth())
                .combinedQuotations(new ArrayList<AmcCombinedQuotation>())
                .build();


        // --- Handle Combined Quotations ---
        if (dto.getCombinedQuotations() != null) {
            for (AmcCombinedQuotationRequestDto cqDto : dto.getCombinedQuotations()) {
                AmcCombinedQuotation combined = AmcCombinedQuotation.builder()
                        .amcQuotation(amcQuotation)
                        .enquiry(cqDto.getEnquiryId() != null ? enquiryRepository.findById(cqDto.getEnquiryId()).orElse(null) : null)
                        .revisedQuotation(cqDto.getRevisedQuotationId() != null ? revisedAmcQuotationRepository.findById(cqDto.getRevisedQuotationId()).orElse(null) : null)
                        .renewalQuotation(cqDto.getRenewalQuotationId() != null ? amcRenewalQuotationRepository.findById(cqDto.getRenewalQuotationId()).orElse(null) : null)
                        .revisedRenewal(cqDto.getRevisedRenewalId() != null ? revisedRenewalAmcQuotationRepository.findById(cqDto.getRevisedRenewalId()).orElse(null) : null)
                        .amount(cqDto.getAmount())
                        .gstAmount(cqDto.getGstAmount())
                        .totalAmount(cqDto.getTotalAmount())
                        .amountOrdinary(cqDto.getAmountOrdinary())
                        .amountSemi(cqDto.getAmountSemi())
                        .amountComp(cqDto.getAmountComp())
                        .gstOrdinary(cqDto.getGstOrdinary())
                        .gstSemi(cqDto.getGstSemi())
                        .gstComp(cqDto.getGstComp())
                        .totalAmountOrdinary(cqDto.getTotalAmountOrdinary())
                        .totalAmountSemi(cqDto.getTotalAmountSemi())
                        .totalAmountComp(cqDto.getTotalAmountComp())
                        .build();

                amcQuotation.getCombinedQuotations().add(combined);
            }
        }

        repository.save(amcQuotation);
    }

    // ================= UPDATE =================
    public void updateAmcQuotation(Integer id, AmcQuotationRequestDto dto) {
        repository.findById(id).ifPresent(entity -> {

            // Update parent FKs
            entity.setLead(dto.getLeadId() != null ? leadRepository.findById(dto.getLeadId()).orElse(null) : entity.getLead());
            entity.setEnquiry(dto.getEnquiryId() != null ? enquiryRepository.findById(dto.getEnquiryId()).orElse(null) : entity.getEnquiry());
            entity.setMakeOfElevator(dto.getMakeOfElevatorId() != null ? elevatorMakeRepository.findById(dto.getMakeOfElevatorId()).orElse(null) : entity.getMakeOfElevator());
            entity.setPaymentTerm(dto.getPaymentTermId() != null ? paymentTermRepository.findById(dto.getPaymentTermId()).orElse(null) : entity.getPaymentTerm());
            entity.setCreatedBy(dto.getCreatedById() != null ? employeeRepository.findById(dto.getCreatedById()).orElse(null) : entity.getCreatedBy());

            entity.setNumberOfService(
                    dto.getNoOfServicesId() != null
                            ? numberOfServiceRepository
                            .findById(dto.getNoOfServicesId().longValue())
                            .orElseThrow(() -> new RuntimeException(
                                    "NumberOfService not found with id: " + dto.getNoOfServicesId()))
                            : null
            );


            // Update other fields
            entity.setNoOfElevator(dto.getNoOfElevator());
            entity.setTypeOfElevator(dto.getTypeOfElevator());
            entity.setFromDate(dto.getFromDate());
            entity.setToDate(dto.getToDate());
            entity.setAmountOrdinary(dto.getAmountOrdinary());
            entity.setGstOrdinary(dto.getGstOrdinary());
            entity.setIsFinalOrdinary(dto.getIsFinalOrdinary());

            entity.setAmountSemiComp(dto.getAmountSemiComp());
            entity.setGstSemi(dto.getGstSemi());
            entity.setIsFinalSemiComp(dto.getIsFinalSemicomp());
            entity.setAmountComp(dto.getAmountComp());
            entity.setGstComp(dto.getGstComp());
            entity.setIsFinalComp(dto.getIsFinalComp());
            entity.setGstPercentage(dto.getGstPercentage());
            entity.setStatus(dto.getStatus());
            entity.setTypeContract(dto.getTypeContract());
            entity.setIsFinal(dto.getIsFinal());
            entity.setJobStatus(dto.getJobStatus() != null ? dto.getJobStatus() : entity.getJobStatus());
            entity.setForecastMonth(dto.getForecastMonth());

            // --- Update combined quotations ---
            if (dto.getCombinedQuotations() != null) {
                entity.getCombinedQuotations().clear(); // remove old
                for (AmcCombinedQuotationRequestDto cqDto : dto.getCombinedQuotations()) {
                    AmcCombinedQuotation combined = AmcCombinedQuotation.builder()
                            .amcQuotation(entity)
                            .enquiry(cqDto.getEnquiryId() != null ? enquiryRepository.findById(cqDto.getEnquiryId()).orElse(null) : null)
                            .revisedQuotation(cqDto.getRevisedQuotationId() != null ? revisedAmcQuotationRepository.findById(cqDto.getRevisedQuotationId()).orElse(null) : null)
                            .renewalQuotation(cqDto.getRenewalQuotationId() != null ? amcRenewalQuotationRepository.findById(cqDto.getRenewalQuotationId()).orElse(null) : null)
                            .revisedRenewal(cqDto.getRevisedRenewalId() != null ? revisedRenewalAmcQuotationRepository.findById(cqDto.getRevisedRenewalId()).orElse(null) : null)
                            .amount(cqDto.getAmount())
                            .gstAmount(cqDto.getGstAmount())
                            .totalAmount(cqDto.getTotalAmount())
                            .amountOrdinary(cqDto.getAmountOrdinary())
                            .amountSemi(cqDto.getAmountSemi())
                            .amountComp(cqDto.getAmountComp())
                            .gstOrdinary(cqDto.getGstOrdinary())
                            .gstSemi(cqDto.getGstSemi())
                            .gstComp(cqDto.getGstComp())
                            .totalAmountOrdinary(cqDto.getTotalAmountOrdinary())
                            .totalAmountSemi(cqDto.getTotalAmountSemi())
                            .totalAmountComp(cqDto.getTotalAmountComp())
                            .build();

                    entity.getCombinedQuotations().add(combined);
                }
            }

            repository.save(entity);
        });
    }

    // ================= DELETE =================
    public void deleteAmcQuotation(Integer id) {
        repository.deleteById(id);
    }

    // ================= GET =================
    public void getAmcQuotationById(Integer id) {
        repository.findById(id).orElseThrow(() -> new RuntimeException("AMC Quotation not found with ID: " + id));
    }

    public void getAllAmcQuotations() {
        List<AmcQuotation> list = repository.findAll();
        if (list.isEmpty()) {
            throw new RuntimeException("No AMC Quotations found");
        }
    }

    private String joinAmcStartAndEndDate(LocalDate startDate, LocalDate endDate) {
        if (startDate == null && endDate == null) {
            return null;
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

        if (startDate != null && endDate != null) {
            return startDate.format(formatter) + " to " + endDate.format(formatter);
        } else if (startDate != null) {
            return startDate.format(formatter); // only start date available
        } else { // endDate != null
            return endDate.format(formatter); // only end date available
        }
    }

    public Page<AmcQuotationResponseDto> searchAmcQuotations(String search, LocalDate dateSearch, Pageable pageable) {
        log.info("Searching AMC Quotations with search='{}', date='{}', pageable={}", search, dateSearch, pageable);

        // Convert LocalDate to String for the query parameter
        String dateSearchStr = dateSearch != null ? dateSearch.toString() : null;
        
        Page<AmcQuotation> results = repository.searchAll(search, dateSearchStr, pageable);

        return results.map(q -> AmcQuotationResponseDto.builder()
                .id(q.getAmcQuatationId())
                .customerName(q.getLead() != null ? q.getLead().getCustomerName() : null)
                .siteName(q.getCombinedEnquiry() != null ? q.getCombinedEnquiry().getSiteName() : null) // Fixed: use q.getSite() instead of q.getLead().getSiteName()
                .employeeName(q.getCreatedBy() != null ? q.getCreatedBy().getEmployeeName() : null)
                .place(q.getLead() != null && q.getLead().getArea() != null ? q.getLead().getArea().getAreaName() : null) // Added null check
                .makeOfElevator(q.getMakeOfElevator() != null ? q.getMakeOfElevator().getName() : null)
                .quatationDate(q.getQuatationDate())
                .forecastMonth(q.getForecastMonth())
                .amcPeriod(joinAmcStartAndEndDate(q.getFromDate(), q.getToDate()))
                .isFinal(q.getIsFinal())
                .isRevised(q.getIsRevise())
                .build()
        );
    }
    
    
    
    public EditQuotationResponseDto getQuotationById(Integer id) {
        AmcQuotation amcQuotation = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("AMC Quotation not found with id: " + id));

        List<AmcCombinedQuotation> combinedQuotations =
                amcQuotation.getCombinedQuotations() != null ? amcQuotation.getCombinedQuotations() : List.of();

        // ✅ Explicitly tell Java that we are mapping to CombinedQuotationDto
        List<CombinedQuotationDto> combinedQuotationDtos = combinedQuotations.stream()
                .map((AmcCombinedQuotation cq) -> CombinedQuotationDto.builder()
                        .enquiryId(cq.getEnquiry() != null ? cq.getEnquiry().getEnquiryId() : null)
                        .revisedQuotationId(cq.getRevisedQuotation() != null ? cq.getRevisedQuotation().getRevisedQuatationId() : null)
                       
                        
                        .liftType(cq.getEnquiry().getLiftType().getName())
                        .from(cq.getEnquiry().getFrom())
                        .noOfFloors(cq.getEnquiry().getNoOfFloors().getFloorName())   
                        .selectPerson(cq.getEnquiry() != null && cq.getEnquiry().getPersonCapacity() != null
                        ? cq.getEnquiry().getPersonCapacity().getDisplayName()
                        : cq.getEnquiry().getWeight().getWeightValue()+" Kg")                        
                        .amount(cq.getAmount())
                        .gstAmount(cq.getGstAmount())
                        .totalAmount(cq.getTotalAmount())

                        .amountOrdinary(cq.getAmountOrdinary())
                        .amountSemi(cq.getAmountSemi())
                        .amountComp(cq.getAmountComp())

                        .gstOrdinary(cq.getGstOrdinary())
                        .gstSemi(cq.getGstSemi())
                        .gstComp(cq.getGstComp())

                        .totalAmountOrdinary(cq.getTotalAmountOrdinary())
                        .totalAmountSemi(cq.getTotalAmountSemi())
                        .totalAmountComp(cq.getTotalAmountComp())
                        .build()
                ).collect(Collectors.toList());

        return EditQuotationResponseDto.builder()
                .amcQuatationId(amcQuotation.getAmcQuatationId())
                .quatationDate(amcQuotation.getQuatationDate())
                .leadId(amcQuotation.getLead() != null ? amcQuotation.getLead().getLeadId() : null)
                .combinedEnquiryId(amcQuotation.getCombinedEnquiry() != null ? amcQuotation.getCombinedEnquiry().getId() : null)
                .enquiryId(amcQuotation.getEnquiry() != null ? amcQuotation.getEnquiry().getEnquiryId() : null)
                .makeOfElevatorId(amcQuotation.getMakeOfElevator() != null ? amcQuotation.getMakeOfElevator().getId() : null)
                .paymentTermId(amcQuotation.getPaymentTerm() != null ? amcQuotation.getPaymentTerm().getId() : null)
                .createdById(amcQuotation.getCreatedBy() != null ? amcQuotation.getCreatedBy().getEmployeeId() : null)

                .noOfElevator(amcQuotation.getNoOfElevator())
                .typeOfElevator(amcQuotation.getTypeOfElevator())
                .fromDate(amcQuotation.getFromDate())
                .toDate(amcQuotation.getToDate())

                .isFinalOrdinary(amcQuotation.getIsFinalOrdinary())
                .isFinalSemiComp(amcQuotation.getIsFinalSemiComp())
                .isFinalComp(amcQuotation.getIsFinalComp())

                .amountOrdinary(amcQuotation.getAmountOrdinary())
                .gstOrdinary(amcQuotation.getGstOrdinary())
                .amountSemiComp(amcQuotation.getAmountSemiComp())
                .gstSemi(amcQuotation.getGstSemi())
                .amountComp(amcQuotation.getAmountComp())
                .gstComp(amcQuotation.getGstComp())

                .status(amcQuotation.getStatus())
                .typeContract(amcQuotation.getTypeContract())
                .noOfServicesId(amcQuotation.getNumberOfService() != null ? amcQuotation.getNumberOfService().getId() : null)
                .gstPercentage(amcQuotation.getGstPercentage())
                .isFinal(amcQuotation.getIsFinal())
                .jobStatus(amcQuotation.getJobStatus())
                .forecastMonth(amcQuotation.getForecastMonth())

                .customerName(amcQuotation.getLead().getCustomerName())
                .customerSite(amcQuotation.getLead().getSiteName())
                .selectLead(amcQuotation.getLead().getSalutations()+""+amcQuotation.getLead().getCustomerName()+" for "+amcQuotation.getLead().getSiteName())
                .combinedQuotations(combinedQuotationDtos) // ✅ use precomputed list
                .build();
    }
    
    
    @Transactional
    public void updateAmcQuotation(AmcQuotationRequestDto dto) {

        // 1. Fetch existing quotation
        AmcQuotation amcQuotation = repository.findById(dto.getAmcquatationId())
                .orElseThrow(() -> new RuntimeException("AMC Quotation not found with id: " + dto.getAmcquatationId()));

        // 2. Fetch foreign keys
        NewLeads lead = dto.getLeadId() != null
                ? leadRepository.findById(dto.getLeadId()).orElse(null)
                : null;

        ElevatorMake makeOfElevator = dto.getMakeOfElevatorId() != null
                ? elevatorMakeRepository.findById(dto.getMakeOfElevatorId()).orElse(null)
                : null;

        PaymentTerm paymentTerm = dto.getPaymentTermId() != null
                ? paymentTermRepository.findById(dto.getPaymentTermId()).orElse(null)
                : null;

        Employee createdBy = dto.getCreatedById() != null
                ? employeeRepository.findById(dto.getCreatedById()).orElse(null)
                : null;

        NumberOfService numberOfService = numberOfServiceRepository
                .findById(dto.getNoOfServicesId().longValue())
                .orElseThrow(() -> new RuntimeException("NumberOfService not found with id: " + dto.getNoOfServicesId()));

        CombinedEnquiry combinedEnquiry = combinedEnquiryRepository
                .findById(dto.getCombinedEnquiryId())
                .orElseThrow(() -> new RuntimeException("CombinedEnquiry not found with id: " + dto.getCombinedEnquiryId()));

        // 3. Update fields
        amcQuotation.setQuatationDate(dto.getQuatationDate());
        amcQuotation.setLead(lead);
        amcQuotation.setCombinedEnquiry(combinedEnquiry);
        amcQuotation.setMakeOfElevator(makeOfElevator);
        amcQuotation.setPaymentTerm(paymentTerm);
        amcQuotation.setCreatedBy(createdBy);

        amcQuotation.setNoOfElevator(dto.getNoOfElevator());
        amcQuotation.setTypeOfElevator(dto.getTypeOfElevator());
        amcQuotation.setFromDate(dto.getFromDate());
        amcQuotation.setToDate(dto.getToDate());

        amcQuotation.setAmountOrdinary(dto.getAmountOrdinary());
        amcQuotation.setGstOrdinary(dto.getGstOrdinary());
        amcQuotation.setIsFinalOrdinary(dto.getIsFinalOrdinary());

        amcQuotation.setAmountSemiComp(dto.getAmountSemiComp());
        amcQuotation.setGstSemi(dto.getGstSemi());
        amcQuotation.setIsFinalSemiComp(dto.getIsFinalSemicomp());

        amcQuotation.setAmountComp(dto.getAmountComp());
        amcQuotation.setGstComp(dto.getGstComp());
        amcQuotation.setIsFinalComp(dto.getIsFinalComp());

        amcQuotation.setGstPercentage(dto.getGstPercentage());
        amcQuotation.setStatus(dto.getStatus());
        amcQuotation.setTypeContract(dto.getTypeContract());
        amcQuotation.setNumberOfService(numberOfService);
        amcQuotation.setIsFinal(dto.getIsFinal());
        amcQuotation.setJobStatus(dto.getJobStatus() != null ? dto.getJobStatus() : 0);
        amcQuotation.setForecastMonth(dto.getForecastMonth());

        // 4. Handle Combined Quotations (Clear + Re-Add)
        amcQuotation.getCombinedQuotations().clear();

        if (dto.getCombinedQuotations() != null) {
            for (AmcCombinedQuotationRequestDto cqDto : dto.getCombinedQuotations()) {
                AmcCombinedQuotation combined = AmcCombinedQuotation.builder()
                        .amcQuotation(amcQuotation)
                        .enquiry(cqDto.getEnquiryId() != null
                                ? enquiryRepository.findById(cqDto.getEnquiryId()).orElse(null)
                                : null)
                        .revisedQuotation(cqDto.getRevisedQuotationId() != null
                                ? revisedAmcQuotationRepository.findById(cqDto.getRevisedQuotationId()).orElse(null)
                                : null)
                        .renewalQuotation(cqDto.getRenewalQuotationId() != null
                                ? amcRenewalQuotationRepository.findById(cqDto.getRenewalQuotationId()).orElse(null)
                                : null)
                        .revisedRenewal(cqDto.getRevisedRenewalId() != null
                                ? revisedRenewalAmcQuotationRepository.findById(cqDto.getRevisedRenewalId()).orElse(null)
                                : null)
                        .amount(cqDto.getAmount())
                        .gstAmount(cqDto.getGstAmount())
                        .totalAmount(cqDto.getTotalAmount())
                        .amountOrdinary(cqDto.getAmountOrdinary())
                        .amountSemi(cqDto.getAmountSemi())
                        .amountComp(cqDto.getAmountComp())
                        .gstOrdinary(cqDto.getGstOrdinary())
                        .gstSemi(cqDto.getGstSemi())
                        .gstComp(cqDto.getGstComp())
                        .totalAmountOrdinary(cqDto.getTotalAmountOrdinary())
                        .totalAmountSemi(cqDto.getTotalAmountSemi())
                        .totalAmountComp(cqDto.getTotalAmountComp())
                        .build();

                amcQuotation.getCombinedQuotations().add(combined);
            }
        }

        repository.save(amcQuotation);
    }


    public AmcQuotationViewResponseDto getQuotationDetails(Integer quotationId) {
        AmcQuotation amcQuotation = repository.findById(quotationId)
                .orElseThrow(() -> new RuntimeException("Quotation not found"));

        return AmcQuotationViewResponseDto.builder()
                .amcQuatationId(amcQuotation.getAmcQuatationId())
                .quatationDate(amcQuotation.getQuatationDate())
                .typeContract(amcQuotation.getTypeContract())
                .makeOfElevator(amcQuotation.getMakeOfElevator() != null ?
                        amcQuotation.getMakeOfElevator().getName() : null)
                .paymentTerm(amcQuotation.getPaymentTerm() != null ?
                        amcQuotation.getPaymentTerm().getTermName(): null)
                .noOfServices(amcQuotation.getNumberOfService() != null ?
                        amcQuotation.getNumberOfService().getValue() : null)
                .fromDate(amcQuotation.getFromDate())
                .toDate(amcQuotation.getToDate())
                .amountOrdinary(amcQuotation.getAmountOrdinary())
                .gstOrdinary(amcQuotation.getGstOrdinary())
                .finalOrdinary(amcQuotation.getIsFinalOrdinary())
                .amountSemiComp(amcQuotation.getAmountSemiComp())
                .gstSemi(amcQuotation.getGstSemi())
                .finalSemiComp(amcQuotation.getIsFinalSemiComp())
                .amountComp(amcQuotation.getAmountComp())
                .gstComp(amcQuotation.getGstComp())
                .finalComp(amcQuotation.getIsFinalComp())
                .combinedQuotations(amcQuotation.getCombinedQuotations()
                        .stream()
                        .map(cq -> {
                            // Extract enquiry safely
                            var enquiry = cq.getEnquiry();

                            String capacity = null;
                            if (enquiry != null) {
                                if (enquiry.getPersonCapacity() != null) {
                                    capacity = enquiry.getPersonCapacity().getDisplayName();
                                } else if (enquiry.getWeight() != null) {
                                    capacity = enquiry.getWeight().getWeightValue()+ " Kg";
                                }
                            }

                            return AmcQuotationViewResponseDto.CombinedQuotationDto.builder()
                                    .noOfElevators(enquiry != null && enquiry.getNoOfLift() != null
                                            ? enquiry.getNoOfLift().getQuantity() : null)
                                    .typeOfElevators(enquiry != null && enquiry.getLiftType() != null
                                            ? enquiry.getLiftType().getName() : null)
                                    .amountOrdinary(cq.getAmountOrdinary())
                                    .gstOrdinary(cq.getGstOrdinary())
                                    .totalAmountOrdinary(cq.getTotalAmountOrdinary())
                                    .amountSemi(cq.getAmountSemi())
                                    .gstSemi(cq.getGstSemi())
                                    .totalAmountSemi(cq.getTotalAmountSemi())
                                    .amountComp(cq.getAmountComp())
                                    .gstComp(cq.getGstComp())
                                    .totalAmountComp(cq.getTotalAmountComp())
                                    .capacity(capacity)
                                    .build();
                        })
                        .collect(Collectors.toList()))
                .build();
    }
    
    @Transactional
    public String setIsFinal(Integer quotationId) {

        // ✅ 1. Get Quotation
        AmcQuotation amcQuotation = repository.findById(quotationId)
                .orElseThrow(() -> new EntityNotFoundException("Quotation not found with id: " + quotationId));

        // ✅ 2. Mark as Final
        amcQuotation.setIsFinal(1);
      //  repository.save(amcQuotation);

        // ✅ 3. Get Lead from Quotation
        NewLeads lead = amcQuotation.getLead();

        // ✅ 4. Check if Customer exists
        Customer customer = customerRepository.findByLead_LeadId(lead.getLeadId());

        if (customer == null) {
            // ✅ 4A. Create New Customer
            customer = Customer.builder()
                    .customerName(lead.getCustomerName())
                    .contactNumber(lead.getContactNo())
                    .emailId(lead.getEmailId())
                    .address(lead.getSiteName()) // or actual lead address field
                    .isVerified(false)
                    .active(true)
                    .lead(lead)
                    .build();

            customer = customerRepository.save(customer);
            
            amcQuotation.setCustomer(customer);
            repository.save(amcQuotation);
         }else {
        	 amcQuotation.setCustomer(customer);
             repository.save(amcQuotation);
         }
        
        String siteName= "";
        
        CombinedEnquiry combinedEnquiry = amcQuotation.getCombinedEnquiry();
        
        if(combinedEnquiry!=null ) {
        	siteName = combinedEnquiry.getSiteName();
        }
        // ✅ 5. Check if Site with Same Name Exists for This Customer
        boolean siteExists = siteRepository.existsByCustomer_CustomerIdAndSiteNameIgnoreCase(
                customer.getCustomerId(),
                siteName
        );
        
        

        if (!siteExists) {
            Site newSite = Site.builder()
                    .customer(customer)
                    .siteName(siteName)
                    //.siteAddress(lead.getSiteAddress()) // map correct field
                    .status("ACTIVE")
                    .build();

           Site savesite = siteRepository.save(newSite);
           
           amcQuotation.setSite(savesite);
           repository.save(amcQuotation);
        }else {
        	
        	Optional<Site> siteOptional = siteRepository.findByCustomer_CustomerIdAndSiteNameIgnoreCase(
        	        customer.getCustomerId(),
        	        siteName
        	);

        	amcQuotation.setSite(siteOptional.get());

        	
            repository.save(amcQuotation);
        }

        return "Success";
    }



    
    
}
