package com.aibi.neerp.amc.jobs.initial.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SelectDetailForJob {
    private String selectDetailForJob;
    private Integer amcQuatationId;
    private Integer revisedQuatationId;
    
    private boolean isThisJobIsRenewal ;

}
