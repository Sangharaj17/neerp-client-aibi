// --- 1. EnquiryRequestDto ---
package com.aibi.neerp.leadmanagement.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EnquiryRequestDto {
	
	private String liftName;
    private LocalDateTime enqDate;
    private Integer enquiryId;
    private Integer leadId;
    private Integer enquiryTypeId;
    private Integer typeOfLiftId;
    private Integer liftTypeId;
    private Integer cabinTypeId;
    private Integer noOfLiftId;
    private Integer capacityTermId;
    private Integer personCapacityId;
    private Integer weightId;
    private String noOfStops;
    private String noOfOpenings;
    private Integer noOfFloorsId;
    private String parkFloor;

    private List<String> floorSelections;  // 👈 Added this for T, B1, B2 etc.


    private String floorsDesignation;
    private Integer reqMachineRoomId;
    private String shaftsWidth; 
    private String shaftsDepth;
    private String projectRate;
    private Integer projectStageId;
    private Integer buildTypeId;
    private String reqMachineWidth;
    private String reqMachineDepth;
    private String carInternalWidth;
    private String carInternalDepth;
    private String product1, product2, product3, product4, product5;
    private String machine1, machine2, machine3, machine4, machine5;
    private String landing1, landing2, landing3, landing4, landing5;
    private String price1, price2, price3, price4, price5;
    private Integer pit;
    
    private Integer from;
    private Boolean checked;
    
    private Integer buildingTypeId;
    
    private Integer combinedEnquiryId;

}
