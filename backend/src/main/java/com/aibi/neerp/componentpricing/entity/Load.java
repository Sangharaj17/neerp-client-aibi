package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_load")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Load {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Double loadAmount;  // amount in kg or other unit

    @Column(length = 255)
    private String description;
}
