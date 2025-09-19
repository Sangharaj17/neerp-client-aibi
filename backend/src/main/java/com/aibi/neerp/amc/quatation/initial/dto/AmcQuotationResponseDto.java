package com.aibi.neerp.amc.quatation.initial.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
public class AmcQuotationResponseDto {
    private Integer id;
    private String customerName;
    private String siteName;
    private String employeeName;
    private String place;
    private String makeOfElevator;
    private String quatationDate;
    private String forecastMonth;
    private String amcPeriod;
    private Integer isFinal;
    private String edition;
    
    private Boolean isRevised;
}
