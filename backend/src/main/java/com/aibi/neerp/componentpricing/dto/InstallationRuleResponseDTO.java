package com.aibi.neerp.componentpricing.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InstallationRuleResponseDTO {
    private Long id;
    private Integer liftType;
    private List<Integer> floorIds;     // for backend
    private List<String> floorNames;    // for frontend display
    private Double baseAmount;
    private Double extraAmount;
    private Double amount;
}
