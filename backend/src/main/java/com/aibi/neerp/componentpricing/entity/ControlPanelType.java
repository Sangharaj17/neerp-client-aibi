package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_control_panel_type")
@Getter
@Setter
public class ControlPanelType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Control panel type name cannot be blank")
    @Column(name = "control_panel_type")
    private String controlPanelType;

    @NotNull(message = "Machine type must be selected")
    @ManyToOne
    @JoinColumn(name = "machine_type", referencedColumnName = "lift_type_id", nullable = false)
    private TypeOfLift machineType;

    @NotNull(message = "Operator type must be selected")
    @ManyToOne
    @JoinColumn(name = "operator_type", referencedColumnName = "id")
    private OperatorElevator operatorType;

    @NotNull(message = "Capacity type must be selected")
    @ManyToOne
    @JoinColumn(name = "capacity_type", referencedColumnName = "id")
    private CapacityType capacityType;

    //@NotNull(message = "Person capacity must be selected")
    @ManyToOne
    @JoinColumn(name = "person_capacity_id", referencedColumnName = "id")
    private PersonCapacity personCapacity;

    //@NotNull(message = "Weight must be selected")
    @ManyToOne
    @JoinColumn(name = "weight_id", referencedColumnName = "id")
    private Weight weight;

    @NotNull(message = "Price is required")
    private int price;
}
