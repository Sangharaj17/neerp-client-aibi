package com.aibi.neerp.leadmanagement.entity;

import com.aibi.neerp.componentpricing.entity.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

//import com.aibi.neerp.materialmanagement.entity.CabinType;
//import com.aibi.neerp.materialmanagement.entity.CapacityType;
//import com.aibi.neerp.materialmanagement.entity.Floor;
//import com.aibi.neerp.materialmanagement.entity.MachineRoom;
//import com.aibi.neerp.materialmanagement.entity.OperatorElevator;
//import com.aibi.neerp.materialmanagement.entity.PersonCapacity;
//import com.aibi.neerp.materialmanagement.entity.TypeOfLift;
//import com.aibi.neerp.materialmanagement.entity.Weight;

//import com.aibi.neerp.componentpricing.*;


@Entity
@Table(name = "tbl_enquiry")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Enquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "enquiry_id")
    private Integer enquiryId;

    @Column(name = "enq_date")
    private LocalDateTime enqDate;

    @ManyToOne
    @JoinColumn(name = "lead_id", referencedColumnName = "lead_id")
    private NewLeads lead;

    @ManyToOne
    @JoinColumn(name = "enquiry_type", referencedColumnName = "enquiry_type_id")
    private EnquiryType enquiryType;

    @ManyToOne
    @JoinColumn(name = "type_of_lift", referencedColumnName = "lift_type_id")
    private TypeOfLift typeOfLift;

    @ManyToOne
    @JoinColumn(name = "lift_type", referencedColumnName = "id")
    private OperatorElevator liftType;

    @ManyToOne
    @JoinColumn(name = "cabin_type", referencedColumnName = "id")
    private CabinType cabinType;

    @ManyToOne
    @JoinColumn(name = "no_of_lift", referencedColumnName = "id")
    private LiftQuantity noOfLift;

    @ManyToOne
    @JoinColumn(name = "capacity_term", referencedColumnName = "id")
    private CapacityType capacityTerm;

    @ManyToOne
    @JoinColumn(name = "person_capacity", referencedColumnName = "id")
    private PersonCapacity personCapacity;

    @ManyToOne
    @JoinColumn(name = "weight_id", referencedColumnName = "id", nullable = true)
    private Weight weight;

    @Column(name = "no_of_stops", length = 255)
    private String noOfStops;

    @Column(name = "no_of_openings", length = 255)
    private String noOfOpenings;

    @ManyToOne
    @JoinColumn(name = "no_of_floors", referencedColumnName = "id")
    private Floor noOfFloors;

    @Column(name = "park_floor", length = 255)
    private String parkFloor;

//    @ManyToOne
//    @JoinColumn(name = "floors_designation_id", referencedColumnName = "floor_designation_id")
//    private FloorDesignation floorsDesignation;

    @Column(name = "floors_designations", length = 255)
    private String floorsDesignation;

    @ManyToMany
    @JoinTable(
            name = "tbl_enquiry_additional_floor",
            joinColumns = @JoinColumn(name = "enquiry_id"),
            inverseJoinColumns = @JoinColumn(name = "additional_floor_id")
    )
    private java.util.Set<AdditionalFloors> additionalFloors = new java.util.HashSet<>();

    @ManyToOne
    //@JoinColumn(name = "req_machine_room", referencedColumnName = "machine_room_id")
    @JoinColumn(name = "req_machine_room", referencedColumnName = "id")
    private MachineRoom reqMachineRoom;

    @Column(name = "shafts_width", length = 255)
    private String shaftsWidth;

    @Column(name = "shafts_depth", length = 255)
    private String shaftsDepth;

    @Column(name = "project_rate", length = 255)
    private String projectRate;

    @ManyToOne
    @JoinColumn(name = "project_stage", referencedColumnName = "id")
    private ProjectStage projectStage;

    @ManyToOne
    @JoinColumn(name = "build_type", referencedColumnName = "id")
    private BuildType buildType;

    @ManyToOne
    @JoinColumn(name = "building_type", referencedColumnName = "building_type_id")
    private BuildingType buildingType;

    @Column(name = "req_machine_width", length = 255)
    private String reqMachineWidth;

    @Column(name = "req_machine_depth", length = 255)
    private String reqMachineDepth;

    @Column(name = "car_internal_width", length = 255)
    private String carInternalWidth;

    @Column(name = "car_internal_depth", length = 255)
    private String carInternalDepth;

    @Column(name = "product1", length = 255)
    private String product1;

    @Column(name = "product2", length = 255)
    private String product2;

    @Column(name = "product3", length = 255)
    private String product3;

    @Column(name = "product4", length = 255)
    private String product4;

    @Column(name = "product5", length = 255)
    private String product5;

    @Column(name = "machine1", length = 255)
    private String machine1;

    @Column(name = "machine2", length = 255)
    private String machine2;

    @Column(name = "machine3", length = 255)
    private String machine3;

    @Column(name = "machine4", length = 255)
    private String machine4;

    @Column(name = "machine5", length = 255)
    private String machine5;

    @Column(name = "landing1", length = 255)
    private String landing1;

    @Column(name = "landing2", length = 255)
    private String landing2;

    @Column(name = "landing3", length = 255)
    private String landing3;

    @Column(name = "landing4", length = 255)
    private String landing4;

    @Column(name = "landing5", length = 255)
    private String landing5;

    @Column(name = "price1", length = 255)
    private String price1;

    @Column(name = "price2", length = 255)
    private String price2;

    @Column(name = "price3", length = 255)
    private String price3;

    @Column(name = "price4", length = 255)
    private String price4;

    @Column(name = "price5", length = 255)
    private String price5;

    @Column(name = "pit")
    private Integer pit;

    @Column(name = "follows")
    private Integer from;

    @Column(name = "checked")
    private Boolean checked;
    
    // Note: Temporarily using explicit column name for production compatibility
    // Once DatabaseColumnNamingFixer renames liftname → lift_name in production, this can be removed
    @Column(name = "liftname")
    private String liftName;

    @ManyToOne
    @JoinColumn(name = "combined_enquiry_id", referencedColumnName = "id")
    private CombinedEnquiry combinedEnquiry;
}

