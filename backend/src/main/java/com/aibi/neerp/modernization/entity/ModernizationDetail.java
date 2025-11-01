package com.aibi.neerp.modernization.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.*;

@Entity
@Table(name = "tbl_modern_quot_detail")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModernizationDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mod_quot_detail_id")
    private Integer id;

    // --- Relationship to Modernization ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mod_quot_id", nullable = false)
    private Modernization modernization;

    @Column(name = "material_name", nullable = false, length = 255)
    private String materialName;

    @Column(name = "hsn", nullable = false, length = 255)
    private String hsn;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "uom", length = 50)
    private String uom;

    @Column(name = "rate", precision = 10, scale = 2, nullable = false)
    private BigDecimal rate;

    @Column(name = "amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "guarantee", length = 255)
    private String guarantee;
}
