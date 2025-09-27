package com.aibi.neerp.dashboard.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.aibi.neerp.dashboard.dto.DashboardTodoDto;
import com.aibi.neerp.dashboard.dto.MissedActivityDto;
import com.aibi.neerp.leadmanagement.entity.LeadTodo;
import com.aibi.neerp.leadmanagement.repository.LeadTodoRepository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collector;

@Service
public class DashboardService {
	
	
	@Autowired LeadTodoRepository leadTodoRepository;

	 public Page<DashboardTodoDto> getDashboardTodoList(String search, int page, int size) {
	        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
	        return leadTodoRepository.searchTodos(search, PageRequest.of(page, size))
	                .map(todo -> new DashboardTodoDto(
	                        todo.getPurpose() + " For " + todo.getLead().getCustomerName() + " at " + todo.getVenue(),
	                        todo.getTodoDate().format(dateFormatter) + " at " + todo.getTime()
	                ));
	    }
    
	 public Page<DashboardTodoDto> getMissedTodoListWithoutActivity(String search, int page, int size) {
		    return leadTodoRepository.searchMissedTodosWithoutActivity(search, PageRequest.of(page, size))
		            .map(this::convertToDto);
		}

	 private DashboardTodoDto convertToDto(LeadTodo todo) {
		    DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
		    
		    String todoName = todo.getPurpose() + " For " + todo.getLead().getCustomerName() + " at " + todo.getVenue();
		    String dateAndTime = todo.getTodoDate().format(dateFormatter) + " at " + todo.getTime();
		    
		    return new DashboardTodoDto(todoName, dateAndTime);
		}

    
}


