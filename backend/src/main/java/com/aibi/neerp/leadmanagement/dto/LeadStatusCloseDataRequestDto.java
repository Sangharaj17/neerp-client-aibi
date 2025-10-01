package com.aibi.neerp.leadmanagement.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class LeadStatusCloseDataRequestDto {
    private String reason;
    private LocalDate expiryDate;
}

