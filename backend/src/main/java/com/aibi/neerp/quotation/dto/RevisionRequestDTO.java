package com.aibi.neerp.quotation.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevisionRequestDTO {
    // ID of the quotation to be superseded
    private Integer oldQuotationMainId;

    // ID of the employee performing the revision
    private Integer revisedByEmployeeId;
}