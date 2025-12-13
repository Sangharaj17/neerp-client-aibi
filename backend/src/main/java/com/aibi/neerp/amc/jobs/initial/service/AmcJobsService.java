package com.aibi.neerp.amc.jobs.initial.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.context.annotation.Lazy;

import com.aibi.neerp.amc.invoice.service.AmcInvoiceService;
import com.aibi.neerp.amc.jobs.initial.dto.AddJobDetailsData;
import com.aibi.neerp.amc.jobs.initial.dto.AmcJobRequestDto;
import com.aibi.neerp.amc.jobs.initial.dto.AmcJobResponseDto;
import com.aibi.neerp.amc.jobs.initial.dto.AmcJobsServiceEnginnersServicesReport;
import com.aibi.neerp.amc.jobs.initial.dto.AmcServiceAlertData;
import com.aibi.neerp.amc.jobs.initial.dto.EmployeeDto;
import com.aibi.neerp.amc.jobs.initial.dto.LiftData;
import com.aibi.neerp.amc.jobs.initial.dto.RoutesDto;
import com.aibi.neerp.amc.jobs.initial.dto.SelectDetailForJob;
import com.aibi.neerp.amc.jobs.initial.dto.ServiceEmployeeReport;
import com.aibi.neerp.amc.jobs.initial.entity.AmcJob;
import com.aibi.neerp.amc.jobs.initial.entity.Routes;
import com.aibi.neerp.amc.jobs.initial.repository.AmcJobRepository;
import com.aibi.neerp.amc.jobs.initial.repository.RoutesRepository;
import com.aibi.neerp.amc.jobs.renewal.entity.AmcRenewalJob;
import com.aibi.neerp.amc.jobs.renewal.repository.AmcRenewalJobRepository;
import com.aibi.neerp.amc.quatation.initial.entity.AmcQuotation;
import com.aibi.neerp.amc.quatation.initial.entity.RevisedAmcQuotation;
import com.aibi.neerp.amc.quatation.initial.repository.AmcQuotationRepository;
import com.aibi.neerp.amc.quatation.initial.repository.RevisedAmcQuotationRepository;
import com.aibi.neerp.customer.entity.Customer;
import com.aibi.neerp.customer.entity.Site;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.Enquiry;
import com.aibi.neerp.leadmanagement.repository.NewLeadsRepository;
import com.aibi.neerp.quotation.entity.QuotationLiftDetail;
import com.aibi.neerp.quotation.entity.QuotationMain;
import com.aibi.neerp.quotation.repository.QuotationMainRepository;

import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@Lazy
public class AmcJobsService {

	@Autowired
    private  AmcQuotationRepository amcQuotationRepository;
	@Autowired
    private  RevisedAmcQuotationRepository revisedAmcQuotationRepository;
	@Autowired
    private  EmployeeRepository employeeRepository;
	@Autowired
    private  RoutesService routesService;
	
	@Autowired
	private AmcInvoiceService amcInvoiceService;
	
	
	 @Autowired
	    private AmcJobRepository amcJobRepository;

	 
	    @Autowired
	    private NewLeadsRepository newLeadsRepository;

	 
	    @Autowired
	    private RoutesRepository routesRepository;
	    
	    @Autowired
	    private AmcRenewalJobRepository amcRenewalJobRepository;

        @Autowired
        private QuotationMainRepository quotationMainRepository;
	    
	    
	  
//	    @Autowired
//	    private AmcJobActivityService amcJobActivityService;
//   

//    public List<SelectDetailForJob> getPendingJobs() {
//
//        // AMC Quotation
//        List<SelectDetailForJob> amcList = amcQuotationRepository.findFinalPendingAmcQuotations()
//            .stream()
//            .map(a -> {
//                String salutation = a.getLead() != null && a.getLead().getSalutations() != null
//                        ? a.getLead().getSalutations().trim()
//                        : "";
//                String display = "AMC for " +
//                        (salutation.isEmpty() ? "" : salutation + " ") +  // ✅ Add Mr./Mrs. if available
//                        a.getCustomer().getCustomerName() +
//                        " / " + a.getSite().getSiteName();
//
//                return new SelectDetailForJob(display, a.getAmcQuatationId(), null);
//            })
//            .collect(Collectors.toList());
//
//        // Revised AMC Quotation
//        List<SelectDetailForJob> revisedList = revisedAmcQuotationRepository.findFinalPendingRevisedAmcQuotations()
//            .stream()
//            .map(r -> {
//                String salutation = (r.getAmcQuotation() != null &&
//                        r.getAmcQuotation().getLead() != null &&
//                        r.getAmcQuotation().getLead().getSalutations() != null)
//                        ? r.getAmcQuotation().getLead().getSalutations().trim()
//                        : "";
//
//                String display = "AMC for " +
//                        (salutation.isEmpty() ? "" : salutation + " ") +
//                        r.getCustomer().getCustomerName() +
//                        " / " + r.getSite().getSiteName() +
//                        " / " + r.getRevisedEdition();
//
//                return new SelectDetailForJob(display, null, r.getRevisedQuatationId());
//            })
//            .collect(Collectors.toList());
//
//        amcList.addAll(revisedList);
//        return amcList;
//    }
	    
	    public List<SelectDetailForJob> getPendingJobs() {

	        // AMC Quotation
	        List<SelectDetailForJob> amcList = amcQuotationRepository.findFinalPendingAmcQuotations()
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
	                        " / " + a.getSite().getSiteName();

	                return new SelectDetailForJob(display, a.getAmcQuatationId(), null, null, false);
	            })
	            .collect(Collectors.toList());

	        // Revised AMC Quotation
	        List<SelectDetailForJob> revisedList = revisedAmcQuotationRepository.findFinalPendingRevisedAmcQuotations()
	            .stream()
	            .map(r -> {
	                // Salutation from AMC quotation's original lead
	                String salutation = (r.getAmcQuotation() != null &&
	                        r.getAmcQuotation().getLead() != null &&
	                        r.getAmcQuotation().getLead().getSalutations() != null)
	                        ? r.getAmcQuotation().getLead().getSalutations().trim()
	                        : "";

	                // Customer and site directly from Revised AMC quotation
	                String display = "AMC for " +
	                        (salutation.isEmpty() ? "" : salutation + " ") +
	                        r.getCustomer().getCustomerName() +
	                        " / " + r.getSite().getSiteName() +
	                        " / " + r.getRevisedEdition();

	                return new SelectDetailForJob(display, null, r.getRevisedQuatationId(), null, false);
	            })
	            .collect(Collectors.toList());

	        amcList.addAll(revisedList);
	        return amcList;
	    }

    
    public AddJobDetailsData getAddJobDetailsData(SelectDetailForJob selectDetailForJob) {

        Integer amcQuatationId = selectDetailForJob.getAmcQuatationId();
        Integer revisedQuatationId = selectDetailForJob.getRevisedQuatationId();

        if (amcQuatationId != null) {
            // ✅ Normal AMC Quotation
            AmcQuotation amcQuotation = amcQuotationRepository.findById(amcQuatationId)
                    .orElseThrow(() -> new RuntimeException("AMC Quotation not found for ID: " + amcQuatationId));

            return buildAddJobDetailsDataFromAmc(amcQuotation);

        } else if (revisedQuatationId != null) {
            // ✅ Revised AMC Quotation
            RevisedAmcQuotation revisedAmcQuotation = revisedAmcQuotationRepository.findById(revisedQuatationId)
                    .orElseThrow(() -> new RuntimeException("Revised AMC Quotation not found for ID: " + revisedQuatationId));

            return buildAddJobDetailsDataFromRevisedAmc(revisedAmcQuotation);
        }

        throw new IllegalArgumentException("Both AMC Quotation ID and Revised Quotation ID are null!");
    }

    /**
     * Builds AddJobDetailsData from AmcQuotation
     */
    private AddJobDetailsData buildAddJobDetailsDataFromAmc(AmcQuotation amcQuotation) {
        AddJobDetailsData addJobDetailsData = new AddJobDetailsData();

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
    private AddJobDetailsData buildAddJobDetailsDataFromRevisedAmc(RevisedAmcQuotation revisedAmcQuotation) {
        AddJobDetailsData addJobDetailsData = new AddJobDetailsData();

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
    
    public String getStatusOfCurrentService(Integer jobId) {
	    AmcJob amcJob = amcJobRepository.findById(jobId)
	            .orElseThrow(() -> new RuntimeException("AmcJob not found with id " + jobId));

	    Integer completedCount = amcJob.getNoOfLiftsCurrentServiceCompletedCount();
	    Integer requiredCount = amcJob.getNoOfLifsServiceNeedToCompleteCount();
	    String currentServiceStatus = amcJob.getCurrentServiceStatus();
	    Integer currentServiceNumber = amcJob.getCurrentServiceNumber();
	    
	    Integer pendingServices = 0;
	    Integer totalServices = amcJob.getNoOfServices();
	    
	   // pendingServices = totalServices - currentServiceNumber;

	    if (completedCount != null && requiredCount != null && completedCount > 0 && requiredCount > 0) {
	        if (completedCount.equals(requiredCount)) {
	            LocalDate lastActivityDate = amcJob.getLastActivityDate();

	            if (lastActivityDate != null) {
	                int lastMonth = lastActivityDate.getMonthValue();
	                int currentMonth = LocalDate.now().getMonthValue();
	                
	               // System.out.println(lastMonth+" lastmonth "+currentMonth);

	                if (lastMonth == currentMonth) {
	                    currentServiceStatus = "Completed";
	                    amcJob.setPreviousServicingDate(lastActivityDate);
	                    //  pendingServices = totalServices - currentServiceNumber;
	                } else {
	                    currentServiceStatus = "Pending";
	                    completedCount = 0;
	                    lastActivityDate = null;
	                    currentServiceNumber++;
	                    
	                   
	                    //amcJob.setPendingServiceCount(pendingServices);	 
	                }
	            } else {
	                currentServiceStatus = "Pending";
	                completedCount = 0;
	                currentServiceNumber++;
	                
	               // pendingServices = totalServices - currentServiceNumber;
	               // amcJob.setPendingServiceCount(pendingServices);	 
	            }

	            amcJob.setNoOfLiftsCurrentServiceCompletedCount(completedCount);
	            amcJob.setCurrentServiceNumber(currentServiceNumber);
	            amcJob.setCurrentServiceStatus(currentServiceStatus);
	            amcJob.setLastActivityDate(lastActivityDate);
	            amcJobRepository.save(amcJob);

	        } else {
	            currentServiceStatus = "Pending";
	            amcJob.setCurrentServiceStatus(currentServiceStatus);
	            amcJobRepository.save(amcJob);
	        }
	    } else {
	        currentServiceStatus = "Pending";
	        amcJob.setCurrentServiceStatus(currentServiceStatus);

	        if (currentServiceNumber == 0) {
	            currentServiceNumber++;
	            //pendingServices = totalServices - currentServiceNumber;
	            amcJob.setCurrentServiceNumber(currentServiceNumber);
	           // amcJob.setPendingServiceCount(pendingServices);	     
	        }

	        amcJobRepository.save(amcJob);
	    }

	    return currentServiceStatus;
	}

    
    
    public void createAmcJob(AmcJobRequestDto dto) {
    	
    	System.out.println("edededed");
      //  log.debug("Creating AMC Job for leadId: {}", dto.getLeadId());

        AmcJob job = new AmcJob();

        Customer customer = null;
        Site site = null;
        
        

        if (dto.getAmcQuatationId() != null) {
            log.debug("Fetching AMC Quotation for id {}", dto.getAmcQuatationId());
            AmcQuotation amcQuotation = amcQuotationRepository.findById(dto.getAmcQuatationId())
                    .orElseThrow(() -> {
                        log.error("AMC Quotation not found for ID: {}", dto.getAmcQuatationId());
                        return new RuntimeException("AMC Quotation not found");
                    });
            job.setAmcQuotation(amcQuotation);
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

        if (dto.getRevisedQuatationId() != null) {
            log.debug("Fetching Revised AMC Quotation for id {}", dto.getRevisedQuatationId());
            RevisedAmcQuotation revised = revisedAmcQuotationRepository.findById(dto.getRevisedQuatationId())
                    .orElseThrow(() -> {
                        log.error("Revised AMC Quotation not found for ID: {}", dto.getRevisedQuatationId());
                        return new RuntimeException("Revised AMC Quotation not found");
                    });
            job.setRevisedAmcQuotation(revised);
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
        job.setRenewlStatus(dto.getRenewlStatus());
        //sjob.setContractType(dto.getContractType());
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

        AmcJob amcJob = amcJobRepository.save(job);
        
        getStatusOfCurrentService(amcJob.getJobId());

        amcInvoiceService.createMultipleInvoices(amcJob.getJobId() , null);
       // updateAmcJobActivityStatus(amcJob);
        log.info("AMC Job saved successfully for leadId: {}", dto.getLeadId());
    }
    
//    public void updateAmcJobActivityStatus(AmcJob amcJob) {
//    	
//    	amcJobActivityService.getStatusOfCurrentService(amcJob.getJobId());
//    	
//    }
    
//    public Page<AmcJobResponseDto> getAllJobs(String search, int page, int size, String sortBy, String direction) {
//        Sort sort = direction.equalsIgnoreCase("desc")
//                ? Sort.by(sortBy).descending()
//                : Sort.by(sortBy).ascending();
//
//        Pageable pageable = PageRequest.of(page, size, sort);
//
//        // Pass empty string if search is blank
//        return amcJobRepository.searchAll(search == null ? "" : search, pageable)
//                .map(this::convertToDto);
//    }
    
    public Page<AmcJobResponseDto> getAllJobs(String search, LocalDate dateSearch, int page, int size, String sortBy, String direction) {
        log.info("Fetching AMC Jobs with search='{}', date='{}', page={}, size={}, sortBy={}, direction={}", 
                 search, dateSearch, page, size, sortBy, direction);

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        // Convert LocalDate to String for repository query
        String dateSearchStr = dateSearch != null ? dateSearch.toString() : null;

        Page<AmcJob> results = amcJobRepository.searchAll(
                search == null ? "" : search,
                dateSearchStr,
                pageable
        );

        return results.map(this::convertToDto);
    }
    
    public List<AmcJobResponseDto> getAllJobsForExport() {
        // Step 1: Fetch all jobs (with related entities pre-fetched)
        List<AmcJob> jobs = amcJobRepository.findAllForExport();

        // Step 2: Convert to DTOs
        List<AmcJobResponseDto> responseList = jobs.stream()
                .map(this::convertToDto)
                .toList();

        return responseList;
    }
    
    


    private AmcJobResponseDto convertToDto(AmcJob job) {
        String place = null;

        if (job.getAmcQuotation() != null &&
            job.getAmcQuotation().getLead() != null &&
            job.getAmcQuotation().getLead().getArea() != null) {
            place = job.getAmcQuotation().getLead().getArea().getAreaName();
        }else if(job.getRevisedAmcQuotation() != null &&
                job.getRevisedAmcQuotation().getLead() != null &&
                job.getRevisedAmcQuotation().getLead().getArea() != null) {
                place = job.getRevisedAmcQuotation().getLead().getArea().getAreaName();
        }

        return AmcJobResponseDto.builder()
                .jobId(job.getJobId())
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

    
    public List<AmcJob> getAllActiveJobs() {
        log.info("Fetching all active AMC jobs with customer and site");
        return amcJobRepository.findAllActiveJobs();
    }
    
    public List<LiftData> getAllLiftsForAddBreakDownTodo(Integer jobId){
    	
    	AmcJob amcJob = amcJobRepository.findById(jobId).get();
    	AmcQuotation amcQuotation = null;
    	RevisedAmcQuotation revisedAmcQuotation = null;
    	
    	amcQuotation = amcJob.getAmcQuotation();
    	revisedAmcQuotation = amcJob.getRevisedAmcQuotation();
    	
    	CombinedEnquiry combinedEnquiry = null;
    	
    	if(amcQuotation!=null) {
    	  combinedEnquiry = amcQuotation.getCombinedEnquiry();
    	}else {
    		combinedEnquiry = revisedAmcQuotation.getCombinedEnquiry();
    	}
    	
    	return buildLiftData(combinedEnquiry);
    } 
    
    /*  here generating dashboard employee service report
     * 
     * */
    
    public AmcJobsServiceEnginnersServicesReport amcJobsServiceEnginnersServicesReport() {

        AmcJobsServiceEnginnersServicesReport report = new AmcJobsServiceEnginnersServicesReport();

        Integer totalAmcJobs = 0;
        Integer amcDoneCounts = 0;
        Integer amcPendingCounts = 0;

        List<ServiceEmployeeReport> serviceEmployeeReports = new ArrayList<>();
        List<AmcJob> amcJobs = amcJobRepository.findAll();

        HashMap<Integer, ServiceEmployeeReport> employeeReportMap = new HashMap<>();

        if (amcJobs != null) {
            for (AmcJob amcJob : amcJobs) {

                Integer totalServicesOfThisJob = amcJob.getNoOfServices();
                totalAmcJobs += totalServicesOfThisJob;

                Integer currentServiceDoneCounts = amcJob.getCurrentServiceNumber();
                String currentServiceLiftStatus = amcJob.getCurrentServiceStatus();

                if ("Pending".equalsIgnoreCase(currentServiceLiftStatus)) {
                    currentServiceDoneCounts--;
                }

                amcDoneCounts += currentServiceDoneCounts;

                // Assigned employee reports
                List<Employee> assignedEmployees = amcJob.getRoute().getEmployees();

                for (Employee employee : assignedEmployees) {
                    Integer empId = employee.getEmployeeId();
                    ServiceEmployeeReport serviceEmployeeReport = employeeReportMap.get(empId);

                    if (serviceEmployeeReport == null) {
                        serviceEmployeeReport = new ServiceEmployeeReport();
                        serviceEmployeeReport.setEmpName(employee.getEmployeeName());
                        serviceEmployeeReport.setAssginedServiceCounts(totalServicesOfThisJob);
                        serviceEmployeeReport.setDoneServiceCounts(currentServiceDoneCounts);
                        serviceEmployeeReport.setPendingServicesCounts(totalServicesOfThisJob - currentServiceDoneCounts);
                        employeeReportMap.put(empId, serviceEmployeeReport);
                    } else {
                        serviceEmployeeReport.setAssginedServiceCounts(serviceEmployeeReport.getAssginedServiceCounts() + totalServicesOfThisJob);
                        serviceEmployeeReport.setDoneServiceCounts(serviceEmployeeReport.getDoneServiceCounts() + currentServiceDoneCounts);
                        serviceEmployeeReport.setPendingServicesCounts(serviceEmployeeReport.getPendingServicesCounts() + (totalServicesOfThisJob - currentServiceDoneCounts));
                    }
                }
            }

            //amcPendingCounts = totalAmcJobs - amcDoneCounts;
        }
        
        List<AmcRenewalJob> amcRenewalJobs = amcRenewalJobRepository.findAll();
        
        if (amcRenewalJobs != null) {
            for (AmcRenewalJob amcJob : amcRenewalJobs) {

                Integer totalServicesOfThisJob = amcJob.getNoOfServices();
                totalAmcJobs += totalServicesOfThisJob;

                Integer currentServiceDoneCounts = amcJob.getCurrentServiceNumber();
                String currentServiceLiftStatus = amcJob.getCurrentServiceStatus();

                if ("Pending".equalsIgnoreCase(currentServiceLiftStatus)) {
                    currentServiceDoneCounts--;
                }

                amcDoneCounts += currentServiceDoneCounts;

                // Assigned employee reports
                List<Employee> assignedEmployees = amcJob.getRoute().getEmployees();

                for (Employee employee : assignedEmployees) {
                    Integer empId = employee.getEmployeeId();
                    ServiceEmployeeReport serviceEmployeeReport = employeeReportMap.get(empId);

                    if (serviceEmployeeReport == null) {
                        serviceEmployeeReport = new ServiceEmployeeReport();
                        serviceEmployeeReport.setEmpName(employee.getEmployeeName());
                        serviceEmployeeReport.setAssginedServiceCounts(totalServicesOfThisJob);
                        serviceEmployeeReport.setDoneServiceCounts(currentServiceDoneCounts);
                        serviceEmployeeReport.setPendingServicesCounts(totalServicesOfThisJob - currentServiceDoneCounts);
                        employeeReportMap.put(empId, serviceEmployeeReport);
                    } else {
                        serviceEmployeeReport.setAssginedServiceCounts(serviceEmployeeReport.getAssginedServiceCounts() + totalServicesOfThisJob);
                        serviceEmployeeReport.setDoneServiceCounts(serviceEmployeeReport.getDoneServiceCounts() + currentServiceDoneCounts);
                        serviceEmployeeReport.setPendingServicesCounts(serviceEmployeeReport.getPendingServicesCounts() + (totalServicesOfThisJob - currentServiceDoneCounts));
                    }
                }
            }

        }
        
        amcPendingCounts = totalAmcJobs - amcDoneCounts;

        
        

        // Add all employee reports to the list
        serviceEmployeeReports.addAll(employeeReportMap.values());

        report.setTotalAmcJobs(totalAmcJobs);
        report.setAmcDoneCounts(amcDoneCounts);
        report.setAmcPendingCounts(amcPendingCounts);
        report.setServiceEmployeeReports(serviceEmployeeReports);

        return report;
    }
    
    
    public Page<AmcServiceAlertData> serviceAlertDatas(
            String search,
            int page,
            int size,
            String sortBy,
            String direction) {

        // Build sorting
        Sort sort = direction.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        // ✅ Fetch only "pending" jobs directly from DB instead of filtering in memory
        Page<AmcJob> amcJobsPage = amcJobRepository.findByStatusTrue(search, pageable);

        List<AmcServiceAlertData> alertDataList = amcJobsPage.stream().map(amcJob -> {

            AmcServiceAlertData alertData = new AmcServiceAlertData();
            
            alertData.setCurrentServiceCompletedLiftCounts(amcJob.getNoOfLiftsCurrentServiceCompletedCount());         
            
            alertData.setCurrentServicePendingLiftCounts(amcJob.getNoOfElevator() - amcJob.getNoOfLiftsCurrentServiceCompletedCount()) ;           		
            		
            alertData.setCurrentServiceTotalLiftsCounts(amcJob.getNoOfElevator()) ;           
          
            Site site = amcJob.getSite();
            Customer customer = amcJob.getCustomer();

            alertData.setAmcJobid(amcJob.getJobId());
            alertData.setSite(site != null ? site.getSiteName() : "");
            
            alertData.setMonth(LocalDate.now().getMonth().name());

            
            String place = "";
            if (amcJob.getAmcQuotation() != null) {
                place = amcJob.getAmcQuotation().getLead().getArea().getAreaName();
            } else if (amcJob.getRevisedAmcQuotation() != null) {
                place = amcJob.getRevisedAmcQuotation().getLead().getArea().getAreaName();
            }
            alertData.setPlace(place);

            alertData.setCustomer(customer != null ? customer.getCustomerName() : "");
            alertData.setPreviousServicingDate(amcJob.getPreviousServicingDate());
            alertData.setRemark(amcJob.getCurrentServiceStatus());
            alertData.setService("Service " + amcJob.getCurrentServiceNumber());

            // ✅ Map Employees → EmployeeDtos
            List<EmployeeDto> employeeDtos = new ArrayList<>();
            if (amcJob.getRoute() != null && amcJob.getRoute().getEmployees() != null) {
                for (Employee employee : amcJob.getRoute().getEmployees()) {
                    EmployeeDto dto = new EmployeeDto();
                    dto.setAddress(employee.getAddress());
                    dto.setEmployeeId(employee.getEmployeeId());
                    dto.setName(employee.getEmployeeName());
                    dto.setRole(employee.getRole().getRole());
                    employeeDtos.add(dto);
                }
            }
            alertData.setAssignedServiceEmployess(employeeDtos);

            return alertData;
        }).collect(Collectors.toList());

        return new PageImpl<>(alertDataList, pageable, amcJobsPage.getTotalElements());
    }


    public AddJobDetailsData getAddJobDetailsDataForNewInstallation(SelectDetailForJob selectDetailForJob) {
        Integer quotationMainId = selectDetailForJob.getQuotationMainId();
        log.info("Quotation Main ID: " + quotationMainId); 

        if (quotationMainId != null) {
            // ✅ New Installation (Quotation Main)
            QuotationMain quotationMain = quotationMainRepository.findById(quotationMainId)
                    .orElseThrow(() -> new RuntimeException("Quotation Main not found for ID: " + quotationMainId));

            return buildAddJobDetailsDataFromNewInstallation(quotationMain);
        }

        throw new IllegalArgumentException("Quotation Main ID is null!");
    }

    private AddJobDetailsData buildAddJobDetailsDataFromNewInstallation(QuotationMain quotationMain) {
        AddJobDetailsData addJobDetailsData = new AddJobDetailsData();

        // ✅ Customer & Site
        if (quotationMain.getCustomer() != null) {
            addJobDetailsData.setCustomer(quotationMain.getCustomer().getCustomerName());
            addJobDetailsData.setCustomerId(quotationMain.getCustomer().getCustomerId());
        }
        if (quotationMain.getSite() != null) {
            addJobDetailsData.setCustomerSite(quotationMain.getSite().getSiteName());
            addJobDetailsData.setSiteId(quotationMain.getSite().getSiteId());
        }
        if (quotationMain.getLead() != null) {
            addJobDetailsData.setLeadId(quotationMain.getLead().getLeadId());
        }

        if (quotationMain.getCombinedEnquiry() != null) {
            addJobDetailsData.setCombinedEnquiryId(quotationMain.getCombinedEnquiry().getId());
        }
        // New Installation usually doesn't have "No Of Services" from existing AMC, 
        // but might get it from default or leave 0/null. 
        // Assuming 0 or getting it from somewhere else if needed.
        addJobDetailsData.setNoOfServices(0); 

        // ✅ Job Amount (Total Amount from Quotation)
        addJobDetailsData.setJobAmount(quotationMain.getTotalAmount() != null ? BigDecimal.valueOf(quotationMain.getTotalAmount()) : BigDecimal.ZERO);

        // Date ? Use quotation date or Created date? Assuming Quotation Date
        // Since Start Date is expected as LocalDate, conversion might be needed if quotationDate is LocalDateTime
        if(quotationMain.getQuotationDate() != null){
             addJobDetailsData.setStartDate(quotationMain.getQuotationDate().toLocalDate());
        }


        // ✅ Lift Data
        addJobDetailsData.setLiftDatas(buildLiftDataFromQuotationLifts(quotationMain.getLiftDetails()));

        // ✅ Routes & Employees
        addJobDetailsData.setRoutesDtos(routesService.getAllRoutes());
        addJobDetailsData.setEmployeeDtos(buildEmployeeDtos());

        return addJobDetailsData;
    }

    private List<LiftData> buildLiftDataFromQuotationLifts(List<QuotationLiftDetail> quotationLifts) {
        List<LiftData> liftDatas = new ArrayList<>();
        if (quotationLifts != null) {
            for (QuotationLiftDetail qLift : quotationLifts) {
                LiftData liftData = new LiftData();

                if (qLift.getEnquiry() != null) {
                    liftData.setEnquiryId(qLift.getEnquiry().getEnquiryId());
                }

                liftData.setLiftName(qLift.getLiftType().getName()); // Or use another name field if available? qLift.getLiftQuotationNo() seems to be the identifier here.

                // Capacity
                String capacity = null;
                if (qLift.getPersonCapacity() != null) {
                    capacity = qLift.getPersonCapacity().getDisplayName();
                } else if (qLift.getWeight() != null) {
                    capacity = qLift.getWeight().getWeightValue() + " Kg";
                }
                liftData.setCapacityValue(capacity);

                if (qLift.getFloors() != null) {
                   // liftData.setNoOfFloors(String.valueOf(qLift.getFloors())); // LiftData expects String? The previous buildLiftData uses FloorName from Enquiry.NoOfFloors (Floor object). 
                   // Here qLift.getFloors() is Integer.
                   //liftData.setNoOfFloors(String.valueOf(qLift.getFloors()));
                    liftData.setNoOfFloors(qLift.getFloorDesignations());
                }
                
                if (qLift.getTypeOfLift() != null) {
//                    liftData.setTypeOfElevators(qLift.getTypeOfLift().getLiftTypeName());

                    liftData.setTypeOfElevators(qLift.getLiftType().getName());
                }

                liftDatas.add(liftData);
            }
        }
        return liftDatas;
    }
}
