package com.aibi.neerp.customer.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDto {
    private Integer customerId;
    private String customerName;
    private String newCustomerName;
    private String contactNumber;
    private String gstNo;
    private String emailId;
    private String address;
    private Boolean isVerified;
    private Boolean active;
    private Integer leadId; // To link with tbl_new_leads

    private List<SiteDto> sites;

    
}
