package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(
        name = "tbl_light_fittings",
        uniqueConstraints = {@UniqueConstraint(columnNames = "name")}
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LightFitting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Light Fitting name cannot be blank")
    @Column(nullable = false, unique = true)
    private String name;

    @NotNull(message = "Price is required")
    @Min(value = 1, message = "Price must be greater than 0")
    @Column(nullable = false)
    private Double price;
}
