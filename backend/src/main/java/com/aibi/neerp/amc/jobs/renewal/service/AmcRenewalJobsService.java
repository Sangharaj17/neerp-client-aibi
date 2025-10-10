package com.aibi.neerp.amc.jobs.renewal.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.aibi.neerp.amc.jobs.initial.dto.AmcJobRequestDto;
import com.aibi.neerp.amc.jobs.initial.dto.AmcJobResponseDto;
import com.aibi.neerp.amc.jobs.initial.dto.EmployeeDto;
import com.aibi.neerp.amc.jobs.initial.dto.LiftData;
import com.aibi.neerp.amc.jobs.initial.dto.RoutesDto;
import com.aibi.neerp.amc.jobs.initial.entity.AmcJob;
import com.aibi.neerp.amc.jobs.initial.entity.Routes;
import com.aibi.neerp.amc.jobs.initial.repository.RoutesRepository;
import com.aibi.neerp.amc.jobs.initial.service.AmcJobsService;
import com.aibi.neerp.amc.jobs.initial.service.RoutesService;
import com.aibi.neerp.amc.jobs.renewal.dto.AddRenewalJobDetailsData;
import com.aibi.neerp.amc.jobs.renewal.dto.AmcRenewalJobRequestDto;
import com.aibi.neerp.amc.jobs.renewal.dto.AmcRenewalJobResponseDto;
import com.aibi.neerp.amc.jobs.renewal.dto.SelectDetailForRenewalJob;
import com.aibi.neerp.amc.jobs.renewal.entity.AmcRenewalJob;
import com.aibi.neerp.amc.jobs.renewal.repository.AmcRenewalJobRepository;
import com.aibi.neerp.amc.quatation.initial.entity.AmcQuotation;
import com.aibi.neerp.amc.quatation.initial.entity.RevisedAmcQuotation;
import com.aibi.neerp.amc.quatation.renewal.entity.AmcRenewalQuotation;
import com.aibi.neerp.amc.quatation.renewal.entity.RevisedRenewalAmcQuotation;
import com.aibi.neerp.amc.quatation.renewal.repository.AmcRenewalQuotationRepository;
import com.aibi.neerp.amc.quatation.renewal.repository.RevisedRenewalAmcQuotationRepository;
import com.aibi.neerp.customer.entity.Customer;
import com.aibi.neerp.customer.entity.Site;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.Enquiry;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AmcRenewalJobsService {
	
	@Autowired
	private AmcRenewalQuotationRepository amcRenewalQuotationRepository;
	
	@Autowired
	private RevisedRenewalAmcQuotationRepository revisedRenewalAmcQuotationRepository;
	
	@Autowired
	private RoutesService routesService;
	
	@Autowired
	private EmployeeRepository employeeRepository;
	
	@Autowired 
	private RoutesRepository routesRepository;
	
	@Autowired
	private AmcRenewalJobRepository amcRenewalJobRepository;
	
	
    public List<SelectDetailForRenewalJob> getPendingRenewalJobs() {

        // AMC Quotation
        List<SelectDetailForRenewalJob> amcList = amcRenewalQuotationRepository.findFinalPendingAmcRenewalQuotations()
            .stream()
            .map(a -> {
                // Salutation still from Lead if available
                String salutation = a.getLead() != null && a.getLead().getSalutations() != null
                        ? a.getLead().getSalutations().trim()
                        : "";

                // Take customer and site directly from AMC quotation
                String display = "AMC for " +
                        (salutation.isEmpty() ? "" : salutation + " ") +
                        a.getCustomer().getCustomerName() +
                        " / " + a.getSite().getSiteName() +" / renewal";

                return new SelectDetailForRenewalJob(display, a.getRenewalQuaId(), null , true);
            })
            .collect(Collectors.toList());

        // Revised AMC Quotation
        List<SelectDetailForRenewalJob> revisedList = revisedRenewalAmcQuotationRepository.findFinalPendingRevisedRenewalAmcQuotations()
            .stream()
            .map(r -> {
                // Salutation from AMC quotation's original lead
                String salutation = (r.getAmcRenewalQuotation() != null &&
                        r.getAmcRenewalQuotation().getLead() != null &&
                        r.getAmcRenewalQuotation().getLead().getSalutations() != null)
                        ? r.getAmcRenewalQuotation().getLead().getSalutations().trim()
                        : "";

                // Customer and site directly from Revised AMC quotation
                String display = "AMC for " +
                        (salutation.isEmpty() ? "" : salutation + " ") +
                        r.getCustomer().getCustomerName() +
                        " / " + r.getSite().getSiteName() +
                        " / " + r.getRevisedEdition()+" / renewal revise";

                return new SelectDetailForRenewalJob(display, null, r.getRevisedRenewalId() , true);
            })
            .collect(Collectors.toList());

        amcList.addAll(revisedList);
        return amcList;
    }
	
	 public AddRenewalJobDetailsData getAddRenewalJobDetailsData(SelectDetailForRenewalJob selectDetailForJob) {

	        Integer amcQuatationId = selectDetailForJob.getAmcRenewalQuatationId();
	        Integer revisedQuatationId = selectDetailForJob.getRevisedRenewalQuatationId();

	        if (amcQuatationId != null) {
	            // ✅ Normal AMC Quotation
	            AmcRenewalQuotation amcQuotation = amcRenewalQuotationRepository.findById(amcQuatationId)
	                    .orElseThrow(() -> new RuntimeException("AMC Quotation not found for ID: " + amcQuatationId));

	            return buildAddJobDetailsDataFromAmc(amcQuotation);

	        } else if (revisedQuatationId != null) {
	            // ✅ Revised AMC Quotation
	            RevisedRenewalAmcQuotation revisedAmcQuotation = revisedRenewalAmcQuotationRepository.findById(revisedQuatationId)
	                    .orElseThrow(() -> new RuntimeException("Revised AMC Quotation not found for ID: " + revisedQuatationId));

	            return buildAddJobDetailsDataFromRevisedAmc(revisedAmcQuotation);
	        }

	        throw new IllegalArgumentException("Both AMC Quotation ID and Revised Quotation ID are null!");
	    }

	    /**
	     * Builds AddJobDetailsData from AmcQuotation
	     */
	    private AddRenewalJobDetailsData buildAddJobDetailsDataFromAmc(AmcRenewalQuotation amcQuotation) {
	    	AddRenewalJobDetailsData addJobDetailsData = new AddRenewalJobDetailsData();

	        // ✅ Customer & Site
	        if (amcQuotation.getCustomer() != null) {
	            addJobDetailsData.setCustomer(amcQuotation.getCustomer().getCustomerName());
	        }
	        if (amcQuotation.getSite() != null) {
	            addJobDetailsData.setCustomerSite(amcQuotation.getSite().getSiteName());
	        }
	        
	        addJobDetailsData.setNoOfServices(amcQuotation.getNumberOfService().getValue());
	        
	        //addJobDetailsData.setMailId(amcQuotation!=null ? amcQuotation.getLead().getEmailId():"");


	        // ✅ Contract Type & Job Amount
	        String contractType = amcQuotation.getTypeContract();
	        String[] arrOfContractType = (contractType != null) ? contractType.split(",") : new String[0];

	        BigDecimal jobAmount = null;

	        if (arrOfContractType.length > 0) {
	            String type = arrOfContractType[0].trim();
	            if (type.equalsIgnoreCase("Non-Comprehensive")) {
	                jobAmount = amcQuotation.getIsFinalOrdinary();
	            } else if (type.equalsIgnoreCase("Semi-Comprehensive")) {
	                jobAmount = amcQuotation.getIsFinalSemiComp();
	            } else {
	                jobAmount = amcQuotation.getIsFinalComp();
	            }
	        }

	        addJobDetailsData.setJobAmount(jobAmount);

	        addJobDetailsData.setStartDate(amcQuotation.getFromDate());
	        if (amcQuotation.getPaymentTerm() != null) {
	            addJobDetailsData.setPaymentTerm(amcQuotation.getPaymentTerm().getTermName());
	        }

	        // ✅ Lift Data
	        addJobDetailsData.setLiftDatas(buildLiftData(amcQuotation.getCombinedEnquiry()));

	        // ✅ Routes & Employees
	        addJobDetailsData.setRoutesDtos(routesService.getAllRoutes());
	        addJobDetailsData.setEmployeeDtos(buildEmployeeDtos());

	        return addJobDetailsData;
	    }

	    /**
	     * Builds AddJobDetailsData from RevisedAmcQuotation
	     */
	    private AddRenewalJobDetailsData buildAddJobDetailsDataFromRevisedAmc(RevisedRenewalAmcQuotation revisedAmcQuotation) {
	    	AddRenewalJobDetailsData addJobDetailsData = new AddRenewalJobDetailsData();

	        // ✅ Customer & Site
	        if (revisedAmcQuotation.getCustomer() != null) {
	            addJobDetailsData.setCustomer(revisedAmcQuotation.getCustomer().getCustomerName());
	        }
	        if (revisedAmcQuotation.getSite() != null) {
	            addJobDetailsData.setCustomerSite(revisedAmcQuotation.getSite().getSiteName());
	        }
	        
	        addJobDetailsData.setNoOfServices(revisedAmcQuotation.getNumberOfService().getValue());

	       // addJobDetailsData.setMailId(revisedAmcQuotation!=null ? revisedAmcQuotation.getLead().getEmailId():"");

	        // ✅ Contract Type & Job Amount
	        String contractType = revisedAmcQuotation.getTypeContract();
	        String[] arrOfContractType = (contractType != null) ? contractType.split(",") : new String[0];

	        BigDecimal jobAmount = null;

	        if (arrOfContractType.length > 0) {
	            String type = arrOfContractType[0].trim();
	            if (type.equalsIgnoreCase("Non-Comprehensive")) {
	                jobAmount = revisedAmcQuotation.getIsFinalOrdinary();
	            } else if (type.equalsIgnoreCase("Semi-Comprehensive")) {
	                jobAmount = revisedAmcQuotation.getIsFinalSemiComp();
	            } else {
	                jobAmount = revisedAmcQuotation.getIsFinalComp();
	            }
	        }

	        addJobDetailsData.setJobAmount(jobAmount);

	        addJobDetailsData.setStartDate(revisedAmcQuotation.getFromDate());
	        if (revisedAmcQuotation.getPaymentTerm() != null) {
	            addJobDetailsData.setPaymentTerm(revisedAmcQuotation.getPaymentTerm().getTermName());
	        }

	        // ✅ Lift Data
	        addJobDetailsData.setLiftDatas(buildLiftData(revisedAmcQuotation.getCombinedEnquiry()));

	        // ✅ Routes & Employees
	        addJobDetailsData.setRoutesDtos(routesService.getAllRoutes());
	        addJobDetailsData.setEmployeeDtos(buildEmployeeDtos());

	        return addJobDetailsData;
	    }

	    /**
	     * Builds LiftData List from CombinedEnquiry
	     */
	    public List<LiftData> buildLiftData(CombinedEnquiry combinedEnquiry) {
	        List<LiftData> liftDatas = new ArrayList<>();
	        if (combinedEnquiry != null && combinedEnquiry.getEnquiries() != null) {
	            for (Enquiry enquiry : combinedEnquiry.getEnquiries()) {
	                LiftData liftData = new LiftData();
	                
	                liftData.setEnquiryId(enquiry.getEnquiryId());
	               // liftData.setLiftName(enquiry.getlif);
	                
	                liftData.setLiftName(enquiry.getLiftName());


	                String capacity = null;
	                if (enquiry.getPersonCapacity() != null) {
	                    capacity = enquiry.getPersonCapacity().getDisplayName();
	                } else if (enquiry.getWeight() != null) {
	                    capacity = enquiry.getWeight().getWeightValue() + " Kg";
	                }
	                liftData.setCapacityValue(capacity);

	                if (enquiry.getNoOfFloors() != null) {
	                    liftData.setNoOfFloors(enquiry.getNoOfFloors().getFloorName());
	                }
	                if (enquiry.getTypeOfLift() != null) {
	                    liftData.setTypeOfElevators(enquiry.getTypeOfLift().getLiftTypeName());
	                }

	                liftDatas.add(liftData);
	            }
	        }
	        return liftDatas;
	    }

	    /**
	     * Builds Employee DTO list from employee repository
	     */
	    private List<EmployeeDto> buildEmployeeDtos() {
	        return employeeRepository.findAll().stream().map(emp -> {
	            EmployeeDto employeeDto = new EmployeeDto();
	            employeeDto.setEmployeeId(emp.getEmployeeId());
	            employeeDto.setName(emp.getEmployeeName());
	            employeeDto.setAddress(emp.getAddress());
	            if (emp.getRole() != null) {
	                employeeDto.setRole(emp.getRole().getRole());
	            }
	            return employeeDto;
	        }).toList();
	    }

	
	    public void createAmcRenewalJob(AmcRenewalJobRequestDto dto) {
	    	
	    	System.out.println("edededed");
	      //  log.debug("Creating AMC Job for leadId: {}", dto.getLeadId());

	        AmcRenewalJob job = new AmcRenewalJob();

	        Customer customer = null;
	        Site site = null;
	        
	        

	        if (dto.getAmcRenewalQuatationId()!= null) {
	            log.debug("Fetching AMC Quotation for id {}", dto.getAmcRenewalQuatationId());
	            AmcRenewalQuotation amcQuotation = amcRenewalQuotationRepository.findById(dto.getAmcRenewalQuatationId())
	                    .orElseThrow(() -> {
	                        log.error("AMC Quotation not found for ID: {}", dto.getAmcRenewalQuatationId());
	                        return new RuntimeException("AMC Quotation not found");
	                    });
	            
	            job.setPreJobId(amcQuotation.getPreJobId());;
	            
	            job.setAmcRenewalQuotation(amcQuotation);
	            job.setLead(amcQuotation.getLead());
	            
	            Integer noOfLifts = amcQuotation.getNoOfElevator();
	            job.setNoOfElevator(noOfLifts);
	            
	            job.setNoOfLifsServiceNeedToCompleteCount(noOfLifts);
	            job.setNoOfLiftsCurrentServiceCompletedCount(0);
	            job.setCurrentServiceNumber(1);
	            job.setCurrentServiceStatus("Pending");            
	            
	            job.setContractType(amcQuotation.getTypeContract());
	            
	            job.setStartDate(amcQuotation.getFromDate());
	            job.setEndDate(amcQuotation.getToDate());
	            
	            customer = amcQuotation.getCustomer();
	            site = amcQuotation.getSite();
	        }

	        if (dto.getRevisedRenewalQuatationId() != null) {
	            log.debug("Fetching Revised AMC Quotation for id {}", dto.getRevisedRenewalQuatationId());
	            RevisedRenewalAmcQuotation revised = revisedRenewalAmcQuotationRepository.findById(dto.getRevisedRenewalQuatationId())
	                    .orElseThrow(() -> {
	                        log.error("Revised AMC Quotation not found for ID: {}", dto.getRevisedRenewalQuatationId());
	                        return new RuntimeException("Revised AMC Quotation not found");
	                    });
	            job.setPreJobId(revised.getPreJobId());

	            job.setRevisedRenewalAmcQuotation(revised);
	            job.setLead(revised.getLead());
	            job.setNoOfElevator(revised.getNoOfElevator());
	            job.setContractType(revised.getTypeContract());
	            
	            job.setStartDate(revised.getFromDate());
	            job.setEndDate(revised.getToDate());;
	            
	            customer = revised.getCustomer();
	            site = revised.getSite();
	        }

	        job.setCustomer(customer);
	        job.setSite(site);

	        if (dto.getServiceEngineerId() != null) {
	            job.setServiceEngineer(employeeRepository.findById(dto.getServiceEngineerId())
	                    .orElseThrow(() -> {
	                        log.error("Service Engineer not found for ID: {}", dto.getServiceEngineerId());
	                        return new RuntimeException("Service Engineer not found");
	                    }));
	        }
	        if (dto.getSalesExecutiveId() != null) {
	            job.setSalesExecutive(employeeRepository.findById(dto.getSalesExecutiveId())
	                    .orElseThrow(() -> {
	                        log.error("Sales Executive not found for ID: {}", dto.getSalesExecutiveId());
	                        return new RuntimeException("Sales Executive not found");
	                    }));
	        }
	        if (dto.getRouteId() != null) {
	            job.setRoute(routesRepository.findById(dto.getRouteId())
	                    .orElseThrow(() -> {
	                        log.error("Route not found for ID: {}", dto.getRouteId());
	                        return new RuntimeException("Route not found");
	                    }));
	        }
	        
	        if(dto.getListOfEmployees()!=null) {
	        	
	        	List<Integer> emplIds = dto.getListOfEmployees();
	        	
	        	RoutesDto routesDto = routesService.createRouteWithEmployees(emplIds);
	        	Routes route= routesRepository.findById(routesDto.getRouteId()).get();
	        	
	        	job.setRoute(route);
	        	
	        }

	        // Map other fields
	        //job.setRenewlStatus(dto.getRenewlStatus());
	       // job.setContractType(dto.getContractType());
	        job.setMakeOfElevator(dto.getMakeOfElevator());
	      //  job.setNoOfElevator(dto.getNoOfElevator());
	        job.setJobNo(dto.getJobNo());
	        job.setCustomerGstNo(dto.getCustomerGstNo());
	        job.setJobType(dto.getJobType());
	       // job.setStartDate(dto.getStartDate());
	       // job.setEndDate(dto.getEndDate());
	        job.setNoOfServices(dto.getNoOfServices());
	        job.setPendingServiceCount(dto.getNoOfServices());
	        job.setJobAmount(dto.getJobAmount());
	        job.setBalanceAmount(dto.getJobAmount());

	        job.setAmountWithGst(dto.getAmountWithGst());
	        job.setAmountWithoutGst(dto.getAmountWithoutGst());
	        job.setPaymentTerm(dto.getPaymentTerm());
	        job.setGstPercentage(dto.getGstPercentage());
	        job.setDealDate(dto.getDealDate());
	        job.setJobLiftDetail(dto.getJobLiftDetail());
	        job.setJobStatus(dto.getJobStatus());
	        // false means job not completed and true means job completed
	        job.setStatus(true);
	        job.setRenewalRemark(dto.getRenewalRemark());
	        job.setIsNew(dto.getIsNew());
	        job.setCurrentServiceNumber(dto.getCurrentServiceNumber());

	        AmcRenewalJob amcJob = amcRenewalJobRepository.save(job);
	        
	       // getStatusOfCurrentService(amcJob.getRenewalJobId());)

	        
	       // updateAmcJobActivityStatus(amcJob);
	        log.info("AMC renewal Job saved successfully for leadId: {}", dto.getLeadId());
	    }
	    
	    
	    public Page<AmcRenewalJobResponseDto> getAllRenewalJobs(String search, LocalDate dateSearch, int page, int size, String sortBy, String direction) {
	        log.info("Fetching AMC Renewal Jobs with search='{}', date='{}', page={}, size={}, sortBy={}, direction={}", 
	                 search, dateSearch, page, size, sortBy, direction);

	        Sort sort = direction.equalsIgnoreCase("desc")
	                ? Sort.by(sortBy).descending()
	                : Sort.by(sortBy).ascending();

	        Pageable pageable = PageRequest.of(page, size, sort);

	        // Convert LocalDate to String for repository query
	        String dateSearchStr = dateSearch != null ? dateSearch.toString() : null;

	        Page<AmcRenewalJob> results = amcRenewalJobRepository.searchAll(
	                search == null ? "" : search,
	                dateSearchStr,
	                pageable
	        );

	        return results.map(this::convertToDto);
	    }


	    private AmcRenewalJobResponseDto convertToDto(AmcRenewalJob job) {
	        String place = null;

	        if (job.getAmcRenewalQuotation() != null &&
	            job.getAmcRenewalQuotation().getLead() != null &&
	            job.getAmcRenewalQuotation().getLead().getArea() != null) {
	            place = job.getAmcRenewalQuotation().getLead().getArea().getAreaName();
	        }else if(job.getRevisedRenewalAmcQuotation()!=null 
	        		&& job.getRevisedRenewalAmcQuotation().getLead()!=null && 
	        		job.getRevisedRenewalAmcQuotation().getLead().getArea()!=null ){
	        	place = job.getRevisedRenewalAmcQuotation().getLead().getArea().getAreaName();
	        }

	        return AmcRenewalJobResponseDto.builder()
	                .renewalJobId(job.getRenewalJobId())
	                .jobType(job.getContractType())
	                .jobNo(job.getJobNo())
	                .customerName(job.getCustomer() != null ? job.getCustomer().getCustomerName() : null)
	                .siteName(job.getSite() != null ? job.getSite().getSiteName() : null)
	                .siteAddress(job.getSite() != null ? job.getSite().getSiteAddress() : null)
	                .place(place)
	                .serviceEngineers(
	                        job.getRoute() != null && job.getRoute().getEmployees() != null
	                                ? job.getRoute().getEmployees().stream()
	                                    .map(e -> e.getEmployeeName())
	                                    .collect(Collectors.toList())
	                                : List.of()
	                )
	                .jobAmount(job.getJobAmount())
	                .paymentTerm(job.getPaymentTerm())
	                .startDate(job.getStartDate())
	                .endDate(job.getEndDate())
	                .jobStatus(job.getJobStatus())
	                .build();
	    }	
	    
	    public List<AmcRenewalJob> getAllActiveRenewalJobs() {
	        log.info("Fetching all active AMC Renewal jobs with customer and site");
	        return amcRenewalJobRepository.findAllActiveRenewalJobs();
	    }

	 public List<LiftData> getAllLiftsForAddBreakDownTodo(Integer jobId){
    	
    	AmcRenewalJob amcJob = amcRenewalJobRepository.findById(jobId).get();
    	AmcRenewalQuotation amcQuotation = null;
    	RevisedRenewalAmcQuotation revisedAmcQuotation = null;
    	
    	amcQuotation = amcJob.getAmcRenewalQuotation();
    	revisedAmcQuotation = amcJob.getRevisedRenewalAmcQuotation();
    	
    	CombinedEnquiry combinedEnquiry = null;
    	
    	if(amcQuotation!=null) {
    	  combinedEnquiry = amcQuotation.getCombinedEnquiry();
    	}else {
    		combinedEnquiry = revisedAmcQuotation.getCombinedEnquiry();
    	}
    	
    	return buildLiftData(combinedEnquiry);
    } 
	

}
