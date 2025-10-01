package com.aibi.neerp.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteWithCustomerDto {
    private Integer siteId;
    private String siteName;
    private String siteAddress;
    private Integer customerId;
    private String customerName;
}

