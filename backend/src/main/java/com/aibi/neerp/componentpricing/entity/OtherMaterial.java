package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
//@Table(
//        name = "tbl_other_material",
//        uniqueConstraints = {
//                @UniqueConstraint(
//                        name = "uk_other_material_combination",
//                        columnNames = {
//                                "operator_type",
//                                "material_type",
//                                "capacity_type",
//                                "person_capacity_id",
//                                "weight_id",
//                                "machine_room_id"
//                        }
//                )
//        }
//)
@Table(name = "tbl_other_material")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtherMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull(message = "Material main type is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "other_material_main_id", nullable = false)
    private OtherMaterialMain otherMaterialMain;

    @NotNull(message = "Material name is required")
    @Column(name = "other_material_name", nullable = false)
    private String otherMaterialName;

    @NotNull(message = "Material display name is required")
    @Column(name = "other_material_display_name", nullable = false)
    private String otherMaterialDisplayName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operator_type")
    private OperatorElevator operatorType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "machine_room_id", referencedColumnName = "lift_type_id")
    private TypeOfLift machineRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "capacity_type")
    private CapacityType capacityType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_capacity_id")
    private PersonCapacity personCapacity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "weight_id")
    private Weight weight;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "floors")
    private Floor floors;

    @NotNull(message = "Quantity is required")
    @Column(name = "quantity", nullable = false)
    private String quantity;

    @Column(name = "quantity_unit")
    private String quantityUnit;

    @NotNull(message = "Price is required")
    @Column(name = "price", nullable = false)
    private Integer price;
}
