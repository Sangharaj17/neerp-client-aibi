package com.aibi.neerp.dashboard.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aibi.neerp.dashboard.dto.DashboardTodoDto;
import com.aibi.neerp.dashboard.service.DashboardService;

import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

	@Autowired
    private  DashboardService dashboardService;

	  @GetMapping("/todoList")
	    public Page<DashboardTodoDto> getTodos(
	            @RequestParam(defaultValue = "") String search,
	            @RequestParam(defaultValue = "0") int page,
	            @RequestParam(defaultValue = "10") int size) {
	        return dashboardService.getDashboardTodoList(search, page, size);
	    }
	  
	  @GetMapping("/missed-no-activity")
	  public Page<DashboardTodoDto> getMissedTodosWithoutActivity(
	          @RequestParam(defaultValue = "") String search,
	          @RequestParam(defaultValue = "0") int page,
	          @RequestParam(defaultValue = "10") int size) {
	      return dashboardService.getMissedTodoListWithoutActivity(search, page, size);
	  }

}

