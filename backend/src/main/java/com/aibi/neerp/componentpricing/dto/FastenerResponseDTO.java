package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FastenerResponseDTO {
    private Integer id;
    private String fastenerName;
    private Integer floorId;
    private String floorName; // helpful to display
    private Integer price;
}
