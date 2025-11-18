package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OtherMaterialResponseDTO {
    private Integer id;

    private String otherMaterialName;
    private String otherMaterialDisplayName;

    private Long otherMaterialMainId;
    private String otherMaterialMainName;

    private Boolean otherMaterialMainActive;
    private String otherMaterialMainRule;
    private Boolean otherMaterialMainIsSystemDefined;

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

    private Integer floors;
    private String floorsLabel;
    private String quantity;
    private String quantityUnit;
    private Integer price;
}
