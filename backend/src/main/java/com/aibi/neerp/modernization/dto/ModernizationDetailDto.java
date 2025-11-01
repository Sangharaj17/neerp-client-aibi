package com.aibi.neerp.modernization.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModernizationDetailDto {

    private Integer id;
    private String materialName;
    private String hsn;
    private Integer quantity;
    private String uom;
    private BigDecimal rate;
    private BigDecimal amount;
    private String guarantee;
}
