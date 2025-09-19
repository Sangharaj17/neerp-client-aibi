package com.aibi.neerp.amc.common.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_contract_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContractType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name; // Non-Comprehensive, Semi-Comprehensive, Comprehensive
}
