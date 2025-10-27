package com.aibi.neerp.dashboard.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OfficeActivityResponseDto {
    
    // Concatenated string describing the activity
    private String description;
    
    // Optional: you can also include other fields if needed
    // private Integer id;
    // private String purpose;
    // private String todoDate;
}

