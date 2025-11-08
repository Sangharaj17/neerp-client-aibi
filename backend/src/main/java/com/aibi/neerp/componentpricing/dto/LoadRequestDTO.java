package com.aibi.neerp.componentpricing.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoadRequestDTO {
    private Double loadAmount;
    private String description;
}

