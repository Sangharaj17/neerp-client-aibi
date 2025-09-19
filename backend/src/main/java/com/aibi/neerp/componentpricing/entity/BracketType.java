package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_bracket_type")
@Getter
@Setter
public class BracketType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotNull(message = "Bracket Type can not be blank")
    private String name; // Example: "GP BRACKET", "COMBINATION BRACKET"
}
