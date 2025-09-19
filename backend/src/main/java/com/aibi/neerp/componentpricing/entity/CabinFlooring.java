package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_cabin_flooring")
@Getter
@Setter
public class CabinFlooring {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "flooring_id")
    private int id;

    @NotBlank(message = "Flooring Name cannot be blank") //@NotBlank checks for null + empty + whitespace.
    @Column(name = "flooring_name")
    private String flooringName;

    @NotNull(message = "Cabin Flooring prize cannot be null")
    @Min(value = 1, message = "Cabin Flooring prize must be greater than 0")
    private int price;
}
