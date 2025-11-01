package com.aibi.neerp.modernization.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModernizationResponseDto {
    private ModernizationDto modernization;
    private List<ModernizationDetailDto> details;
}
