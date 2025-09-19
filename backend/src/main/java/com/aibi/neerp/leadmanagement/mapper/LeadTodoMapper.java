package com.aibi.neerp.leadmanagement.mapper;

import com.aibi.neerp.leadmanagement.dto.LeadTodoResponseDto;
import com.aibi.neerp.leadmanagement.entity.LeadTodo;

public class LeadTodoMapper {

    public static LeadTodoResponseDto toDto(LeadTodo todo) {
        LeadTodoResponseDto dto = new LeadTodoResponseDto();
        dto.setTodoId(todo.getTodoId());
        dto.setLeadId(todo.getLead().getLeadId());
        dto.setLeadCompanyName(todo.getLead().getLeadCompanyName());
        dto.setCustomerName(todo.getLead().getCustomerName());
        dto.setActivityByEmpName(todo.getActivityBy() != null ? todo.getActivityBy().getEmployeeName() : null);
        dto.setPurpose(todo.getPurpose());
        dto.setTodoDate(todo.getTodoDate());
        dto.setTime(todo.getTime());
        dto.setVenue(todo.getVenue());
        return dto;
    }
}
