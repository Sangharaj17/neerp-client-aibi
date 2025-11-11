package com.aibi.neerp.componentpricing.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoadResponseDTO {
    private Integer id;
    private Double loadAmount;
    private String description;
}

