package com.aibi.neerp.componentpricing.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CapacityDimensionsResponseDTO {
    private Integer id;

    private Integer capacityTypeId;      // for filter
    private String capacityTypeName;

    private Integer capacityValueId;     // for filter (personCapacityId or weightId)
    private String capacityValue;        // displayName of PersonCapacity OR label of Weight

    private Integer shaftsWidth;
    private Integer shaftsDepth;
    private Integer reqMachineWidth;
    private Integer reqMachineDepth;
    private Integer carInternalWidth;
    private Integer carInternalDepth;
}
