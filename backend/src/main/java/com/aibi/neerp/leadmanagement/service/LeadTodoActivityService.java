package com.aibi.neerp.leadmanagement.service;

import com.aibi.neerp.common.dto.PaginatedResponse;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.leadmanagement.dto.AddLeadActivityGetData;
import com.aibi.neerp.leadmanagement.dto.LeadTodoActivityRequestDto;
import com.aibi.neerp.leadmanagement.dto.LeadTodoActivityResponseDto;
import com.aibi.neerp.leadmanagement.dto.LeadTodoAndActivityData;
import com.aibi.neerp.leadmanagement.dto.LeadTodoResponseDto;
import com.aibi.neerp.leadmanagement.dto.LeadTodoWithActivityDto;
import com.aibi.neerp.leadmanagement.entity.LeadTodo;
import com.aibi.neerp.leadmanagement.entity.LeadTodoActivity;
import com.aibi.neerp.leadmanagement.entity.NewLeads;
import com.aibi.neerp.leadmanagement.mapper.LeadTodoActivityMapper;
import com.aibi.neerp.leadmanagement.mapper.LeadTodoMapper;
import com.aibi.neerp.leadmanagement.repository.LeadTodoActivityRepository;
import com.aibi.neerp.leadmanagement.repository.LeadTodoRepository;
import com.aibi.neerp.leadmanagement.repository.NewLeadsRepository;

import com.aibi.neerp.exception.ResourceNotFoundException;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Service
public class LeadTodoActivityService {

    @Autowired
    private NewLeadsRepository newLeadsRepository;

    @Autowired
    private LeadTodoRepository leadTodoRepository;

    @Autowired
    private LeadTodoActivityRepository leadTodoActivityRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public AddLeadActivityGetData getLeadActivityData(Integer leadId, Integer todoId) {

        NewLeads lead = newLeadsRepository.findById(leadId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + leadId));

        LeadTodo todo = leadTodoRepository.findById(todoId)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + todoId));

        Employee salesEngg = todo.getActivityBy(); // Assuming lead has `Employee employee` relation

        AddLeadActivityGetData dto = new AddLeadActivityGetData();

        dto.setLeadId(lead.getLeadId());
        dto.setTodoId(todo.getTodoId());
        dto.setLeadType(lead.getLeadType());
        dto.setSalesEnggName((salesEngg != null) ? salesEngg.getEmployeeName() : null);
        dto.setLeadCompName(lead.getLeadCompanyName());
        dto.setContactName(lead.getCustomerName());
        dto.setAddress(lead.getAddress());
        dto.setEmailid(lead.getEmailId());
        dto.setContactNo(lead.getContactNo());
        dto.setSiteName(lead.getSiteName());
        dto.setSiteAddress(lead.getSiteAddress());
        dto.setLeadStage((lead.getLeadStage() != null) ? lead.getLeadStage().getStageName() : null);
        dto.setTodoName(todo.getPurpose());
        dto.setVenue(todo.getVenue());
        dto.setCustomerName(lead.getCustomerName());

        return dto;

    }

    // ✅ 1. Create Activity
    public LeadTodoActivityResponseDto create(LeadTodoActivityRequestDto dto) {
        NewLeads lead = newLeadsRepository.findById(dto.getLeadId())
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found"));

        LeadTodo todo = leadTodoRepository.findById(dto.getTodoId())
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found"));

        Employee emp = null;
        if (dto.getActivityByEmpId() == null)
            emp = todo.getActivityBy();
        else {
            emp = employeeRepository.findById(dto.getActivityByEmpId()).get();
        }

        LeadTodoActivity activity = new LeadTodoActivity();
        activity.setLead(lead);
        activity.setTodo(todo);
        activity.setActivityBy(emp);
        activity.setActivityTitle(todo.getPurpose());
        activity.setFeedback(dto.getFeedback());
        activity.setActivityDate(dto.getActivityDate());
        activity.setActivityTime(dto.getActivityTime());

        LeadTodoActivity saved = leadTodoActivityRepository.save(activity);

        LeadTodoActivityResponseDto res = new LeadTodoActivityResponseDto();
        res.setActivityId(saved.getActivityId());
        res.setLeadId(saved.getLead().getLeadId());
        res.setTodoId(saved.getTodo().getTodoId());
        res.setActivityByEmpName(saved.getActivityBy().getEmployeeName());
        res.setActivityTitle(saved.getActivityTitle());
        res.setFeedback(saved.getFeedback());
        res.setActivityDate(saved.getActivityDate());
        res.setActivityTime(saved.getActivityTime());

        return res;
    }

    public PaginatedResponse<LeadTodoAndActivityData> getActivityListData(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("todoDate").descending());
        Page<LeadTodo> todoPage = leadTodoRepository.getActivityListsearchByKeyword(keyword.toLowerCase(), pageable);

        Map<Integer, LeadTodoAndActivityData> groupedMap = new LinkedHashMap<>();

        for (LeadTodo leadTodo : todoPage.getContent()) {
            NewLeads lead = leadTodo.getLead();
            Integer leadId = lead.getLeadId();

            LeadTodoAndActivityData dto = groupedMap.computeIfAbsent(leadId, id -> {
                LeadTodoAndActivityData newDto = new LeadTodoAndActivityData();
                newDto.setLeadCompanyName(lead.getLeadCompanyName());
                newDto.setCustomerName(lead.getCustomerName());
                newDto.setEmailId(lead.getEmailId());
                newDto.setContactNo(lead.getContactNo());
                newDto.setAddress(lead.getAddress());
                newDto.setSiteName(lead.getSiteName());
                newDto.setSiteAddress(lead.getSiteAddress());
                newDto.setLeadTodoWithActivities(new ArrayList<>());
                return newDto;
            });

            LeadTodoWithActivityDto todoWithActivity = new LeadTodoWithActivityDto();
            todoWithActivity.setLeadTodo(LeadTodoMapper.toDto(leadTodo));

            if (leadTodo.getActivity() != null && !leadTodo.getActivity().isEmpty()) {
                todoWithActivity.setLeadTodoActivity(LeadTodoActivityMapper.toDto(leadTodo.getActivity()));
            }

            dto.getLeadTodoWithActivities().add(todoWithActivity);
        }

        List<LeadTodoAndActivityData> dataList = new ArrayList<>(groupedMap.values());

        return new PaginatedResponse<>(
                dataList,
                page,
                size,
                todoPage.getTotalPages(),
                todoPage.getTotalElements(),
                todoPage.isFirst(),
                todoPage.isLast());
    }

    public List<LeadTodoActivityResponseDto> getAllActivityListData(Integer leadId) {
        // Fetch all LeadTodoActivity entities for the given lead ID
        List<LeadTodoActivity> activities = leadTodoActivityRepository.findByLead_LeadId(leadId);

        // Map each entity to the response DTO
        return activities.stream().map(saved -> {
            LeadTodoActivityResponseDto res = new LeadTodoActivityResponseDto();
            res.setActivityId(saved.getActivityId());
            res.setLeadId(saved.getLead().getLeadId());
            res.setTodoId(saved.getTodo().getTodoId());
            res.setActivityByEmpName(saved.getActivityBy().getEmployeeName());
            res.setActivityTitle(saved.getActivityTitle());
            res.setFeedback(saved.getFeedback());
            res.setActivityDate(saved.getActivityDate());
            res.setActivityTime(saved.getActivityTime());
            return res;
        }).collect(Collectors.toList());
    }

}
