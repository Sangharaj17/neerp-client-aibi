package com.aibi.neerp.customer.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerSiteTodoResponseDto {
    private Integer todoId;
    private String siteName;
    private String customerName;
    private String executiveName;
    private String purpose;
    private LocalDate date;
    private LocalTime time;
    private String place;
    private String status;
}

