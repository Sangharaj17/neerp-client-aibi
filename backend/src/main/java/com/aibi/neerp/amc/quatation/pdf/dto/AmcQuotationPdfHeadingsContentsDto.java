package com.aibi.neerp.amc.quatation.pdf.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AmcQuotationPdfHeadingsContentsDto {
    private Integer id;
    private String contentData;
    private String picture;  // base64 / text
    private Integer headingId;
}
