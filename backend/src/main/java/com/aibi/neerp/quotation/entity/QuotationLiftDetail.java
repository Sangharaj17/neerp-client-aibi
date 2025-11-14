package com.aibi.neerp.quotation.entity;

import com.aibi.neerp.componentpricing.entity.*;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.Enquiry;
import com.aibi.neerp.leadmanagement.entity.NewLeads;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tbl_quotation_lift_detail")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuotationLiftDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lift_quotation_no", length = 100, nullable = false, unique = true)
    private String liftQuotationNo;

    // 🔹 Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quotation_main_id")
    private QuotationMain quotationMain;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id")
    private NewLeads lead;

    @Column(name = "lead_type_id")
    private Integer leadTypeId;

    @Column(name = "lead_date")
    private LocalDateTime leadDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "combined_enquiry_id", referencedColumnName = "id", nullable = false)
    private CombinedEnquiry combinedEnquiry;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enquiry_id")
    private Enquiry enquiry;

    @Column(name = "enquiry_type_id")
    private Integer enquiryTypeId;

    @Column(name = "enquiry_date")
    private LocalDateTime enqDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lift_type_id")
    private OperatorElevator liftType; // operator type

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_of_lift_id")
    private TypeOfLift typeOfLift;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "machine_room_id")
    private MachineRoom machineRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "capacity_type_id")
    private CapacityType capacityType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_capacity_id")
    private PersonCapacity personCapacity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "weight_id")
    private Weight weight;

    private Integer floors;
    private Integer stops;
    private Integer openings;

    private String floorDesignations;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "tbl_quotation_lift_additional_floor_map",
            joinColumns = @JoinColumn(name = "quotation_lift_detail_id"),
            inverseJoinColumns = @JoinColumn(name = "additional_floor_id")
    )
    private List<AdditionalFloors> floorSelections = new ArrayList<>();


    private Double carTravel;
    private Double speed;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cabin_type_id")
    private CabinType cabinType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cabin_subtype_id")
    private CabinSubType cabinSubType;


    // 🔹 Cabin design specs
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "light_fitting_id")
    private LightFitting lightFitting;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cabin_flooring_id")
    private CabinFlooring cabinFlooring;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cabin_ceiling_id")
    private CabinCeiling cabinCeiling;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "air_system_id")
    private AirSystem airSystem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "air_type_id")
    private AirType airType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_entrance_id")
    private CarDoorType carEntrance;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_entrance_subtype_id")
    private CarDoorSubType carEntranceSubType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "landing_entrance_subtype1_id")
    private LandingDoorSubType landingEntranceSubType1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "landing_entrance_subtype2_id")
    private LandingDoorSubType landingEntranceSubType2;

    private Integer landingEntranceCount;
    private Integer landingEntranceSubType2_fromFloor;
    private Integer landingEntranceSubType2_toFloor;

    // 🔹 Cabin design
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "control_panel_type_id")
    private ControlPanelType controlPanelType;

    private String manufacture;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "control_panel_make_id")
    private Manufacture controlPanelMake;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wiring_harness_id")
    private Manufacture wiringHarness;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guide_rail_id")
    private CounterWeight guideRail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bracket_id")
    private Bracket bracket;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roping_type_id")
    private WireRope ropingType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lop_type_id")
    private LopType lopType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cop_type_id")
    private Cop copType;

    private Double overhead;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operation_type_id")
    private OperationType operationType;

    private Double machineRoomDepth;
    private Double machineRoomWidth;

    private Double shaftWidth;
    private Double shaftDepth;
    private Double carInternalWidth;
    private Double carInternalDepth;
    private Double carInternalHeight;

    // 🔹 Feature details
    //It creates a table (tbl_quotation_lift_std_features) with two columns: lift_detail_id and feature_id.When the QuotationLiftDetail is saved, Hibernate automatically manages inserting or updating the records in this join table based on the List<Integer> content.
    @ElementCollection
    @CollectionTable(
            name = "tbl_quotation_lift_std_features", // The new table to store the feature IDs
            joinColumns = @JoinColumn(name = "lift_detail_id") // The foreign key column back to QuotationLiftDetail
    )
    @Column(name = "feature_id") // The column to store the Integer value (the feature ID)
    private List<Integer> stdFeatureIds; // Store feature IDs

    private Boolean autoRescue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vfd_main_drive_id")
    private Manufacture vfdMainDrive;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "door_operator_id")
    private Manufacture doorOperator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "main_machine_set_id")
    private Manufacture mainMachineSet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_rails_id")
    private Manufacture carRails;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "counter_weight_rails_id")
    private Manufacture counterWeightRails;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wire_rope_id")
    private Manufacture wireRope;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warranty_id")
    private Warranty warrantyPeriod;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "installation_rule_id")
    private InstallationRule installationRule;

    private Integer liftQuantity;


    // 🔹 Pricing
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

    private Boolean pwdIncludeExclude;
    private Boolean scaffoldingIncludeExclude;

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


    // 🔹 Price breakdown (tabs)
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

    // 🔹 Other info
    private Double pitDepth;
    private String mainSupplySystem;
    private String auxlSupplySystem;
    private String signals;

    private Boolean isSaved;
    private Boolean isFinalized;

    // 🔹 Quotation metadata
    private LocalDateTime quotationDate;

    @OneToMany(mappedBy = "liftDetail", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuotationLiftMaterial> liftMaterials = new ArrayList<>();

    // 🔹 Relation to Selected Materials
    // Mapped by the field name in SelectedQuotationMaterial ("quotationLiftDetail")
    @OneToMany(mappedBy = "quotationLiftDetail", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SelectedQuotationMaterial> selectedMaterials = new ArrayList<>();
}
