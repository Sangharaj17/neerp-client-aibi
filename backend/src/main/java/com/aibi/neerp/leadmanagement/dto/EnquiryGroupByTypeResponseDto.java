package com.aibi.neerp.leadmanagement.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EnquiryGroupByTypeResponseDto {
    private EnquiryTypeResponseDto enquiryType;
    private List<CombinedEnquiryResponseDto> enquiries;
}
