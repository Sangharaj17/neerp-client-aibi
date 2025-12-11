package com.aibi.neerp.quotation.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuotationMinimalDTO {
    private Integer id;
    private String customerName;
    private String siteName;
    private String formattedTitle;
}
