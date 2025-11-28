package com.aibi.neerp.userresource.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "tbl_tax_type")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaxType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tax_type_id")
    private Integer taxTypeId;

    @Column(name = "tax_name", nullable = false, length = 255)
    private String taxName;

    @Column(name = "tax_percentage", nullable = false)
    private Double taxPercentage;
}

