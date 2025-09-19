package com.aibi.neerp.amc.quatation.initial.entity;

import com.aibi.neerp.amc.quatation.initial.entity.AmcQuotation;
import com.aibi.neerp.amc.quatation.renewal.entity.AmcRenewalQuotation;
import com.aibi.neerp.amc.quatation.renewal.entity.RevisedRenewalAmcQuotation;
import com.aibi.neerp.leadmanagement.entity.Enquiry;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "tbl_amc_combined_quatation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmcCombinedQuotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    // -------- Foreign Keys --------
    @ManyToOne
    @JoinColumn(name = "amc_quatation_id", referencedColumnName = "amc_quatation_id")
    private AmcQuotation amcQuotation;

    @ManyToOne
    @JoinColumn(name = "enquiry_id", referencedColumnName = "enquiry_id")
    private Enquiry enquiry;

    @ManyToOne
    @JoinColumn(name = "revised_quatation_id", referencedColumnName = "revised_quatation_id")
    private RevisedAmcQuotation revisedQuotation;

    @ManyToOne
    @JoinColumn(name = "renewl_qua_id", referencedColumnName = "renewl_qua_id")
    private AmcRenewalQuotation renewalQuotation;

    @ManyToOne
    @JoinColumn(name = "revised_renewl_id", referencedColumnName = "revised_renewl_id")
    private RevisedRenewalAmcQuotation revisedRenewal;

    // -------- Fields --------
    @Column(name = "amount", precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "gst_amount", precision = 10, scale = 2)
    private BigDecimal gstAmount;

    @Column(name = "total_amount", precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "amount_ordinary", precision = 10, scale = 2)
    private BigDecimal amountOrdinary;

    @Column(name = "amount_semi", precision = 10, scale = 2)
    private BigDecimal amountSemi;

    @Column(name = "amount_comp", precision = 10, scale = 2)
    private BigDecimal amountComp;

    @Column(name = "gst_ordinary", precision = 10, scale = 2)
    private BigDecimal gstOrdinary;

    @Column(name = "gst_semi", precision = 10, scale = 2)
    private BigDecimal gstSemi;

    @Column(name = "gst_comp", precision = 10, scale = 2)
    private BigDecimal gstComp;

    @Column(name = "total_amount_ordinary", precision = 10, scale = 2)
    private BigDecimal totalAmountOrdinary;

    @Column(name = "total_amount_semi", precision = 10, scale = 2)
    private BigDecimal totalAmountSemi;

    @Column(name = "total_amount_comp", precision = 10, scale = 2)
    private BigDecimal totalAmountComp;
}
