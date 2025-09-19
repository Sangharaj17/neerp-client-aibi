package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_cabin_ceiling")
@Getter
@Setter
public class CabinCeiling {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ceiling_id")
    private int id;

    @NotBlank(message = "Ceiling Name cannot be blank") //@NotBlank checks for null + empty + whitespace.
    @Column(name = "ceiling_name")
    private String ceilingName;

    @NotNull(message = "Cabin Ceiling prize cannot be null")
    @Min(value = 1, message = "Cabin Ceiling prize must be greater than 0")
    private Integer price;
}
