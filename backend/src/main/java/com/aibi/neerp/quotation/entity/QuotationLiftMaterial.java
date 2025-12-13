package com.aibi.neerp.quotation.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "tbl_quotation_lift_material") // New table
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuotationLiftMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 💡 CRITICAL LINK: Foreign key to the QuotationLiftDetail
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quotation_lift_detail_id", nullable = false)
    private QuotationLiftDetail liftDetail;

    // 💡 FIELD TO DISTINGUISH LISTS: 'Manual' or 'Common'
    @Column(name = "material_list_type", length = 20, nullable = false)
    private String listType; // e.g., "MANUAL", "COMMON"

    // --- Core Material Details (from DTO) ---

    @Column(name = "other_material_name", length = 255)
    private String otherMaterialName;

    // Matches DTO's otherMaterialMainId
    @Column(name = "material_main_id")
    private Long otherMaterialMainId;

    // Matches DTO's otherMaterialMainName
    @Column(name = "material_main_name", length = 255)
    private String otherMaterialMainName;

    // Matches DTO's otherMaterialMainActive
    @Column(name = "material_main_active")
    private Boolean otherMaterialMainActive;

    // Matches DTO's otherMaterialMainRule (Keeping as String/Varchar is common for rules/JSON in DB)
    @Column(name = "material_main_rule", columnDefinition = "text")
    private String otherMaterialMainRule;

    // Matches DTO's otherMaterialMainIsSystemDefined
    @Column(name = "material_main_is_system_defined")
    private Boolean otherMaterialMainIsSystemDefined;

    // --- Pricing & Quantity ---

    @Column(name = "quantity")
    private String quantity; // Kept as String to match DTO

    @Column(name = "price")
    private Double price; // Kept as Double for actual price storage

    // --- Optional Configuration Fields (Mapped for completeness, even if null) ---

    @Column(name = "operator_type_id")
    private Long operatorTypeId; // Assuming Long ID type

    @Column(name = "operator_type_name", length = 100)
    private String operatorTypeName;

    @Column(name = "machine_room_id")
    private Long machineRoomId;

    @Column(name = "machine_room_name", length = 100)
    private String machineRoomName;

    @Column(name = "capacity_type_id")
    private Long capacityTypeId;

    @Column(name = "capacity_type_name", length = 100)
    private String capacityTypeName;

    @Column(name = "person_capacity_id")
    private Long personCapacityId;

    @Column(name = "person_capacity_name", length = 100)
    private String personCapacityName;

    @Column(name = "weight_id")
    private Long weightId;

    @Column(name = "weight_name", length = 100)
    private String weightName;

    @Column(name = "floors")
    private Integer floors; // Changed from String in DTO to Integer/Number type

    @Column(name = "floors_label", length = 100)
    private String floorsLabel;

}