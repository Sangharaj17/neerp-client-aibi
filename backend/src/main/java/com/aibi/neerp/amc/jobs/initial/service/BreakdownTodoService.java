package com.aibi.neerp.amc.jobs.initial.service;

import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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
import com.aibi.neerp.customer.entity.Site;
import com.aibi.neerp.customer.repository.SiteRepository;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.Enquiry;
import com.aibi.neerp.leadmanagement.repository.EnquiryRepository;

@Slf4j
@Service
public class BreakdownTodoService {

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
    
    @Autowired AmcJobsService amcJobsService;
    
    @Autowired AmcJobActivityService amcJobActivityService;
    
   

    public String createBreakdownTodo(BreakdownTodoRequestDto dto) {
        log.info("Creating BreakdownTodo for siteId={}, userId={}, jobId={}",
                 dto.getUserId(), dto.getJobId());

//        Site site = siteRepository.findById(dto.getCustomerSiteId())
//                .orElseThrow(() -> new RuntimeException("Site not found"));

        Employee employee = employeeRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        AmcJob job = amcJobRepository.findById(dto.getJobId())
                .orElseThrow(() -> new RuntimeException("AMC Job not found"));
        
        System.out.println("callledededede");

       // JobActivityType jobActivityType = jobActivityTypeRepository.findById(dto.getJobActivityTypeId())
           //     .orElseThrow(() -> new RuntimeException("JobActivityType not found"));

        BreakdownTodo breakdownTodo = BreakdownTodo.builder()
                .customerSite(job.getSite())
                .activityBy(employee)
                .job(job)
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

    public String updateBreakdownTodo(Integer custTodoId, BreakdownTodoRequestDto dto) {
//        BreakdownTodo existing = breakdownTodoRepository.findById(custTodoId)
//                .orElseThrow(() -> new RuntimeException("BreakdownTodo not found"));
//
//        log.info("Updating BreakdownTodo with id {}", custTodoId);
//
//        existing.setPurpose(dto.getPurpose());
//        existing.setTodoDate(dto.getTodoDate());
//        existing.setTime(dto.getTime());
//        existing.setVenue(dto.getVenue());
//        existing.setStatus(dto.getStatus());
//        existing.setComplaintName(dto.getComplaintName());
//        existing.setCompalintMob(dto.getCompalintMob());
//
//        if (dto.getCustomerSiteId() != null) {
//            existing.setSite(siteRepository.findById(dto.getCustomerSiteId())
//                    .orElseThrow(() -> new RuntimeException("Site not found")));
//        }
//
//        if (dto.getUserId() != null) {
//            existing.setActivityBy(employeeRepository.findById(dto.getUserId())
//                    .orElseThrow(() -> new RuntimeException("Employee not found")));
//        }
//
//        if (dto.getJobId() != null) {
//            existing.setAmcJob(amcJobRepository.findById(dto.getJobId())
//                    .orElseThrow(() -> new RuntimeException("AMC Job not found")));
//        }
//
//        if (dto.getJobActivityTypeId() != null) {
//            existing.setJobActivityType(jobActivityTypeRepository.findById(dto.getJobActivityTypeId())
//                    .orElseThrow(() -> new RuntimeException("JobActivityType not found")));
//        }
//
//        breakdownTodoRepository.save(existing);
//
//        if (dto.getLiftIds() != null) {
//            breakdownTodoLiftMappingRepository.deleteByBreakdownTodo(existing);
//            dto.getLiftIds().forEach(liftId -> {
//                Enquiry enquiry = enquiryRepository.findById(liftId)
//                        .orElseThrow(() -> new RuntimeException("Lift (Enquiry) not found with id " + liftId));
//
//                BreakdownTodoLiftMapping mapping = BreakdownTodoLiftMapping.builder()
//                        .breakdownTodo(existing)
//                        .enquiry(enquiry)
//                        .build();
//
//                breakdownTodoLiftMappingRepository.save(mapping);
//            });
//            log.debug("Lift mappings updated for breakdownTodoId {}", custTodoId);
//        }

        return "Breakdown Todo updated successfully!";
    }

    public String deleteBreakdownTodo(Integer custTodoId) {
        BreakdownTodo existing = breakdownTodoRepository.findById(custTodoId)
                .orElseThrow(() -> new RuntimeException("BreakdownTodo not found"));

        breakdownTodoLiftMappingRepository.deleteByBreakdownTodo(existing);
        breakdownTodoRepository.delete(existing);

        log.info("BreakdownTodo deleted with id {}", custTodoId);
        return "Breakdown Todo deleted successfully!";
    }
    
    public List<BreakdownTodoResponseDto> getByJobId(Integer jobId) {
        List<BreakdownTodo> todos = breakdownTodoRepository.findByJob_JobId(jobId);

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
                        .build())
                .collect(Collectors.toList());
    }

    
    public List<LiftData> getLiftDatasByBreakdownId(Integer breakdownId) {
      
    	return amcJobActivityService.getUncompletedBreakDownActivityLifts(breakdownId);
    }
    
    public Page<BreakdownTodoResponseDto> getUpcomingBreakdownTodos(String search, Pageable pageable) {
        LocalDate today = LocalDate.now();
        return breakdownTodoRepository.searchUpcomingBreakdownTodos(search, today, pageable)
                .map(this::mapToDto);
    }

    public Page<BreakdownTodoResponseDto> getMissedBreakdownTodos(String search, Pageable pageable) {
        LocalDate today = LocalDate.now();
        return breakdownTodoRepository.searchMissedBreakdownTodos(search, today, pageable)
                .map(this::mapToDto);
    }

    private BreakdownTodoResponseDto mapToDto(BreakdownTodo b) {
        if (b == null) return null;

        // Safely extract values
        Integer todoId = b.getCustTodoId();
        String purpose = (b.getPurpose() != null) ? b.getPurpose() : "";
        LocalDate todoDate = b.getTodoDate();
        LocalTime time = (b.getTime() != null) ? b.getTime() : null;
        String venue = (b.getVenue() != null) ? b.getVenue() : "";
        String complaintName = (b.getComplaintName() != null) ? b.getComplaintName() : "";
        String complaintMob = (b.getComplaintMob() != null) ? b.getComplaintMob() : "";

        String siteName = (b.getCustomerSite() != null) ? b.getCustomerSite().getSiteName() : "";
        String siteAddress = (b.getCustomerSite() != null) ? b.getCustomerSite().getSiteAddress() : "";

        String description = String.format("%s for %s at %s" ,
                purpose, siteName ,siteAddress);

        return BreakdownTodoResponseDto.builder()
                .custTodoId(todoId)
                .purpose(purpose)
                .todoDate(todoDate)
                .time(time)
                .venue(venue)
                .complaintName(complaintName)
                .complaintMob(complaintMob)
                .description(description)
                .build();
    }

   
    
    
}

