package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_bracket", uniqueConstraints = {
        @UniqueConstraint(
                name = "UC_BRACKET_SUBTYPE_FLOOR",
                columnNames = {"bracket_type", "floor_id", "car_bracket_sub_type"}
        )
})
@Getter
@Setter
public class Bracket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "bracket_type", referencedColumnName = "id")
    private BracketType bracketType;

    @NotBlank(message = "Car Bracket Sub Type is mandatory")
    @Column(name = "car_bracket_sub_type", nullable = false)
    private String carBracketSubType;

    @NotNull(message = "Bracket price cannot be null")
    @Min(value = 1, message = "Bracket price must be greater than 0")
    private Integer price;

    @ManyToOne
    @JoinColumn(name = "floor_id", referencedColumnName = "id")
    private Floor floor;
}
