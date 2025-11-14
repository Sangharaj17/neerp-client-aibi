// In /dto/QuotationFinalizeRequestDTO.java (New file)
package com.aibi.neerp.quotation.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class QuotationIdRequestDTO {
    @NotNull(message = "Employee ID is required.")
    private Integer EmployeeId;
}