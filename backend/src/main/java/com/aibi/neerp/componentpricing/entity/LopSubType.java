package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_lop_subtype")
@Getter
@Setter
public class LopSubType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "LOP Name cannot be blank")
    @Column(name = "lop_name")
    private String lopName;

    @NotNull(message = "Prize cannot be null")
    @Min(value = 1, message = "Price must be greater than 0")
    private Integer price;

    @ManyToOne
    @JoinColumn(name = "floors", referencedColumnName = "id")
    @NotNull(message = "Floor must be selected")
    private Floor floor;

    @ManyToOne
    @JoinColumn(name = "lop_type", referencedColumnName = "id")
    @NotNull(message = "LOP Type must be selected")
    private LopType lopType;
}
