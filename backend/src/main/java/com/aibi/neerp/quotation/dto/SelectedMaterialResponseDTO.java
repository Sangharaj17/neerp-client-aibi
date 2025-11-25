package com.aibi.neerp.quotation.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SelectedMaterialResponseDTO {
    private Integer id;
    private Integer leadId;
    private Integer quotationLiftDetailId;
    private String materialName;
    private String materialType;
    private String materialDisplayName;
    private Double quantity;
    private String quantityUnit;
    private Double price;
    private Integer materialId;
    private Double totalAmount; // Calculated: quantity * price
    // ... potentially other read-only fields ...
}
