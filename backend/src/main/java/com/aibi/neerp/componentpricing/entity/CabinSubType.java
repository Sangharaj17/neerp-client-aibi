package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_cabin_subtype")
@Getter
@Setter
public class CabinSubType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // Reference to tbl_cabin_type
    @NotNull(message = "Cabin Type must be selected")
    @ManyToOne
    @JoinColumn(name = "cabin_name", referencedColumnName = "id")
    private CabinType cabinType;

    @NotBlank(message = "Cabin Sub Name cannot be blank")
    @Column(name = "cabin_sub_name")
    private String cabinSubName;

    @NotNull(message = "Prize cannot be null")
    @Min(value = 1, message = "Prize must be greater than 0")
    private Integer prize;

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

//    // The ID of the actual value in the corresponding table (e.g., tbl_person_capacity)
//    @Column(name = "capacity_value_id", nullable = false)
//    private Integer capacityValueId;

}
