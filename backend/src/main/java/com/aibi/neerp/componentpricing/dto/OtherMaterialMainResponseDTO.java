package com.aibi.neerp.componentpricing.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtherMaterialMainResponseDTO {
    private Long id;
    private String materialMainType;
    private Boolean active;
    private String ruleExpression;
    private boolean isSystemDefined;
}
