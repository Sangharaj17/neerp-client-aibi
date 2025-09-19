package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_lop_type")
@Getter
@Setter
public class LopType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Lop Name cannot be blank")
    @Column(name = "lop_name")
    private String lopName;


    @NotNull(message = "Operator Type must be selected")
    @ManyToOne
    @JoinColumn(name = "operator_type", referencedColumnName = "id")
    private OperatorElevator operatorType;
}
