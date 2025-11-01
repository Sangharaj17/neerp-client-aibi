package com.aibi.neerp.modernization.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModernizationRequestDto {
    private ModernizationDto modernization;
    private List<ModernizationDetailDto> details;
}
