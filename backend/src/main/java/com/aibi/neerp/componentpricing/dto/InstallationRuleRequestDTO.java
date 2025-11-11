package com.aibi.neerp.componentpricing.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InstallationRuleRequestDTO {
    private Integer liftType;
    private List<Integer> floorIds;
    private Double baseAmount;
    private Double extraAmount;
}
