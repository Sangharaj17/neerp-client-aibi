package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WireRopeRequestDTO {

    @NotNull(message = "Wire Rope Type ID is required")
    private Integer wireRopeTypeId;

    @NotBlank(message = "Wire rope name cannot be blank")
    private String wireRopeName;

    @NotNull(message = "Machine Type ID is required")
    private Integer machineTypeId;

    @NotNull(message = "Floor ID is required")
    private Integer floorId;

    @NotNull(message = "Wire Rope Quantity is required")
    private Integer wireRopeQty;

    @NotNull(message = "Price is required")
    private Integer price;

    @NotNull(message = "Wire rope size is required")
    private Double wireRopeSize;
}
