package com.aibi.neerp.oncall.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OncallRequestDto {
    private OncallDto oncallDto;
    private List<OncallDetailDto> oncallDetailDtos;
}
