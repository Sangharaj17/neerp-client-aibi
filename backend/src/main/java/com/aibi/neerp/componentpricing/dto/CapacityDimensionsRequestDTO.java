package com.aibi.neerp.componentpricing.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CapacityDimensionsRequestDTO {
    private Integer capacityTypeId;
    private Integer personCapacityId;
    private Integer weightId;

    private Integer shaftsWidth;
    private Integer shaftsDepth;
    private Integer reqMachineWidth;
    private Integer reqMachineDepth;
    private Integer carInternalWidth;
    private Integer carInternalDepth;
}
