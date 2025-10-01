package com.aibi.neerp.customer.controller;


import com.aibi.neerp.customer.dto.CustomerSiteTodoRequestDto;
import com.aibi.neerp.customer.dto.CustomerSiteTodoResponseDto;
import com.aibi.neerp.customer.service.CustomerSiteTodoService;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/customer-site-todos")
@RequiredArgsConstructor
public class CustomerSiteTodoController {

	
    private final CustomerSiteTodoService todoService;

    @PostMapping
    public CustomerSiteTodoResponseDto createTodo(@RequestBody CustomerSiteTodoRequestDto dto) {
        return todoService.createTodo(dto);
    }

    @GetMapping("/by-customer/{customerId}")
    public List<CustomerSiteTodoResponseDto> getTodosByCustomer(@PathVariable Integer customerId) {
        return todoService.getTodosByCustomer(customerId);
    }

    @GetMapping("/by-site/{siteId}")
    public List<CustomerSiteTodoResponseDto> getTodosBySite(@PathVariable Integer siteId) {
        return todoService.getTodosBySite(siteId);
    }
    
    @GetMapping("/serchAllCustomerSiteTodos")
    public Page<CustomerSiteTodoResponseDto> getTodos(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return todoService.getAllTodos(search, pageable);
    }
    
    
    @GetMapping("/notPerformedTodos")
    public Page<CustomerSiteTodoResponseDto> getUpcomingTodos(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return todoService.getUpcomingTodos(search, pageable);
    }

    @GetMapping("/missedActivities")
    public Page<CustomerSiteTodoResponseDto> getMissedTodos(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return todoService.getMissedTodos(search, pageable);
    }
}

