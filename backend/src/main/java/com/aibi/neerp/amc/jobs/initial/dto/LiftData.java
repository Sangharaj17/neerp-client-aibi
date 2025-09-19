package com.aibi.neerp.amc.jobs.initial.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data                   // Generates getters, setters, toString, equals, hashCode
@NoArgsConstructor      // Generates a no-args constructor
@AllArgsConstructor     // Generates an all-args constructor
public class LiftData {

	private Integer enquiryId;
    private String liftName;
    private String capacityValue;
    private String typeOfElevators;
    private String noOfFloors;
}
