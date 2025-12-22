package com.aibi.neerp.amc.quatation.pdf.dto;

import lombok.Data;

@Data
public class CssStyleDto {
    private Integer id;
    private String paddingTop;
    private String paddingBottom;
    private Integer amcQuotationPdfHeadingsId; // ID reference instead of full object
}