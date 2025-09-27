package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_speed")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Speed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private Double value; // e.g. 0.25, 0.30, 0.50 etc.
}

