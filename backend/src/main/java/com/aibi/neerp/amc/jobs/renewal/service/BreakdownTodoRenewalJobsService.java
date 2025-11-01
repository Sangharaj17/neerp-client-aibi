package com.aibi.neerp.amc.jobs.renewal.service;


import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.context.annotation.Lazy;
import org.springframework.transaction.annotation.Transactional;

import com.aibi.neerp.amc.common.entity.JobActivityType;
import com.aibi.neerp.amc.common.repository.JobActivityTypeRepository;
import com.aibi.neerp.amc.jobs.initial.dto.BreakdownTodoRequestDto;
import com.aibi.neerp.amc.jobs.initial.dto.BreakdownTodoResponseDto;
import com.aibi.neerp.amc.jobs.initial.dto.LiftData;
import com.aibi.neerp.amc.jobs.initial.entity.AmcJob;
import com.aibi.neerp.amc.jobs.initial.entity.BreakdownTodo;
import com.aibi.neerp.amc.jobs.initial.entity.BreakdownTodoLiftMapping;
import com.aibi.neerp.amc.jobs.initial.repository.AmcJobRepository;
import com.aibi.neerp.amc.jobs.initial.repository.BreakdownTodoLiftMappingRepository;
import com.aibi.neerp.amc.jobs.initial.repository.BreakdownTodoRepository;
import com.aibi.neerp.amc.jobs.initial.service.AmcJobsService;
import com.aibi.neerp.amc.jobs.renewal.entity.AmcRenewalJob;
import com.aibi.neerp.amc.jobs.renewal.entity.AmcRenewalJobActivity;
import com.aibi.neerp.amc.jobs.renewal.repository.AmcRenewalJobActivityRepository;
import com.aibi.neerp.amc.jobs.renewal.repository.AmcRenewalJobRepository;
import com.aibi.neerp.customer.entity.Site;
import com.aibi.neerp.customer.repository.SiteRepository;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.Enquiry;
import com.aibi.neerp.leadmanagement.repository.EnquiryRepository;

@Slf4j
@Service
@Lazy
public class BreakdownTodoRenewalJobsService {

    @Autowired
    private BreakdownTodoRepository breakdownTodoRepository;

    @Autowired
    private BreakdownTodoLiftMappingRepository breakdownTodoLiftMappingRepository;

    @Autowired
    private SiteRepository siteRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AmcJobRepository amcJobRepository;

    @Autowired
    private JobActivityTypeRepository jobActivityTypeRepository;

    @Autowired
    private EnquiryRepository enquiryRepository;
    
  
    
    @Autowired
    private AmcRenewalJobRepository amcRenewalJobRepository;
    
    @Autowired 
    private AmcRenewalJobActivityRepository amcRenewalJobActivityRepository;
    
    @Autowired
    private AmcJobsService amcJobsService;
    
   
    @Transactional
    public String createBreakdownTodo(BreakdownTodoRequestDto dto) {
        log.info("Creating BreakdownTodo for siteId={}, userId={}, jobId={}",
                 dto.getUserId(), dto.getJobId());

//        Site site = siteRepository.findById(dto.getCustomerSiteId())
//                .orElseThrow(() -> new RuntimeException("Site not found"));

        Employee employee = employeeRepository.findById(dto.getUserId())
                .orElse(null);

//        AmcJob job = amcJobRepository.findById(dto.getJobId())
//                .orElseThrow(() -> new RuntimeException("AMC Job not found"));
//        
        AmcRenewalJob renewalJob = amcRenewalJobRepository.findById(dto.getRenewalJobId())
                .orElseThrow(() -> new RuntimeException("AMC Renewal Job not found"));
//      
//        
        System.out.println("callledededede");

       // JobActivityType jobActivityType = jobActivityTypeRepository.findById(dto.getJobActivityTypeId())
           //     .orElseThrow(() -> new RuntimeException("JobActivityType not found"));

        BreakdownTodo breakdownTodo = BreakdownTodo.builder()
                .customerSite(renewalJob.getSite())
                .renewalJob(renewalJob)
                .activityBy(employee)
                .purpose(dto.getPurpose())
                .todoDate(dto.getTodoDate())
                .time(dto.getTime())
                .venue(dto.getVenue())
              //  .jobActivityType(jobActivityType)
                .status(1)
                .complaintName(dto.getComplaintName())
                .complaintMob(dto.getComplaintMob())
                .build();

        BreakdownTodo saved = breakdownTodoRepository.save(breakdownTodo);
        log.info("BreakdownTodo created with id {}", saved.getCustTodoId());

        if (dto.getLiftIds() != null && !dto.getLiftIds().isEmpty()) {
            dto.getLiftIds().forEach(liftId -> {
                Enquiry enquiry = enquiryRepository.findById(liftId)
                        .orElseThrow(() -> new RuntimeException("Lift (Enquiry) not found with id " + liftId));

                BreakdownTodoLiftMapping mapping = BreakdownTodoLiftMapping.builder()
                        .breakdownTodo(saved)
                        .lift(enquiry)
                        .build();

                breakdownTodoLiftMappingRepository.save(mapping);
                log.debug("Lift mapping created for liftId {} with breakdownTodoId {}", liftId, saved.getCustTodoId());
            });
        }

        return "Breakdown Todo created successfully!";
    }
    
    @Transactional
    public List<BreakdownTodoResponseDto> getByRenewalJobId(Integer renewalJobId) {
        List<BreakdownTodo> todos = breakdownTodoRepository.findByRenewalJob_RenewalJobId(renewalJobId);

        return todos.stream()
                .filter(todo -> todo.getStatus() != null && todo.getStatus() == 1) // ✅ Only active records
                .map(todo -> BreakdownTodoResponseDto.builder()
                        .custTodoId(todo.getCustTodoId())
                        .purpose(todo.getPurpose())
                        .todoDate(todo.getTodoDate())
                        .time(todo.getTime())
                        .venue(todo.getVenue())
                        .complaintName(todo.getComplaintName())
                        .complaintMob(todo.getComplaintMob())
                        .renewal("renewal")
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public List<LiftData> getLiftDatasByBreakdownId(Integer breakdownId) {
        
    	return getUncompletedBreakDownActivityLifts(breakdownId);
    }

    @Transactional
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
	    List<AmcRenewalJobActivity> activities = amcRenewalJobActivityRepository
	            .findByBreakdownTodo_CustTodoId(breakdownTodoId);

	    HashSet<Integer> activitiesLiftIds = new HashSet<>();
	    if (activities != null) {
	        for (AmcRenewalJobActivity activity : activities) {
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




      
    
}

