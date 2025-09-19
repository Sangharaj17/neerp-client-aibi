package com.aibi.neerp.leadmanagement.dto;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LeadTodoAndActivityData {
	
    private String leadCompanyName;
    private String customerName;
    private String emailId;
    private String contactNo;
    private String address;
    private String siteName;
    private String siteAddress;
    
    private List<LeadTodoWithActivityDto> leadTodoWithActivities;

    
}
