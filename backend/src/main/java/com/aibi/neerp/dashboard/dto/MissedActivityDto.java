package com.aibi.neerp.dashboard.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MissedActivityDto {
    private String name;
    private String dateAndTime;
}

