package com.aibi.neerp.amc.common.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PaymentTermDto {
    private Long id;
    private String termName;
    private String description;
}
