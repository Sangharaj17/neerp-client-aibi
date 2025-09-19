package com.aibi.neerp.amc.quatation.renewal.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_revised_renewal_amc_quatation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevisedRenewalAmcQuotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "revised_renewl_id")
    private Integer revisedRenewalId;
}

