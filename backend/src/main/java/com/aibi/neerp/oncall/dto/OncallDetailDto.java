package com.aibi.neerp.oncall.dto;


import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OncallDetailDto {

    private Integer id;
    private String materialName;
    private String hsn;
    private Integer quantity;
    private String uom;
    private BigDecimal rate;
    private BigDecimal amount;
    private String guarantee;
}
