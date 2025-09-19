package com.aibi.neerp.componentpricing.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CounterFrameTypeResponseDTO {
    private Integer id;
    private String frameTypeName;
}
