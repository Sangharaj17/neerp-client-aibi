package com.aibi.neerp.amc.quatation.pdf.dto;

import java.util.List;
import lombok.Data;

@Data
public class AmcQuotationPdfHeadingWithContentsDto {
    private Integer id;
    private String headingName;
    private String quotationType;
    private List<AmcQuotationPdfHeadingsContentsDto> contents;
}
