package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_bracket")
@Getter
@Setter
public class Bracket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "bracket_type", referencedColumnName = "id")
    private BracketType bracketType;

    @NotNull(message = "Bracket price cannot be null")
    @Min(value = 1, message = "Bracket price must be greater than 0")
    private Integer price;

    @ManyToOne
    @JoinColumn(name = "floor_id", referencedColumnName = "id")
    private Floor floor;
}
