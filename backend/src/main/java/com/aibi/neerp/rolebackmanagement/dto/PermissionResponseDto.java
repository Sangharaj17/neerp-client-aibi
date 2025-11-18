package com.aibi.neerp.rolebackmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PermissionResponseDto {
    private Long id;
    private Long moduleId;
    private String moduleName;
    private Integer featureId;
    private String featureName;
}

