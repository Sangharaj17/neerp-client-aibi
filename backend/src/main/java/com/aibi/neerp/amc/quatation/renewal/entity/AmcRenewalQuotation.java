package com.aibi.neerp.amc.quatation.renewal.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_amc_renewal_quatation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmcRenewalQuotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "renewl_qua_id")
    private Integer renewalQuaId;
}

