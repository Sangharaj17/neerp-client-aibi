package com.aibi.neerp.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SiteDto {
    private Integer siteId;
    private String siteName;
    private Integer customerId;
    private String address;
}
