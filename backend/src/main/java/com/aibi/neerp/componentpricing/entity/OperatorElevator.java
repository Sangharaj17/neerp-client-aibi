package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_operator_elevator")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OperatorElevator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 255, unique = true)
    private String name;
}
