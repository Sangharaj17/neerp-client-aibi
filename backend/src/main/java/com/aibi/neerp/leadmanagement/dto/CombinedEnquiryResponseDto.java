package com.aibi.neerp.leadmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Column;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CombinedEnquiryResponseDto {

    private Integer id;
    private Integer leadId;
    private String leadCompanyName;
 
    private String projectName; // ✅ Added plain string field
    
    private LocalDate enquiryDate;
    
    
    private String customerName;
    private String customerSite;
    private String selectLead;
    
    
    
    private List<EnquiryResponseDto> enquiries;
}
