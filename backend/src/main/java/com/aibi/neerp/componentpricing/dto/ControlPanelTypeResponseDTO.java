package com.aibi.neerp.componentpricing.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ControlPanelTypeResponseDTO {
    private Integer id;
    private String controlPanelType;
    private String machineTypeName;
    private String operatorTypeName;
    private String capacityTypeName;
    private String personCapacityName;
    private String weightName;
    private Integer price;
}
