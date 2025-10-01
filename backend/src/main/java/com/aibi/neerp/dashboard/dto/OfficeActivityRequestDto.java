package com.aibi.neerp.dashboard.dto;


import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OfficeActivityRequestDto {
    
    private String purpose;
    private LocalDate todoDate;
}

