package com.aibi.neerp.quotation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LiftSaveStatusRequestDTO {
    private List<Long> liftIds;
    private Integer quotationMainId;
    private String remarks;
    private Integer createdByEmployeeId;
}
