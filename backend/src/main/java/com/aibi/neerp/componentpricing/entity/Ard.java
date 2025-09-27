package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_ard")
@Getter
@Setter
public class Ard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "Ard Type cannot be blank")
    @Column(name = "ard_device")
    private String ardDevice;

    @NotNull(message = "Ard prize cannot be null")
    @Min(value = 1, message = "Ard prize must be greater than 0")
    private Integer price;

    @ManyToOne
    @JoinColumn(name = "capacity_type", referencedColumnName = "id")
    private CapacityType capacityType;

    @ManyToOne
    @JoinColumn(name = "person_capacity_id", referencedColumnName = "id")
    private PersonCapacity personCapacity;

    @ManyToOne
    @JoinColumn(name = "weight_id", referencedColumnName = "id")
    private Weight weight;

    @NotNull(message = "Operator Type must be selected")
    @ManyToOne
    @JoinColumn(name = "operator_type", referencedColumnName = "id")
    private OperatorElevator operatorElevator;

}
