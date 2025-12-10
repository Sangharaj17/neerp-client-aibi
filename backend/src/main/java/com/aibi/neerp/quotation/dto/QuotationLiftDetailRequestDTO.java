package com.aibi.neerp.quotation.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuotationLiftDetailRequestDTO {

    private Long id;
    private String liftQuotationNo;
    private Long quotationMainId;

    private Long parentLiftId;
    private String origin;

    private Long leadId;
    private Integer leadTypeId;
    private LocalDateTime leadDate;

    private Long combinedEnquiryId;
    private Long enquiryId;
    private Integer enquiryTypeId;
    private LocalDateTime enqDate;

    private Integer liftTypeId;
    private Integer typeOfLiftId;
    private Integer machineRoomId;

    private Integer capacityTypeId;
    private Integer personCapacityId;
    private Integer weightId;
    private Integer floors;
    private Integer stops;
    private Integer openings;

    private String floorDesignations;
    private List<Integer> floorSelectionIds;

    private Double carTravel;
    private Double speed;

    // Cabin design
    private Integer cabinTypeId;
    private Integer cabinSubTypeId;
    private Integer lightFittingId;
    private Integer cabinFlooringId;
    private Integer cabinCeilingId;
    private Integer airTypeId;
    private Integer airSystemId;

    private Integer carEntranceId;
    private Integer carEntranceSubTypeId;

    private Integer landingEntranceSubType1Id;
    private Integer landingEntranceSubType2Id;
    private Integer landingEntranceCount;
    private Integer landingEntranceSubType2_fromFloor;
    private Integer landingEntranceSubType2_toFloor;

    private Integer controlPanelTypeId;
    private String manufacture;
    private Integer controlPanelMakeId;
    private Integer wiringHarnessId;
    private Integer guideRailId;
    private Integer bracketTypeId;
    private Integer ropingTypeId;
    private Integer lopTypeId;
    private Integer copTypeId;

    private Double overhead;
    private Integer operationTypeId;

    private Double machineRoomDepth;
    private Double machineRoomWidth;
    private Double shaftWidth;
    private Double shaftDepth;
    private Double carInternalWidth;
    private Double carInternalDepth;
    private Double carInternalHeight;

    private List<Integer> stdFeatureIds;
    private Boolean autoRescue;

    private Integer vfdMainDriveId;
    private Integer doorOperatorId;
    private Integer mainMachineSetId;
    private Integer carRailsId;
    private Integer counterWeightRailsId;
    private Integer wireRopeId;
    private Integer warrantyPeriodId;

    private Boolean pwdIncludeExclude;
    private Boolean scaffoldingIncludeExclude;
    private Integer installationAmountRuleId;
    private Integer liftQuantity;

    private Double liftRate;
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

    private Double ardPrice;
    private Double machinePrice;
    private Double governorPrice;
    private Double truffingPrice;
    private Double fastenerPrice;
    private Double installationAmount;
    private Double manualPrice;
    private Double commonPrice;
    private Double otherPrice;

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

    private Double pitDepth;
    private String mainSupplySystem;
    private String auxlSupplySystem;
    private String signals;

    private LocalDateTime quotationDate;

    private Boolean isSaved;
    private Boolean isFinalized;

    private List<ManualOrCommonMaterialDTO> manualDetails;
    private List<ManualOrCommonMaterialDTO> commonDetails;
    private List<ManualOrCommonMaterialDTO> otherDetails;

    private List<SelectedMaterialRequestDTO> selectedMaterials;
}


