package com.aibi.neerp.componentpricing.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LightFittingResponseDTO {
    private Integer id;
    private String name;
    private Double price;
}
