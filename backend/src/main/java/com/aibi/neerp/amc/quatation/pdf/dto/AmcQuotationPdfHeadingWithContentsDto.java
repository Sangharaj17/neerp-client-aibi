package com.aibi.neerp.amc.quatation.pdf.dto;

import java.util.List;
import lombok.Data;

@Data
public class AmcQuotationPdfHeadingWithContentsDto {
    private Integer id;
    private String headingName;
    private List<AmcQuotationPdfHeadingsContentsDto> contents;
}
