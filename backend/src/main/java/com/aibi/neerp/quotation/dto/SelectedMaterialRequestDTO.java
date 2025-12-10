package com.aibi.neerp.quotation.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SelectedMaterialRequestDTO {
    private Integer id; // Null for new materials, present for updates/deletions
    private Integer leadId;
    private Integer quotationLiftDetailId;
    private String materialName;
    private String materialType;
    private String materialDisplayName;
    private Double quantity;
    private String quantityUnit;
    private Double unitPrice;
    private Double price;
    private Integer materialId;
    private Integer operatorType;
}