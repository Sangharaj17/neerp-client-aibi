package com.aibi.neerp.amc.materialrepair.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "tbl_mod_quot_detail")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuotationDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer modQuotDetailId; // PK: mod_quot_detail_id

    private String materialName; // material_name
    private String hsn; // hsn
    private Integer quantity; // quantity
    private BigDecimal rate; // rate
    private BigDecimal amount; // amount
    private String guarantee; // guarantee

    // Many QuotationDetails belong to One MaterialQuotation
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mod_quot_id", nullable = false) // FK: mod_quot_id
    @ToString.Exclude
    private MaterialQuotation materialQuotation;
}
