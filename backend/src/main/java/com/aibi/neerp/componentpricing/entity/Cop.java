package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_cop")
@Getter
@Setter
public class Cop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "COP Type Name cannot be blank")
    @Column(name = "cop_name")
    private String copName;

    @ManyToOne
    @JoinColumn(name = "operator_type", referencedColumnName = "id", nullable = false)
    @NotNull(message = "Operator Type is mandatory")
    private OperatorElevator operatorType;

    @ManyToOne
    @JoinColumn(name = "floors", referencedColumnName = "id", nullable = false)
    //@NotNull(message = "Floor is mandatory")
    private Floor floor;

    //@Min(value = 1, message = "Prize must be greater than 0")
    @Column(name = "price", nullable = true)
    private Integer price; // Use Integer to allow null

    //@NotBlank(message = "COP Type cannot be blank")
    @Column(name = "cop_type")
    private String copType;
}
