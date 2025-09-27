package com.aibi.neerp.leadmanagement.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnquiryResponseDTO {
    private Integer enquiryId;
    private String enquiryDate;

    private Integer leadId;
    private String leadCompanyName;   // example from NewLeads entity

    private String liftType;          // from OperatorElevator
    private String cabinType;         // from CabinType
    private String capacityTerm;      // from CapacityType
    private String noOfStops;
    private String noOfOpenings;
    private String parkFloor;
    private String shaftsWidth;
    private String shaftsDepth;

    private String carInternalWidth;
    private String carInternalDepth;
}
