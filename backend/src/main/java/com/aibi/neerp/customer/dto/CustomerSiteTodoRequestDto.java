package com.aibi.neerp.customer.dto;


import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerSiteTodoRequestDto {
    private Integer siteId;
    private Integer customerId;
    private Integer executiveId;
    private String purpose;
    private LocalDate date;
    private LocalTime time;
    private String place;
    private String status;
}

