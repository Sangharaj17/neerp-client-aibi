package com.aibi.neerp.amc.jobs.initial.controller;

import com.aibi.neerp.amc.jobs.initial.dto.EmployeeDto;
import com.aibi.neerp.amc.jobs.initial.dto.RoutesDto;
import com.aibi.neerp.amc.jobs.initial.service.RoutesService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RoutesController {

    private final RoutesService routesService;

    @GetMapping
    public List<RoutesDto> getAllRoutes() {
        return routesService.getAllRoutes();
    }

    @GetMapping("/{routeId}")
    public RoutesDto getRouteById(@PathVariable Integer routeId) {
        return routesService.getRouteById(routeId);
    }

    @PostMapping
    public RoutesDto createRoute(@RequestParam String routeName) {
        return routesService.createRoute(routeName);
    }

    @PostMapping("/{routeId}/employees")
    public RoutesDto addEmployeesToRoute(@PathVariable Integer routeId, @RequestBody List<EmployeeDto> employees) {
        return routesService.addEmployeesToRoute(routeId, employees);
    }

    @PostMapping("/create-with-employees")
    public RoutesDto createRouteWithEmployees(@RequestBody List<Integer> employeeIds) {
        return routesService.createRouteWithEmployees(employeeIds);
    }
}
