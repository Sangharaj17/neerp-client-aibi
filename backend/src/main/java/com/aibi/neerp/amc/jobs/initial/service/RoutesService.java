package com.aibi.neerp.amc.jobs.initial.service;

import com.aibi.neerp.amc.jobs.initial.dto.EmployeeDto;
import com.aibi.neerp.amc.jobs.initial.dto.RoutesDto;
import com.aibi.neerp.amc.jobs.initial.entity.Routes;
import com.aibi.neerp.amc.jobs.initial.repository.RoutesRepository;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoutesService {

    private final RoutesRepository routesRepository;
    private final EmployeeRepository employeeRepository;

    public List<RoutesDto> getAllRoutes() {
        return routesRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public RoutesDto getRouteById(Integer routeId) {
        Routes route = routesRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found with id " + routeId));
        return mapToDto(route);
    }

    public RoutesDto createRoute(String routeName) {
        Routes route = Routes.builder()
                .routeName(routeName)
                .build();
        Routes savedRoute = routesRepository.save(route);
        return mapToDto(savedRoute);
    }

    public RoutesDto addEmployeesToRoute(Integer routeId, List<EmployeeDto> employees) {
        Routes route = routesRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));

        List<Employee> employeeEntities = employees.stream()
                .map(e -> employeeRepository.findById(e.getEmployeeId())
                        .orElseThrow(() -> new RuntimeException("Employee not found: " + e.getEmployeeId())))
                .collect(Collectors.toList());

        route.getEmployees().addAll(employeeEntities);
        Routes savedRoute = routesRepository.save(route);

        return mapToDto(savedRoute);
    }

    // ✅ Create route with existing employees using join table
    public RoutesDto createRouteWithEmployees(List<Integer> employeeIds) {
        long count = routesRepository.count();
        String newRouteName = "Route " + (count + 1);

        // Fetch employees by IDs
        List<Employee> employees = employeeRepository.findAllById(employeeIds);

        // Create route and assign employees
        Routes newRoute = Routes.builder()
                .routeName(newRouteName)
                .employees(employees)
                .build();

        Routes savedRoute = routesRepository.save(newRoute);

        return mapToDto(savedRoute);
    }

    private RoutesDto mapToDto(Routes route) {
        return RoutesDto.builder()
                .routeId(route.getRouteId())
                .routeName(route.getRouteName())
                .employees(route.getEmployees() != null ? route.getEmployees().stream()
                        .map(emp -> EmployeeDto.builder()
                                .employeeId(emp.getEmployeeId())
                                .name(emp.getEmployeeName())
                                .role(emp.getRole().getRole())
                                .address(emp.getAddress())
                                .build())
                        .collect(Collectors.toList()) : List.of())
                .build();
    }
}
