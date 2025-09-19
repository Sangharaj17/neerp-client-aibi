package com.aibi.neerp.leadmanagement.service;

import com.aibi.neerp.leadmanagement.dto.LeadTodoRequestDto;
import com.aibi.neerp.leadmanagement.dto.LeadTodoResponseDto;
import com.aibi.neerp.leadmanagement.entity.LeadTodo;
import com.aibi.neerp.leadmanagement.entity.NewLeads;
import com.aibi.neerp.leadmanagement.repository.LeadTodoRepository;
import com.aibi.neerp.leadmanagement.repository.NewLeadsRepository;
import com.aibi.neerp.common.dto.PaginatedResponse;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.exception.ResourceInUseException;
import com.aibi.neerp.exception.ResourceNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Service
public class LeadTodoService {

    @Autowired
    private LeadTodoRepository leadTodoRepository;

    @Autowired
    private NewLeadsRepository newLeadsRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public LeadTodoResponseDto create(LeadTodoRequestDto dto) {
        LeadTodo todo = toEntity(dto);
        return toDto(leadTodoRepository.save(todo));
    }

//    public List<LeadTodoResponseDto> getAll() {
//        return leadTodoRepository.findAll()
//                .stream()
//                .map(this::toDto)
//                .collect(Collectors.toList());
//    }
    
	    public PaginatedResponse<LeadTodoResponseDto> getAll(String search, int page, int size) {
	        Pageable pageable = PageRequest.of(page, size);
	        Page<LeadTodo> todoPage;
	
	        if (search != null && !search.trim().isEmpty()) {
	            todoPage = leadTodoRepository.searchByKeyword(search.toLowerCase(), pageable);
	        } else {
	            todoPage = leadTodoRepository.findAll(pageable);
	        }
	
	        List<LeadTodoResponseDto> data = todoPage.getContent().stream()
	                .map(this::toDto)
	                .toList();
	
	        return new PaginatedResponse<>(
	                data,
	                page,
	                size,
	                todoPage.getTotalPages(),
	                todoPage.getTotalElements(),
	                todoPage.isFirst(),
	                todoPage.isLast()
	        );
	    }
	
	    // toDto(...) and create(...) methods go here
	

    public LeadTodoResponseDto getById(Integer id) {
        LeadTodo todo = leadTodoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
        return toDto(todo);
    }

    public LeadTodoResponseDto update(Integer id, LeadTodoRequestDto dto) {
        LeadTodo existing = leadTodoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));

        // Update fields
        NewLeads lead = newLeadsRepository.findById(dto.getLeadId())
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found"));
        Employee emp = employeeRepository.findById(dto.getActivityByEmpId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        existing.setLead(lead);
        existing.setActivityBy(emp);
        existing.setPurpose(dto.getPurpose());
        existing.setTodoDate(dto.getTodoDate());
        existing.setTime(dto.getTime());
        existing.setVenue(dto.getVenue());

        return toDto(leadTodoRepository.save(existing));
    }

    public void deleteTodo(Integer id) {
        if (!leadTodoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Lead Todo not found with id: " + id);
        }

        try {
            leadTodoRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new ResourceInUseException("Cannot delete Lead Todo as it's referenced by other records.");
        }
    }


    private LeadTodo toEntity(LeadTodoRequestDto dto) {
        NewLeads lead = newLeadsRepository.findById(dto.getLeadId())
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found"));

        Employee emp = employeeRepository.findById(dto.getActivityByEmpId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        LeadTodo todo = new LeadTodo();
        todo.setLead(lead);
        todo.setActivityBy(emp);
        todo.setPurpose(dto.getPurpose());
        todo.setTodoDate(dto.getTodoDate());
        todo.setTime(dto.getTime());
        todo.setVenue(dto.getVenue());

        return todo;
    }

    private LeadTodoResponseDto toDto(LeadTodo todo) {
        LeadTodoResponseDto dto = new LeadTodoResponseDto();
        dto.setTodoId(todo.getTodoId());
        dto.setLeadId(todo.getLead().getLeadId());
        dto.setLeadCompanyName(todo.getLead().getLeadCompanyName());
        dto.setCustomerName(todo.getLead().getCustomerName());
        dto.setActivityByEmpName(todo.getActivityBy().getEmployeeName());
        dto.setPurpose(todo.getPurpose());
        dto.setTodoDate(todo.getTodoDate());
        dto.setTime(todo.getTime());
        dto.setVenue(todo.getVenue());
        return dto;
    }

    public List<LeadTodoResponseDto> getAllByLeadId(Integer leadId) {
        List<LeadTodo> todos = leadTodoRepository.findByLead_LeadId(leadId);

        return todos.stream()
                .map(this::toDto)
                .toList();
    }


}
