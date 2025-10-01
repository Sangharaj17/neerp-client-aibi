package com.aibi.neerp.customer.service;

import com.aibi.neerp.customer.dto.CustomerSiteTodoRequestDto;
import com.aibi.neerp.customer.dto.CustomerSiteTodoResponseDto;
import com.aibi.neerp.customer.entity.Customer;
import com.aibi.neerp.customer.entity.Site;
import com.aibi.neerp.customer.entity.CustomerSiteTodo;
import com.aibi.neerp.customer.repository.CustomerSiteTodoRepository;
import com.aibi.neerp.customer.repository.CustomerRepository;
import com.aibi.neerp.customer.repository.SiteRepository;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerSiteTodoService {

    private final CustomerSiteTodoRepository todoRepository;
    private final CustomerRepository customerRepository;
    private final SiteRepository siteRepository;
    private final EmployeeRepository employeeRepository;

    public CustomerSiteTodoResponseDto createTodo(CustomerSiteTodoRequestDto dto) {
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        Site site = siteRepository.findById(dto.getSiteId())
                .orElseThrow(() -> new RuntimeException("Site not found"));
        Employee executive = employeeRepository.findById(dto.getExecutiveId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        CustomerSiteTodo todo = CustomerSiteTodo.builder()
                .customer(customer)
                .site(site)
                .executive(executive)
                .purpose(dto.getPurpose())
                .date(dto.getDate())
                .time(dto.getTime())
                .place(dto.getPlace())
                .status(dto.getStatus())
                .build();

        CustomerSiteTodo saved = todoRepository.save(todo);

        return mapToDto(saved);
    }

    public List<CustomerSiteTodoResponseDto> getTodosByCustomer(Integer customerId) {
        return todoRepository.findByCustomerCustomerId(customerId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<CustomerSiteTodoResponseDto> getTodosBySite(Integer siteId) {
        return todoRepository.findBySiteSiteId(siteId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private CustomerSiteTodoResponseDto mapToDto(CustomerSiteTodo todo) {
        return CustomerSiteTodoResponseDto.builder()
                .todoId(todo.getTodoId())
                .customerName(todo.getCustomer().getCustomerName())
                .siteName(todo.getSite().getSiteName())
                .executiveName(todo.getExecutive().getEmployeeName())
                .purpose(todo.getPurpose())
                .date(todo.getDate())
                .time(todo.getTime())
                .place(todo.getPlace())
                .status(todo.getStatus())
                .build();
    }
    
    public Page<CustomerSiteTodoResponseDto> getAllTodos(String search, Pageable pageable) {
        return todoRepository.searchTodos(search, pageable)
                .map(this::mapToDto);
    }
    
    public Page<CustomerSiteTodoResponseDto> getUpcomingTodos(String search, Pageable pageable) {
        LocalDate today = LocalDate.now();
        return todoRepository.searchUpcomingTodos(search, today, pageable)
                .map(this::mapToDto);
    }

    public Page<CustomerSiteTodoResponseDto> getMissedTodos(String search, Pageable pageable) {
        LocalDate today = LocalDate.now();
        return todoRepository.searchMissedTodos(search, today, pageable)
                .map(this::mapToDto);
    }

   
}

