package com.aibi.neerp.componentpricing.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MachineRoomRequestDTO {

    @NotBlank(message = "Machine Room Name cannot be blank")
    private String machineRoomName;

    public void sanitize() {
        if (machineRoomName != null) {
            machineRoomName = machineRoomName.trim();
        }
    }
}
