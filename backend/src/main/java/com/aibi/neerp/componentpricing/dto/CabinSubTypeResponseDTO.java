package com.aibi.neerp.componentpricing.dto;

import lombok.Data;

@Data
public class CabinSubTypeResponseDTO {
    private Integer id;
    private String cabinSubName;
    private Integer prize;

    private CabinTypeResponseDTO cabinTypeDTO;
    private CapacityTypeResponseDTO capacityTypeDTO;

    //private String personCapacity;
    private PersonCapResponseDTO personCapacityDTO;
    private WeightResponseDTO weightDTO;
}
