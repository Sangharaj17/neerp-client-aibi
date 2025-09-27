package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_capacity_dimensions")
@Getter
@Setter
public class CapacityDimensions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Reference to tbl_capacity_type
    @NotNull(message = "Capacity Type must be selected")
    @ManyToOne
    @JoinColumn(name = "capacity_type", referencedColumnName = "id", nullable = true)
    private CapacityType capacityType;

    // Reference to tbl_person_capacity
    @ManyToOne
    @JoinColumn(name = "person_capacity_id", referencedColumnName = "id", nullable = true)
    private PersonCapacity personCapacity;

    // Reference to tbl_weight
    @ManyToOne
    @JoinColumn(name = "weight_id", referencedColumnName = "id", nullable = true)
    private Weight weight;

    @Column(nullable = false)
    private Integer shaftsWidth;

    @Column(nullable = false)
    private Integer shaftsDepth;

    @Column(nullable = false)
    private Integer reqMachineWidth;

    @Column(nullable = false)
    private Integer reqMachineDepth;

    @Column(nullable = false)
    private Integer carInternalWidth;

    @Column(nullable = false)
    private Integer carInternalDepth;
}
