package com.aibi.neerp.componentpricing.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CapacityTypeResponseDTO {
    private Integer id;
    private String type;
    private String fieldKey;
    private String formKey;

    public CapacityTypeResponseDTO() {
    }

    public CapacityTypeResponseDTO(Integer id, String type, String fieldKey, String formKey) {
        this.id = id;
        this.type = type;
        this.fieldKey = fieldKey;
        this.formKey = formKey;
    }
}
