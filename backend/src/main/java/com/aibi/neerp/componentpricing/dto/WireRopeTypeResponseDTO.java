package com.aibi.neerp.componentpricing.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WireRopeTypeResponseDTO {
    private Long id;
    private Integer machineTypeId;
    private String machineTypeName;
    private Double wireRopeSize;
    private String wireRopeType;
}
