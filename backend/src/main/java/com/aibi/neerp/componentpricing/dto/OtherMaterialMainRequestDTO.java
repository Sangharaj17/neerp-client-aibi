package com.aibi.neerp.componentpricing.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtherMaterialMainRequestDTO {
    private String materialMainType;
    private Boolean active;           // ACTIVE / INACTIVE
    private String ruleExpression;
}
