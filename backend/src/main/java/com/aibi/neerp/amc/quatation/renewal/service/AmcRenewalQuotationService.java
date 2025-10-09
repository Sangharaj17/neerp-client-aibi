package com.aibi.neerp.amc.quatation.renewal.service;


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
import com.aibi.neerp.amc.quatation.renewal.dto.AmcQuotationRenewalResponseDto;
import com.aibi.neerp.amc.quatation.renewal.dto.AmcRenewalQuotationRequestDto;
import com.aibi.neerp.amc.quatation.renewal.dto.AmcRenewalQuotationViewResponseDto;
import com.aibi.neerp.amc.quatation.renewal.dto.EditRenewQuotationResponseDto;
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
import com.aibi.neerp.exception.ResourceInUseException;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.amc.common.entity.ElevatorMake;
import com.aibi.neerp.amc.common.entity.NumberOfService;
import com.aibi.neerp.amc.common.entity.PaymentTerm;
import com.aibi.neerp.amc.common.repository.ElevatorMakeRepository;
import com.aibi.neerp.amc.common.repository.NumberOfServiceRepository;
import com.aibi.neerp.amc.common.repository.PaymentTermRepository;
import com.aibi.neerp.amc.jobs.initial.entity.AmcJob;
import com.aibi.neerp.amc.jobs.initial.repository.AmcJobRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AmcRenewalQuotationService {

    private final AmcRenewalQuotationRepository repository;
    private final NewLeadsRepository leadRepository;
    private final EnquiryRepository enquiryRepository;
    private final CustomerRepository customerRepository;
    private final SiteRepository siteRepository;
    private final ElevatorMakeRepository elevatorMakeRepository;
    private final PaymentTermRepository paymentTermRepository;
    private final EmployeeRepository employeeRepository;
    private final RevisedAmcQuotationRepository revisedAmcQuotationRepository;
   // private final AmcRenewalQuotationRepository amcRenewalQuotationRepository;
    private final RevisedRenewalAmcQuotationRepository revisedRenewalAmcQuotationRepository;
    private final CombinedEnquiryRepository combinedEnquiryRepository;
    private final NumberOfServiceRepository numberOfServiceRepository;
    private final AmcJobRepository amcJobRepository;

    // ================= CREATE =================
    public void createAmcRenewQuotation(AmcRenewalQuotationRequestDto dto) {
    	
    	System.out.println("createAmcRenewQuotation called "+dto.getPreJobId());


        // --- Fetch foreign keys from DB ---
        NewLeads lead = dto.getLeadId() != null ? leadRepository.findById(dto.getLeadId()).orElse(null) : null;
        // Enquiry enquiry = dto.getEnquiryId() != null ? enquiryRepository.findById(dto.getEnquiryId()).orElse(null) : null;
        
        AmcJob amcJob = amcJobRepository.findById(dto.getPreJobId()).get();
         		
        Customer customer = amcJob.getCustomer();
        Site site = amcJob.getSite();
        
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
        AmcRenewalQuotation amcRenewalQuotation = AmcRenewalQuotation.builder()
                .quatationDate(dto.getQuatationDate() != null ? dto.getQuatationDate() : null)
                .lead(lead)
                .preJobId(amcJob)
                .customer(customer)     
                .site(site)            
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
                .isFinal(0)
                .jobStatus(dto.getJobStatus() != null ? dto.getJobStatus() : 0)
                .forecastMonth(dto.getForecastMonth())
                .combinedQuotations(new ArrayList<AmcCombinedQuotation>())
                .build();


        // --- Handle Combined Quotations ---
        if (dto.getCombinedQuotations() != null) {
            for (AmcCombinedQuotationRequestDto cqDto : dto.getCombinedQuotations()) {
                AmcCombinedQuotation combined = AmcCombinedQuotation.builder()
                        .renewalQuotation(amcRenewalQuotation)
                        .enquiry(cqDto.getEnquiryId() != null ? enquiryRepository.findById(cqDto.getEnquiryId()).orElse(null) : null)
                        .revisedQuotation(cqDto.getRevisedQuotationId() != null ? revisedAmcQuotationRepository.findById(cqDto.getRevisedQuotationId()).orElse(null) : null)
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

                amcRenewalQuotation.getCombinedQuotations().add(combined);
            }
        }

        repository.save(amcRenewalQuotation);
        
        amcJob.setRenewlStatus(1);
        
        amcJobRepository.save(amcJob);
        
    }
    
    public Page<AmcQuotationRenewalResponseDto> searchAmcRenewalQuotations(String search, LocalDate dateSearch, Pageable pageable) {
        log.info("Searching AMC Renewal Quotations with search='{}', date='{}', pageable={}", search, dateSearch, pageable);

        // Convert LocalDate to String for the query parameter
        String dateSearchStr = dateSearch != null ? dateSearch.toString() : null;
        
        Page<AmcRenewalQuotation> results = repository.searchAll(search, dateSearchStr, pageable);

        return results.map(q -> AmcQuotationRenewalResponseDto.builder()
                .id(q.getRenewalQuaId()  )
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
    
    public AmcRenewalQuotationViewResponseDto getAmcRenewalQuotationDetails(Integer quotationId) {
        AmcRenewalQuotation amcQuotation = repository.findById(quotationId)
                .orElseThrow(() -> new RuntimeException("Amc Renewal Quotation not found"));

        return AmcRenewalQuotationViewResponseDto.builder()
                .amcRenewalQuatationId(amcQuotation.getRenewalQuaId())
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

                            return AmcRenewalQuotationViewResponseDto.CombinedQuotationDto.builder()
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
    
    public EditRenewQuotationResponseDto getQuotationById(Integer id) {
        AmcRenewalQuotation amcQuotation = repository.findById(id)
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

        return EditRenewQuotationResponseDto.builder()
                .amcRenewQuatationId(amcQuotation.getRenewalQuaId())
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
    public void updateAmcRenewQuotation(AmcRenewalQuotationRequestDto dto) {

        // 1. Fetch existing quotation
        AmcRenewalQuotation amcQuotation = repository.findById(dto.getAmcRenewQuatationId())
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
                        .renewalQuotation(amcQuotation)
                        .enquiry(cqDto.getEnquiryId() != null
                                ? enquiryRepository.findById(cqDto.getEnquiryId()).orElse(null)
                                : null)
                        .revisedQuotation(cqDto.getRevisedQuotationId() != null
                                ? revisedAmcQuotationRepository.findById(cqDto.getRevisedQuotationId()).orElse(null)
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

	  @Transactional
    public String setIsFinal(Integer quotationId) {

        // ✅ 1. Get Quotation
        AmcRenewalQuotation amcQuotation = repository.findById(quotationId)
                .orElseThrow(() -> new EntityNotFoundException("Quotation not found with id: " + quotationId));

        // ✅ 2. Mark as Final
        amcQuotation.setIsFinal(1);
        repository.save(amcQuotation);
        
        return "Success";
        
	 }

	  public String deleteAmcQuotation(Integer id) {
		    try {
		        // Check if record exists
		        if (!repository.existsById(id)) {
		            throw new ResourceNotFoundException("AMC Quotation not found with ID: " + id);
		        }

		        // Try deleting
		        repository.deleteById(id);
		        
		        
		        
		        return "AMC Quotation deleted successfully.";

		    } catch (DataIntegrityViolationException ex) {
		        // Thrown when record is referenced in another table (foreign key constraint)
		        throw new ResourceInUseException("AMC Quotation with ID " + id + " cannot be deleted because it is in use.");
		    } catch (EmptyResultDataAccessException ex) {
		        // If deleteById() fails because the record doesn’t exist
		        throw new ResourceNotFoundException("AMC Quotation not found with ID: " + id);
		    }
		}





        
}
