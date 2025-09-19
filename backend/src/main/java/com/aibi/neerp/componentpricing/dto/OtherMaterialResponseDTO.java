package com.aibi.neerp.componentpricing.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OtherMaterialResponseDTO {
    private Integer id;
    private String materialType;

    private Integer operatorTypeId;
    private String operatorTypeName;

    private Integer machineRoomId;
    private String machineRoomName;

    private Integer capacityTypeId;
    private String capacityTypeName;

    private Integer personCapacityId;
    private String personCapacityName;

    private Integer weightId;
    private String weightName;

    private String floorsLabel;
    private String quantity;
    private Integer price;
}
