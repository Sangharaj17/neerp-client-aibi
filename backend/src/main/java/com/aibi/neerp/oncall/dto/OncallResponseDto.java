package com.aibi.neerp.oncall.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OncallResponseDto {
    private OncallDto oncallDto;
    private List<OncallDetailDto> details;
}
