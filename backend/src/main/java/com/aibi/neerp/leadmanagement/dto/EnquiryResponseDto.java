package com.aibi.neerp.leadmanagement.dto;

import com.aibi.neerp.componentpricing.dto.AdditionalFloorDTO;
import com.aibi.neerp.leadmanagement.entity.BuildingType;
import com.aibi.neerp.materialmanagement.dto.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EnquiryResponseDto {
    private Integer enquiryId;
    private LocalDateTime enqDate;
    private NewLeadsResponseDto lead;
    private EnquiryTypeResponseDto enquiryType;
    private TypeOfLiftDto typeOfLift;
    private OperatorElevatorDto liftType;
    private CabinTypeDto cabinType;
    private LiftQuantityDto noOfLift;
    private CapacityTypeDto capacityTerm;
    private PersonCapacityDto personCapacity;
    private WeightDto weight;
    private String noOfStops;
    private String noOfOpenings;
    private FloorDto noOfFloors;
    private String parkFloor;
    private String floorsDesignation;
    private MachineRoomDto reqMachineRoom;
    private String shaftsWidth;
    private String shaftsDepth;
    private String projectRate;
    private ProjectStageDto projectStage;
    private BuildTypeDto buildType;
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
    
    private BuildingType buildingType;

    private List<AdditionalFloorDTO> floorSelections;
}
