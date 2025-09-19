package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_harness")
@Getter
@Setter
public class Harness {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "harness_id")
    private int id;

    @NotBlank(message = "Harness name cannot be blank")
    @Column(name = "harness_name")
    private String name;

    @NotNull(message = "Harness price cannot be null")
    @Min(value = 1, message = "Harness price must be greater than 0")
    @Column(name = "harness_price")
    private Integer price;

    @NotNull(message = "Floor must be selected")
    @ManyToOne
    @JoinColumn(name = "floors", referencedColumnName = "id")
    private Floor floor;
}
