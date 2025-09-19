package com.aibi.neerp.amc.jobs.initial.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoutesDto {
    private Integer routeId;
    private String routeName;
    private List<EmployeeDto> employees;
}
