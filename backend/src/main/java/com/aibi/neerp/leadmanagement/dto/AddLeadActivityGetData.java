package com.aibi.neerp.leadmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddLeadActivityGetData {

	private Integer leadId;
	private Integer todoId;
	private String leadType;
	private String salesEnggName;
	private String leadCompName;
	private String contactName;
	private String address;
	private String emailid;
	private String contactNo;
	private String siteName;
	private String siteAddress;
	private String leadStage;
	private String todoName; // Purpose of the todo
	private String venue; // Venue from todo
	private String customerName; // Customer name for display

}
