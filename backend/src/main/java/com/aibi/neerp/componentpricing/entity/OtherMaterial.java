package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
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

    @NotNull(message = "Material type is required")
    @Column(name = "material_type", nullable = false)
    private String materialType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operator_type")
    private OperatorElevator operatorType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "machine_room_id", referencedColumnName = "lift_type_id")
    private TypeOfLift machineRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "capacity_type", nullable = false)
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

    @NotNull(message = "Price is required")
    @Column(name = "price", nullable = false)
    private Integer price;
}
