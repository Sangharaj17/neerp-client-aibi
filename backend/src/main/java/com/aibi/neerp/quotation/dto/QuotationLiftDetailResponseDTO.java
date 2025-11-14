package com.aibi.neerp.quotation.dto;

import com.aibi.neerp.componentpricing.entity.OperationType;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuotationLiftDetailResponseDTO {

    private Long id;
    private String liftQuotationNo;

    // 🔹 Quotation References
    private Long quotationMainId;
    private Long leadId;
    private String leadName;
    private Integer leadTypeId;
    private LocalDateTime leadDate;

    private Long combinedEnquiryId;
    private Long enquiryId;
    private Integer enquiryTypeId;
    private LocalDateTime enqDate;

    // 🔹 Lift Configuration
    private Integer liftType;
    private String liftTypeName;

    private Integer typeOfLift;
    private String typeOfLiftName;

    private Integer machineRoom;
    private String machineRoomName;

    private Integer capacityType;
    private String capacityTypeName;

    private Integer personCapacity;
    private String personCapacityName;

    private Integer weight;
    private String weightName;

    private Integer floors;
    private Integer stops;
    private Integer openings;
    private String floorDesignations;
    private List<String> floorSelectionLabels;
    private List<Integer> floorSelectionIds;

    private Double carTravel;
    private Double speed;

    // 🔹 Cabin Design
    private Integer cabinType;
    private String cabinTypeName;

    private Integer cabinSubType;
    private String cabinSubTypeName;

    private Integer lightFitting;
    private String lightFittingName;

    private Integer cabinFlooring;
    private String cabinFlooringName;

    private Integer cabinCeiling;
    private String cabinCeilingName;

    private Integer airType;
    private String airTypeName;

    private Integer airSystem;
    private String airSystemName;

    private Integer carEntrance;
    private String carEntranceName;

    private Integer carEntranceSubType;
    private String carEntranceSubTypeName;

    private Integer landingEntranceSubType1;
    private String landingEntranceSubType1Name;

    private Integer landingEntranceSubType2;
    private String landingEntranceSubType2Name;

    private Integer landingEntranceCount;
    private Integer landingEntranceSubType2_fromFloor;
    private Integer landingEntranceSubType2_toFloor;

    // 🔹 Control Panel & Wiring
    private Integer controlPanelType;
    private String controlPanelTypeName;

    private String manufacture;

    private Integer controlPanelMake;
    private String controlPanelMakeName;

    private Integer wiringHarness;
    private String wiringHarnessName;

    private Integer guideRail;
    private String guideRailName;

    private Integer bracketType;
    private String bracketTypeName;

    private Integer ropingType;
    private String ropingTypeName;

    private Integer lopType;
    private String lopTypeName;

    private Integer copType;
    private String copTypeName;

    private Double overhead;

    private Integer operationType;
    private String operationTypeName;

    // 🔹 Dimensions
    private Double machineRoomDepth;
    private Double machineRoomWidth;
    private Double shaftWidth;
    private Double shaftDepth;
    private Double carInternalWidth;
    private Double carInternalDepth;
    private Double carInternalHeight;

    private List<Integer> stdFeatureIds;
    private Boolean autoRescue;

    // 🔹 Additional Components
    private Integer vfdMainDrive;
    private String vfdMainDriveName;

    private Integer doorOperator;
    private String doorOperatorName;

    private Integer mainMachineSet;
    private String mainMachineSetName;

    private Integer carRails;
    private String carRailsName;

    private Integer counterWeightRails;
    private String counterWeightRailsName;

    private Integer wireRope;
    private String wireRopeName;

    private Integer warrantyPeriod;
    private String warrantyPeriodName;

    private Integer installationRuleId;
    private String installationRuleName;

    private Integer liftQuantity;

    // 🔹 Pricing Details
    private Double liftRate;
    private Boolean pwdIncludeExclude;
    private Boolean scaffoldingIncludeExclude;

    private Double totalAmount;
    private Double totalAmountWithoutGST;
    private Double totalAmountWithoutLoad;
    private Boolean isLiftRateManual;
    private Double commercialTotal;
    private Double commercialTaxAmount;
    private Double commercialFinalAmount;
    private Double tax;
    private Double loadPerAmt;
    private Double loadAmt;

    // 🔹 Internal Calculation Fields
    private Double ardPrice;
    private Double machinePrice;
    private Double governorPrice;
    private Double truffingPrice;
    private Double fastenerPrice;
    private Double installationAmount;
    private Double manualPrice;
    private Double commonPrice;
    private Double otherPrice;

    // 🔹 Price Breakdown (Component Tabs)
    private Double cabinPrice;
    private Double lightFittingPrice;
    private Double cabinFlooringPrice;
    private Double cabinCeilingPrice;
    private Double airSystemPrice;
    private Double carEntrancePrice;
    private Double landingEntrancePrice1;
    private Double landingEntrancePrice2;

    private Double controlPanelTypePrice;
    private Double wiringHarnessPrice;
    private Double guideRailPrice;
    private Double bracketTypePrice;
    private Double wireRopePrice;
    private Double ropingTypePrice;
    private Double lopTypePrice;
    private Double copTypePrice;

    // 🔹 Other Charges
    private Double pwdAmount;
    private Double bambooScaffolding;
    private Double ardAmount;
    private Double overloadDevice;
    private Double transportCharges;
    private Double otherCharges;
    private Double powerBackup;
    private Double fabricatedStructure;
    private Double electricalWork;
    private Double ibeamChannel;
    private Double duplexSystem;
    private Double telephonicIntercom;
    private Double gsmIntercom;
    private Double numberLockSystem;
    private Double thumbLockSystem;

    private String truffingQty;
    private String truffingType;
    private String fastenerType;

    // 🔹 Additional Info
    private Double pitDepth;
    private String mainSupplySystem;
    private String auxlSupplySystem;
    private String signals;

    private Boolean isSaved;
    private Boolean isFinalized;

    private LocalDateTime quotationDate;

    // 🔹 Sub-DTOs (for materials)
    private List<ManualOrCommonMaterialDTO> manualDetails;
    private List<ManualOrCommonMaterialDTO> commonDetails;

    private List<SelectedMaterialResponseDTO> selectedMaterials;
}
