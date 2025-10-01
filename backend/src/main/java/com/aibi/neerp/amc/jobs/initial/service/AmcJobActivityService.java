package com.aibi.neerp.amc.jobs.initial.service;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aibi.neerp.amc.common.entity.JobActivityType;
import com.aibi.neerp.amc.common.repository.JobActivityTypeRepository;
import com.aibi.neerp.amc.jobs.initial.dto.AddServiceActivityGetData;
import com.aibi.neerp.amc.jobs.initial.dto.AmcJobActivityRequestDto;
import com.aibi.neerp.amc.jobs.initial.dto.EmployeeDto;
import com.aibi.neerp.amc.jobs.initial.dto.JobActivityResponseDto;
import com.aibi.neerp.amc.jobs.initial.dto.JobDetailPageResponseDto;
import com.aibi.neerp.amc.jobs.initial.dto.JobDetailResponseDto;
import com.aibi.neerp.amc.jobs.initial.dto.LiftData;
import com.aibi.neerp.amc.jobs.initial.entity.AmcJob;
import com.aibi.neerp.amc.jobs.initial.entity.AmcJobActivity;
import com.aibi.neerp.amc.jobs.initial.entity.BreakdownTodo;
import com.aibi.neerp.amc.jobs.initial.entity.BreakdownTodoLiftMapping;
import com.aibi.neerp.amc.jobs.initial.repository.AmcJobActivityRepository;
import com.aibi.neerp.amc.jobs.initial.repository.AmcJobRepository;
import com.aibi.neerp.amc.jobs.initial.repository.BreakdownTodoRepository;
import com.aibi.neerp.amc.quatation.initial.entity.AmcQuotation;
import com.aibi.neerp.amc.quatation.initial.entity.RevisedAmcQuotation;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.Enquiry;
import com.aibi.neerp.leadmanagement.repository.EnquiryRepository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AmcJobActivityService {

	@Autowired private  AmcJobActivityRepository amcJobActivityRepository;
	@Autowired private  AmcJobRepository amcJobRepository;
	@Autowired private  JobActivityTypeRepository jobActivityTypeRepository;
	@Autowired private  EmployeeRepository employeeRepository;
	@Autowired private  EnquiryRepository liftRepository;
	@Autowired private  BreakdownTodoRepository breakdownTodoRepository;
	
	@Autowired private  AmcJobsService amcJobsService;
	

	@Transactional
	public void addJobActivity(AmcJobActivityRequestDto dto) {

	    AmcJob job = amcJobRepository.findById(dto.getJobId())
	            .orElseThrow(() -> new RuntimeException("Job not found with id " + dto.getJobId()));

	    JobActivityType jobActivityType = jobActivityTypeRepository.findById(dto.getJobActivityTypeId())
	            .orElseThrow(() -> new RuntimeException("JobActivityType not found with id " + dto.getJobActivityTypeId()));

	    Employee employee = employeeRepository.findById(dto.getJobActivityById())
	            .orElseThrow(() -> new RuntimeException("Employee not found with id " + dto.getJobActivityById()));
	    
	    Employee executive = employeeRepository.findById(dto.getExecutiveId())
	            .orElseThrow(() -> new RuntimeException("Employee not found with id " + dto.getExecutiveId()));

	    BreakdownTodo breakdownTodo = null;
	    if (dto.getBreakdownTodoId() != null) {
	        breakdownTodo = breakdownTodoRepository.findById(dto.getBreakdownTodoId())
	                .orElseThrow(() -> new RuntimeException("BreakdownTodo not found with id " + dto.getBreakdownTodoId()));
	   
	    }
	    
	    

	    for (Integer liftId : dto.getLiftIds()) {
	        Enquiry lift = liftRepository.findById(liftId)
	                .orElseThrow(() -> new RuntimeException("Lift not found with id " + liftId));

	        AmcJobActivity activity = AmcJobActivity.builder()
	                .job(job)
	                .jobActivityType(jobActivityType)
	                .activityDate(dto.getActivityDate())
	                .activityTime(dto.getActivityTime())
	                .activityDescription(dto.getActivityDescription())
	                .jobService(dto.getJobService())
	                .jobTypeWork(dto.getJobTypeWork())
	                .executive(executive)
	                .jobActivityBy(employee)
	                .jobActivityBy2(dto.getJobActivityBy2())
	                .mailSent(dto.getMailSent())
	                .remark(dto.getRemark())
	                .signatureName(dto.getSignatureName())
	                .signatureValue(dto.getSignatureValue())
	                .customerFeedback(dto.getCustomerFeedback())
	                .inTime(dto.getInTime())
	                .outTime(dto.getOutTime())
	                .actService(dto.getActService())
	                .lift(lift)
	                .breakdownTodo(breakdownTodo)
	                .build();

	        amcJobActivityRepository.save(activity);
	    }
	    
	    if(jobActivityType.getActivityName().equalsIgnoreCase("service")){
	    	updateAmcJobAfterAddingActivity(dto.getJobId() , job ,  dto.getLiftIds() , dto.getActivityDate());
	    }
	    
	    if (dto.getBreakdownTodoId() != null) {
	    	updateBreakdownTodoStatus(dto.getBreakdownTodoId());
	    }
	}
	
	public void updateAmcJobAfterAddingActivity(Integer jobId , AmcJob amcJob , List<Integer> liftIds , LocalDate date) {
		
		Integer count = amcJob.getNoOfLiftsCurrentServiceCompletedCount();
		int newLiftsDoneServicesCount = liftIds.size();
		count+=newLiftsDoneServicesCount;
		
		amcJob.setNoOfLiftsCurrentServiceCompletedCount(count);
		
		amcJob.setLastActivityDate(date);
		
		int needToCompleteServiceLifts = amcJob.getNoOfLifsServiceNeedToCompleteCount();
		
		if(needToCompleteServiceLifts == count) {
			int pendingServicesCount = amcJob.getPendingServiceCount();
            pendingServicesCount--;
            
            amcJob.setPendingServiceCount(pendingServicesCount);
            
		}

		
		amcJobRepository.save(amcJob);
	}
	
	public void updateBreakdownTodoStatus(Integer brekdownTodoId) {
		
		BreakdownTodo breakdownTodo = breakdownTodoRepository.findById(brekdownTodoId)
	                .orElseThrow(() -> new RuntimeException("BreakdownTodo not found with id " + brekdownTodoId));
		
		List<BreakdownTodoLiftMapping> assignedLiftsToBrekDownTodo = breakdownTodo.getLifts();
		
		List<Enquiry> assignedlifts = new ArrayList<Enquiry>();
		
		if(assignedLiftsToBrekDownTodo!=null) {
			
			for(BreakdownTodoLiftMapping breakdownTodoLiftMapping : assignedLiftsToBrekDownTodo) {
				assignedlifts.add(breakdownTodoLiftMapping.getLift());
			}
		}
		
		List<AmcJobActivity> activities = amcJobActivityRepository.findByBreakdownTodo_CustTodoId(brekdownTodoId);
		
		int liftsActivityCompletedCounts = 0;
		int assignedLiftsCounts = assignedlifts.size();
		
		HashSet<Integer> activitiesLiftsIdsInHash = new HashSet<>();
		
		for(AmcJobActivity activity : activities) {
			
			activitiesLiftsIdsInHash.add(activity.getLift().getEnquiryId());
	    }
		
		for(Enquiry enquiry : assignedlifts) {
			
			if(activitiesLiftsIdsInHash.contains(enquiry.getEnquiryId())){
				liftsActivityCompletedCounts++;
			}
		}
		
		if(liftsActivityCompletedCounts == assignedLiftsCounts) {
			breakdownTodo.setStatus(0);
			
			breakdownTodoRepository.save(breakdownTodo);
		}
	   
	}
	
	public List<LiftData> getUncompletedBreakDownActivityLifts(Integer breakdownTodoId) {

	    if (breakdownTodoId == null) {
	        throw new IllegalArgumentException("breakdownTodoId cannot be null");
	    }

	    // Fetch BreakdownTodo safely
	    BreakdownTodo breakdownTodo = breakdownTodoRepository.findById(breakdownTodoId)
	            .orElseThrow(() -> new RuntimeException("BreakdownTodo not found with id " + breakdownTodoId));

	    // Get assigned lifts safely
	    List<BreakdownTodoLiftMapping> assignedLiftsToBreakdownTodo =
	            breakdownTodo.getLifts() != null ? breakdownTodo.getLifts() : Collections.emptyList();

	    List<Enquiry> assignedLifts = new ArrayList<>();
	    for (BreakdownTodoLiftMapping mapping : assignedLiftsToBreakdownTodo) {
	        if (mapping != null && mapping.getLift() != null) {
	            assignedLifts.add(mapping.getLift());
	        }
	    }

	    // Fetch activities safely
	    List<AmcJobActivity> activities = amcJobActivityRepository
	            .findByBreakdownTodo_CustTodoId(breakdownTodoId);

	    HashSet<Integer> activitiesLiftIds = new HashSet<>();
	    if (activities != null) {
	        for (AmcJobActivity activity : activities) {
	            if (activity != null && activity.getLift() != null) {
	                activitiesLiftIds.add(activity.getLift().getEnquiryId());
	            }
	        }
	    }

	    CombinedEnquiry combinedEnquiry = new CombinedEnquiry();

	    for (Enquiry enquiry : assignedLifts) {
	        if (enquiry != null) {
	            if (combinedEnquiry.getEnquiries() == null) {
	                combinedEnquiry.setEnquiries(new ArrayList<>()); // ✅ initialize if null
	            }
	            if (!activitiesLiftIds.contains(enquiry.getEnquiryId())) {
	                combinedEnquiry.getEnquiries().add(enquiry);
	            }
	        }
	    }


	    // Defensive check before calling service
	    return amcJobsService != null
	            ? amcJobsService.buildLiftData(combinedEnquiry)
	            : Collections.emptyList();
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


    
    
    public AddServiceActivityGetData getAddServiceActivityGetData(Integer jobId) {

        AmcJob amcJob = amcJobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("AmcJob not found with id: " + jobId));

        String serviceName = "Service " + amcJob.getCurrentServiceNumber();

        // Get CombinedEnquiry (from AmcQuotation or RevisedAmcQuotation)
        CombinedEnquiry combinedEnquiry = Optional.ofNullable(amcJob.getAmcQuotation())
                .map(AmcQuotation::getCombinedEnquiry)
                .orElseGet(() -> Optional.ofNullable(amcJob.getRevisedAmcQuotation())
                        .map(RevisedAmcQuotation::getCombinedEnquiry)
                        .orElseThrow(() -> new RuntimeException("CombinedEnquiry not found for jobId: " + jobId)));

        List<Enquiry> allServiceLifts = combinedEnquiry.getEnquiries();
        if (allServiceLifts == null) allServiceLifts = new ArrayList<>();

        // Get completed lifts
        Set<Integer> completedLiftIds = amcJobActivityRepository.findByJob_JobId(jobId).stream()
                .filter(a -> "Service".equalsIgnoreCase(a.getJobActivityType().getActivityName()) &&
                             serviceName.equalsIgnoreCase(a.getJobService()))
                .map(a -> a.getLift().getEnquiryId())
                .collect(Collectors.toSet());

        // Filter remaining lifts
        List<Enquiry> pendingLifts = allServiceLifts.stream()
                .filter(e -> !completedLiftIds.contains(e.getEnquiryId()))
                .toList();

        CombinedEnquiry pendingCombined = new CombinedEnquiry();
        pendingCombined.setEnquiries(pendingLifts);

        List<LiftData> serviceLiftDatas = amcJobsService.buildLiftData(pendingCombined);

        return AddServiceActivityGetData.builder()
                .serviceName(serviceName)
                .serviceLifsDatas(serviceLiftDatas)
                .build();
    }

	
	
    public JobDetailPageResponseDto getJobDetailPage(Integer jobId) {
        AmcJob job = amcJobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("AmcJob not found with id " + jobId));

        JobDetailResponseDto jobDetailDto = new JobDetailResponseDto();

        // Safely map job details
        jobDetailDto.setJobNo(job.getJobNo());
        jobDetailDto.setCustomerName(job.getCustomer() != null ? job.getCustomer().getCustomerName() : null);
        jobDetailDto.setSiteName(job.getSite() != null ? job.getSite().getSiteName() : null);
        jobDetailDto.setOrderDate(job.getStartDate());

        jobDetailDto.setNumberOfLift(job.getNoOfElevator());
        jobDetailDto.setJobLiftDetail(job.getJobLiftDetail());

        jobDetailDto.setSalesExecutive(job.getSalesExecutive() != null ? job.getSalesExecutive().getEmployeeName() : null);
        jobDetailDto.setServiceEngineer(job.getServiceEngineer() != null ? job.getServiceEngineer().getEmployeeName() : null);

        jobDetailDto.setJobStatus(job.getJobStatus());
        jobDetailDto.setTotalService(job.getNoOfServices() != null ? job.getNoOfServices() + " Service" : null);
        jobDetailDto.setJobType(job.getJobType());

        jobDetailDto.setSiteAddress(job.getSite() != null ? job.getSite().getSiteAddress() : null);
        jobDetailDto.setStartDate(job.getStartDate() != null ? job.getStartDate() : null);
        jobDetailDto.setEndDate(job.getEndDate() != null ? job.getEndDate() : null);

        jobDetailDto.setJobAmount(job.getJobAmount() != null ? job.getJobAmount().toString() : null);
        jobDetailDto.setReceivedAmount(job.getReceivedAmount() != null ? job.getReceivedAmount().toString() : null);
        jobDetailDto.setBalanceAmount(job.getBalanceAmount() != null ? job.getBalanceAmount().toString() : null);

        jobDetailDto.setPendingService(job.getPendingServiceCount() != null ? job.getPendingServiceCount().toString() : null);

        // Map job activities
        List<AmcJobActivity> activities = amcJobActivityRepository.findByJobJobId(jobId);

        List<JobActivityResponseDto> activityDtos = activities.stream()
                .map(act -> {
                    String activityName = act.getJobActivityType() != null 
                            ? act.getJobActivityType().getActivityName() 
                            : null;

                    String serviceOrWorkType = null;
                    if (activityName != null && activityName.equalsIgnoreCase("service")) {
                        serviceOrWorkType = act.getJobService() != null ? act.getJobService() : null;
                    } else {
                        serviceOrWorkType = act.getJobTypeWork() != null ? act.getJobTypeWork() : null;
                    }
                    
                    System.out.println(act.getLift().getLiftName()+" liftnameis");

                    return new JobActivityResponseDto(
                    	    act.getJobActivityId(),
                    	    act.getActivityDate() != null ? act.getActivityDate().toString() : null,
                    	    act.getJobActivityBy() != null ? act.getJobActivityBy().getEmployeeName() : null,
                    	    activityName,
                    	    serviceOrWorkType,
                    	    act.getActivityDescription(),
                    	    act.getRemark(),
                    	    "",
                    	    act.getLift() != null ? act.getLift().getLiftName() : null
                    	);


                })
                .collect(Collectors.toList());
        
        List<LiftData> liftDatas = null;
        
        CombinedEnquiry combinedEnquiry = null;
        
        if(job.getAmcQuotation()!=null) {
        	combinedEnquiry = job.getAmcQuotation().getCombinedEnquiry();
        }else {
        	combinedEnquiry = job.getRevisedAmcQuotation().getCombinedEnquiry();
        }
        
        if(combinedEnquiry!=null) {
        	
        	liftDatas = amcJobsService.buildLiftData(combinedEnquiry);
        }
        
        List<EmployeeDto> employeeDtos = new ArrayList<EmployeeDto>();
        
        List<Employee> employees = job.getRoute().getEmployees();
        
        if(employees!=null) {
        	for(Employee employee : employees) {
        		EmployeeDto employeeDto = new EmployeeDto();
        		employeeDto.setAddress(employee.getAddress());
        		employeeDto.setEmployeeId(employee.getEmployeeId());
        		employeeDto.setName(employee.getEmployeeName());
        		employeeDto.setRole(employee.getRole().getRole());  
        		
        		employeeDtos.add(employeeDto);   
        	}
        }


        return new JobDetailPageResponseDto(jobDetailDto, activityDtos , liftDatas , employeeDtos);
    }

	
		
	
}

