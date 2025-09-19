package com.aibi.neerp.leadmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_contracts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contract_id")
    private Integer id;

    @Column(name = "contract_name", nullable = false)
    private String name;

}
