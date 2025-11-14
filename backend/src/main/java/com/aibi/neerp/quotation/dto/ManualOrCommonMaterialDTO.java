package com.aibi.neerp.quotation.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ManualOrCommonMaterialDTO {

    private Long id;
    private String otherMaterialName;
    private Long otherMaterialMainId;
    private String otherMaterialMainName;
    private Boolean otherMaterialMainActive;

    private String otherMaterialMainRule;

    private Boolean otherMaterialMainIsSystemDefined;

   private Long operatorTypeId;
    private String operatorTypeName;

    private Long machineRoomId;
    private String machineRoomName;

    private Long capacityTypeId;
    private String capacityTypeName;

    private Long personCapacityId;
    private String personCapacityName;

    private Long weightId;
    private String weightName;

    private Integer floors;
    private String floorsLabel;

    private String quantity;
    private Double price;
}