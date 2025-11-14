package com.aibi.neerp.quotation.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_selected_quotation_material")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SelectedQuotationMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "quotation_id", nullable = false) // Links back to QuotationMain
//    private QuotationMain quotationMain;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quotation_lift_detail_id", nullable = false) // Use the correct column name
    private QuotationLiftDetail quotationLiftDetail;

    @Column(name = "lead_id") // Redundant if FK exists, but keeping for DB compatibility
    private Integer leadId;

    @Column(name = "operator_type")
    private Integer operatorType;

    @Column(name = "material_id") // Assuming this is an ID to a master material table
    private Integer materialId;

    @Column(name = "material_name", length = 255, nullable = false)
    private String materialName;

    @Column(name = "material_type", length = 255, nullable = false)
    private String materialType;

    // Use Double for calculations instead of String (as in your DB schema)
    @Column(name = "quantity", nullable = false)
    private Double quantity;

    @Column(name = "material_unit", length = 255)
    private String quantityUnit;

    // Correcting "prize" to "price" and using Double
    @Column(name = "prize", nullable = false)
    private Double price;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null)
            createdAt = LocalDateTime.now();
    }


//    @Transient
//    public Double getTotalAmount() {
//        if (quantity != null && price != null) {
//            return quantity * price;
//        }
//        return 0.0;
//    }

    // Calculated field (transient or derived in service/DTO)

    // Optional: Add mapping to Lead (if necessary)
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "lead_id", insertable = false, updatable = false)
    // private NewLeads lead;
}