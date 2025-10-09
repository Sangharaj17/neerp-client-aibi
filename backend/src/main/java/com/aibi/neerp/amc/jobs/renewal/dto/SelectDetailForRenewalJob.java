package com.aibi.neerp.amc.jobs.renewal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SelectDetailForRenewalJob {
    private String selectDetailForJob;
    private Integer amcRenewalQuatationId;
    private Integer revisedRenewalQuatationId;
    
    private boolean isThisJobIsRenewal ;
}

