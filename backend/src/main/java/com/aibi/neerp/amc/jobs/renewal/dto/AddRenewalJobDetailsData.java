package com.aibi.neerp.amc.jobs.renewal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.aibi.neerp.amc.jobs.initial.dto.EmployeeDto;
import com.aibi.neerp.amc.jobs.initial.dto.LiftData;
import com.aibi.neerp.amc.jobs.initial.dto.RoutesDto;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddRenewalJobDetailsData {

    private BigDecimal jobAmount;
    private String customer;
    private String customerSite;
    private long jobNo;
    private LocalDate startDate;
    private String paymentTerm;
    
    private Integer noOfServices;
    
   

    
    private List<LiftData> liftDatas;
    private List<EmployeeDto> employeeDtos;
    private List<RoutesDto> routesDtos;
    
}
