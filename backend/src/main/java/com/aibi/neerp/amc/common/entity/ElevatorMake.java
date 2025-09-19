package com.aibi.neerp.amc.common.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_elevator_make")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ElevatorMake {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name; // e.g., KONE, Schindler, Otis, etc.
}
