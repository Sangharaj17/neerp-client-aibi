package com.aibi.neerp.amc.jobs.initial.service;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aibi.neerp.amc.common.entity.JobActivityType;
import com.aibi.neerp.amc.common.repository.JobActivityTypeRepository;
import com.aibi.neerp.amc.jobs.initial.dto.AddServiceActivityGetData;
import com.aibi.neerp.amc.jobs.initial.dto.AmcJobActivityRequestDto;
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
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;

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
	    
	    if (dto.getBreakdownTodoId() != null) {
	    	updateBreakdownTodoStatus(dto.getBreakdownTodoId());
	    }
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

	
	
	
	
    public String getStatusOfCurrentService(Integer jobid) {
		
		AmcJob amcJob= amcJobRepository.findById(jobid).get();
		
		Integer NoOfLiftsCurrentServiceCompletedCount=  amcJob.getNoOfLiftsCurrentServiceCompletedCount();
		Integer NoOfLifsServiceNeedToCompleteCount =  amcJob.getNoOfLifsServiceNeedToCompleteCount();
		
		String CurrentServiceStatus = amcJob.getCurrentServiceStatus();
		
		Integer currentServiceNumber = amcJob.getCurrentServiceNumber();
		
		if(NoOfLiftsCurrentServiceCompletedCount>0 && NoOfLifsServiceNeedToCompleteCount>0 ) {
			
			if(NoOfLiftsCurrentServiceCompletedCount == NoOfLifsServiceNeedToCompleteCount) {
				
				String lastActivityDate = amcJob.getLastActivityDate();
				LocalDate currentDate = LocalDate.now();
				
				String lastActivityDateMonth = "";
				String currnetDateMonth = "";
				
				if(lastActivityDateMonth.equalsIgnoreCase(currnetDateMonth)){
					CurrentServiceStatus = "Completed";
					amcJob.setCurrentServiceStatus(CurrentServiceStatus);
					
					amcJobRepository.save(amcJob);
				}else {
					CurrentServiceStatus = "Pending";
					NoOfLiftsCurrentServiceCompletedCount = 0;
					currentServiceNumber++;
					
					amcJob.setCurrentServiceNumber(currentServiceNumber);
					amcJob.setNoOfLiftsCurrentServiceCompletedCount(NoOfLiftsCurrentServiceCompletedCount);
					amcJob.setCurrentServiceStatus(CurrentServiceStatus);
					
					amcJobRepository.save(amcJob);
				}
				
			}else {
				CurrentServiceStatus = "Pending";
				amcJob.setCurrentServiceStatus(CurrentServiceStatus);
				
				amcJobRepository.save(amcJob);
			}
		}
		
		return CurrentServiceStatus;
		
	}
    
    
	public AddServiceActivityGetData getAddServiceActivityGetData(Integer jobId) {
		
//		AddServiceActivityGetData serviceActivityGetData = new AddServiceActivityGetData();
//		
//		AmcJob amcJob = amcJobRepository.findById(jobId).get();
//		
//		String serviceName = "";
//		List<LiftData> serviceLiftDatas = null;
//		
//		
//		serviceName = "Service "+amcJob.getCurrentServiceNumber();
//		
//		AmcQuotation amcQuotation = amcJob.getAmcQuotation();
//		RevisedAmcQuotation revisedAmcQuotation = amcJob.getRevisedAmcQuotation();
//		
//		CombinedEnquiry combinedEnquiry = null;
//		
//		if(amcQuotation!=null) {
//			combinedEnquiry = amcQuotation.getCombinedEnquiry();
//	    }
//		
//		if(revisedAmcQuotation!=null) {
//			combinedEnquiry = revisedAmcQuotation.getCombinedEnquiry();
//		}
//		
//		List<Enquiry> allServiceLifts = combinedEnquiry.getEnquiries();
//		
//		List<Enquiry> completedServiceLifts = new ArrayList<Enquiry>();
//		
//		List<AmcJobActivity> jobActivities = amcJobActivityRepository.findByJob_JobId(jobId);
//		
//		jobActivities = jobActivities.stream().filter((activity)->{
//			JobActivityType jobActivityType = activity.getJobActivityType();
//			if(jobActivityType.getActivityName().equalsIgnoreCase("Service") && 
//					activity.getJobService().equalsIgnoreCase(serviceName))
//				return true;
//			
//		}).collect().toList();	
//		
//		HashSet<Integer> completedLiftServicesInHash = new HashSet<>();
//		
//		for(AmcJobActivity amcJobActivity : jobActivities) {
//			completedServiceLifts.add(amcJobActivity.getLift());
//			completedLiftServicesInHash.add(amcJobActivity.getLift().getEnquiryId());
//		}
//		
//		CombinedEnquiry combinedEnquiry2 = new CombinedEnquiry();
//		
//		List<Enquiry> enquiries = new ArrayList<Enquiry>();
//		
//		for(Enquiry enquiry : allServiceLifts) {
//			
//			if(!completedLiftServicesInHash.contains(enquiry.getEnquiryId()){
//				enquiries.add(enquiry);)
//			}
//		}
//		
//		
//		serviceActivityGetData.setServiceName(serviceName);
//		serviceActivityGetData.setServiceLifsDatas(serviceLiftDatas);
//		
//		
//		return serviceActivityGetData;
		
		return null;
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}

