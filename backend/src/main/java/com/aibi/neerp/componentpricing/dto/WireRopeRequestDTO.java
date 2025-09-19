package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WireRopeRequestDTO {

    @NotNull(message = "Wire Rope Type ID is required")
    private Integer wireRopeTypeId;

    @NotNull(message = "Operator Elevator ID is required")
    private Integer operatorElevatorId;

    @NotNull(message = "Floor ID is required")
    private Integer floorId;

    @NotNull(message = "Wire Rope Quantity is required")
    private Integer wireRopeQty;

    @NotNull(message = "Price is required")
    private Integer price;
}
