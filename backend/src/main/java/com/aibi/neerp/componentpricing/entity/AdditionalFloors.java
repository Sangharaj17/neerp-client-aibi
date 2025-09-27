package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_additional_floor")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdditionalFloors {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Code like T, B1, B2
    @Column(name = "code", nullable = false, unique = true, length = 20)
    private String code;

    // Label like Terrace, Basement 1
    @Column(name = "label", nullable = false, length = 100)
    private String label;
}
