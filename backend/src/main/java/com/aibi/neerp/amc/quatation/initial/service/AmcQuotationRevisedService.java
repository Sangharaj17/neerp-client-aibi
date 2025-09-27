package com.aibi.neerp.amc.quatation.initial.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aibi.neerp.amc.common.entity.ElevatorMake;
import com.aibi.neerp.amc.common.entity.NumberOfService;
import com.aibi.neerp.amc.common.entity.PaymentTerm;
import com.aibi.neerp.amc.common.repository.ElevatorMakeRepository;
import com.aibi.neerp.amc.common.repository.NumberOfServiceRepository;
import com.aibi.neerp.amc.common.repository.PaymentTermRepository;
import com.aibi.neerp.amc.quatation.initial.dto.AmcCombinedQuotationRequestDto;
import com.aibi.neerp.amc.quatation.initial.dto.AmcQuotationRequestDto;
import com.aibi.neerp.amc.quatation.initial.dto.AmcQuotationResponseDto;
import com.aibi.neerp.amc.quatation.initial.dto.AmcQuotationViewResponseDto;
import com.aibi.neerp.amc.quatation.initial.dto.CombinedQuotationDto;
import com.aibi.neerp.amc.quatation.initial.dto.EditQuotationResponseDto;
import com.aibi.neerp.amc.quatation.initial.entity.AmcCombinedQuotation;
import com.aibi.neerp.amc.quatation.initial.entity.AmcQuotation;
import com.aibi.neerp.amc.quatation.initial.entity.RevisedAmcQuotation;
import com.aibi.neerp.amc.quatation.initial.repository.AmcQuotationRepository;
import com.aibi.neerp.amc.quatation.initial.repository.RevisedAmcQuotationRepository;
import com.aibi.neerp.amc.quatation.renewal.repository.AmcRenewalQuotationRepository;
import com.aibi.neerp.amc.quatation.renewal.repository.RevisedRenewalAmcQuotationRepository;
import com.aibi.neerp.customer.entity.Customer;
import com.aibi.neerp.customer.entity.Site;
import com.aibi.neerp.customer.repository.CustomerRepository;
import com.aibi.neerp.customer.repository.SiteRepository;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.NewLeads;
import com.aibi.neerp.leadmanagement.repository.CombinedEnquiryRepository;
import com.aibi.neerp.leadmanagement.repository.EnquiryRepository;
import com.aibi.neerp.leadmanagement.repository.NewLeadsRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AmcQuotationRevisedService {
	
	@Autowired 
	private RevisedAmcQuotationRepository revisedAmcQuotationRepository;
	@Autowired
	private  AmcQuotationRepository repository;
	@Autowired
    private  NewLeadsRepository leadRepository;
	@Autowired
    private  EnquiryRepository enquiryRepository;
	@Autowired
    private   CustomerRepository customerRepository;
	@Autowired
    private   SiteRepository siteRepository;
	@Autowired
    private   ElevatorMakeRepository elevatorMakeRepository;
	@Autowired
    private   PaymentTermRepository paymentTermRepository;
	@Autowired
    private   EmployeeRepository employeeRepository;
	@Autowired
    private   AmcRenewalQuotationRepository amcRenewalQuotationRepository;
	@Autowired
    private   RevisedRenewalAmcQuotationRepository revisedRenewalAmcQuotationRepository;
	@Autowired
    private   CombinedEnquiryRepository combinedEnquiryRepository;
	@Autowired
    private   NumberOfServiceRepository numberOfServiceRepository;

	public void createAmcRevisedQuotation(AmcQuotationRequestDto dto) {
		// TODO Auto-generated method stub
		
		  // --- Fetch foreign keys from DB ---
        NewLeads lead = dto.getLeadId() != null ? leadRepository.findById(dto.getLeadId()).orElse(null) : null;
        // Enquiry enquiry = dto.getEnquiryId() != null ? enquiryRepository.findById(dto.getEnquiryId()).orElse(null) : null;
        // Customer customer = dto.getCustomerId() != null ? customerRepository.findById(dto.getCustomerId()).orElse(null) : null;
        // Site site = dto.getSiteId() != null ? siteRepository.findById(dto.getSiteId()).orElse(null) : null;
        ElevatorMake makeOfElevator = dto.getMakeOfElevatorId() != null ? elevatorMakeRepository.findById(dto.getMakeOfElevatorId()).orElse(null) : null;
        PaymentTerm paymentTerm = dto.getPaymentTermId() != null ? paymentTermRepository.findById(dto.getPaymentTermId()).orElse(null) : null;
        Employee createdBy = dto.getCreatedById() != null ? employeeRepository.findById(dto.getCreatedById()).orElse(null) : null;

        AmcQuotation amcQuotation = dto.getAmcquatationId()!=null ? repository.findById(dto.getAmcquatationId()).get() : null;
        
        amcQuotation.setIsRevise(true);
        
        repository.save(amcQuotation);
        
        String edition = "";
        
        long noOfRecords = revisedAmcQuotationRepository.countByAmcQuotation_AmcQuatationId(dto.getAmcquatationId());
        noOfRecords++;
        edition = "Revised "+noOfRecords;
        
        // Using Optional and orElseThrow to throw an exception if not found
        NumberOfService numberOfService = numberOfServiceRepository
                .findById(dto.getNoOfServicesId().longValue())
                .orElseThrow(() -> new RuntimeException(
                        "NumberOfService not found with id: " + dto.getNoOfServicesId()));

        CombinedEnquiry combinedEnquiry = combinedEnquiryRepository.findById(dto.getCombinedEnquiryId())
                .orElseThrow(() -> new RuntimeException("CombinedEnquiry not found with id: " + dto.getCombinedEnquiryId()));

        // --- Build AMC Quotation ---
        RevisedAmcQuotation revisedAmcQuotation = RevisedAmcQuotation.builder()
                .quatationDate(dto.getQuatationDate() != null ? dto.getQuatationDate() : null)
                .amcQuotation(amcQuotation)
                .revisedEdition(edition)
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
                        .enquiry(cqDto.getEnquiryId() != null ? enquiryRepository.findById(cqDto.getEnquiryId()).orElse(null) : null)
                        .revisedQuotation(revisedAmcQuotation)
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

                revisedAmcQuotation.getCombinedQuotations().add(combined);
            }
        }

        revisedAmcQuotationRepository.save(revisedAmcQuotation);

		
        
	}
	
	
	
    public List<AmcQuotationResponseDto> getAllByAmcQuotationId(Integer amcQuotationId) {
        List<RevisedAmcQuotation> revisedQuotations = 
            revisedAmcQuotationRepository.findAllByAmcQuotation_AmcQuatationIdOrderByRevisedQuatationIdDesc(amcQuotationId);

        return revisedQuotations.stream()
                .map(this::mapToDto)
                .toList();
    }
    
    private String joinAmcStartAndEndDate(LocalDate startDate, LocalDate endDate) {
        if (startDate == null && endDate == null) {
            return null;
        }

        return startDate+" to "+endDate;
    }

	private AmcQuotationResponseDto mapToDto(RevisedAmcQuotation entity) {
	    return AmcQuotationResponseDto.builder()
	            .id(entity.getRevisedQuatationId())
	            .customerName(entity.getLead().getCustomerName())
	            .siteName(entity.getLead().getSiteName())
	            .employeeName(entity.getCreatedBy() != null ? entity.getCreatedBy().getEmployeeName() : null)
	            .place(entity.getLead().getArea().getAreaName())
	            .makeOfElevator(entity.getMakeOfElevator() != null ? entity.getMakeOfElevator().getName() : null)
	            .quatationDate(entity.getQuatationDate())
	            .forecastMonth(entity.getForecastMonth())
                .amcPeriod(joinAmcStartAndEndDate(entity.getFromDate(),entity.getToDate()))
	            .isFinal(entity.getIsFinal())
	            .edition(entity.getRevisedEdition())
	            .isRevised(entity.getIsRevise())
	            .build();
	}



	    public EditQuotationResponseDto getQuotationById(Integer id) {
        RevisedAmcQuotation amcQuotation = revisedAmcQuotationRepository.findById(id)
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
        		.amcQuatationId(amcQuotation.getAmcQuotation().getAmcQuatationId())
                .revisedQuatationId(amcQuotation.getRevisedQuatationId())
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
	    
	    
	    public AmcQuotationViewResponseDto getQuotationDetails(Integer quotationId) {
	        RevisedAmcQuotation amcQuotation = revisedAmcQuotationRepository.findById(quotationId)
	                .orElseThrow(() -> new RuntimeException("Quotation not found"));

	        return AmcQuotationViewResponseDto.builder()
	        		.revisedAmcQuatationId(amcQuotation.getRevisedQuatationId())           
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
	        RevisedAmcQuotation amcQuotation = revisedAmcQuotationRepository.findById(quotationId)
	                .orElseThrow(() -> new EntityNotFoundException("Quotation not found with id: " + quotationId));

	        // ✅ 2. Mark as Final
	        amcQuotation.setIsFinal(1);
	        revisedAmcQuotationRepository.save(amcQuotation);

	        // ✅ 3. Get Lead from Quotation
	        NewLeads lead = amcQuotation.getLead();

	        // ✅ 4. Check if Customer exists
	        Customer customer = customerRepository.findByLead_LeadId(lead.getLeadId());

	        if (customer == null) {
	            // ✅ 4A. Create New Customer
	            customer = Customer.builder()
	                    .customerName(lead.getCustomerName())
	                    .contactNumber(lead.getCustomer1Contact())
	                    .emailId(lead.getEmailId())
	                    .address(lead.getSiteName()) // or actual lead address field
	                    .isVerified(false)
	                    .active(true)
	                    .lead(lead)
	                    .build();

	            customer = customerRepository.save(customer);
	        }

	        // ✅ 5. Check if Site with Same Name Exists for This Customer
	        boolean siteExists = siteRepository.existsByCustomer_CustomerIdAndSiteNameIgnoreCase(
	                customer.getCustomerId(),
	                lead.getSiteName()
	        );

	        if (!siteExists) {
	            Site newSite = Site.builder()
	                    .customer(customer)
	                    .siteName(lead.getSiteName())
	                    .siteAddress(lead.getSiteAddress()) // map correct field
	                    .status("ACTIVE")
	                    .build();

	            siteRepository.save(newSite);
	        }

	        return "Success";
	    }


	
	

}
