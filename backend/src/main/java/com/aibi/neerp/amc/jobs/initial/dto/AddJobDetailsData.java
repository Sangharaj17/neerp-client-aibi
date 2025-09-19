package com.aibi.neerp.amc.jobs.initial.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddJobDetailsData {

    private BigDecimal jobAmount;
    private String customer;
    private String customerSite;
    private long jobNo;
    private String startDate;
    private String paymentTerm;

    
    private List<LiftData> liftDatas;
    private List<EmployeeDto> employeeDtos;
    private List<RoutesDto> routesDtos;
    
}
