package com.aibi.neerp.leadmanagement.inspectionreport.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InspectionCategoryCheckpointDto {
    private Integer id;
    private String checkpointName;

    private Integer categoryId;
    private String categoryName;
}
