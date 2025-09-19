package com.aibi.neerp.amc.common.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_number_of_service")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NumberOfService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Integer value; // 1, 2, 3, 4
}
