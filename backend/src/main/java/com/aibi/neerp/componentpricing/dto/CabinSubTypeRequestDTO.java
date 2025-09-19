package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO for creating or updating CabinSubType
 */
@Data
public class CabinSubTypeRequestDTO {

    /** ID of the selected cabin type */
    @NotNull(message = "Cabin Type ID is required")
    private Integer cabinTypeId;

    /** Name of the cabin sub-type */
    @NotBlank(message = "Cabin Sub Name cannot be blank")
    private String cabinSubName;

    /** Price for the cabin sub-type */
    @NotNull(message = "Prize is required")
    @Min(value = 1, message = "Prize must be greater than 0")
    private Integer prize;

    /** ID of the selected capacity type (e.g., Person or Weight) */
    @NotNull(message = "Capacity Type ID is required")
    private Integer capacityTypeId;

    /** Optional: ID from person capacity table */
    private Integer personCapacityId;

    /** Optional: ID from weight table */
    private Integer weightId;
}
