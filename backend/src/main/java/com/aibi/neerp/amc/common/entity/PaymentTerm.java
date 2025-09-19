package com.aibi.neerp.amc.common.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_payment_term")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentTerm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "term_name", nullable = false, length = 255)
    private String termName;

    @Column(name = "description", length = 500)
    private String description;

}
