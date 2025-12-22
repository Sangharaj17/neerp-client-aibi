package com.aibi.neerp.amc.quatation.pdf.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_css_style")
@Getter
@Setter
public class CssStyle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Changed to String to support units (e.g., "10px", "2em")
    // If you strictly want numbers, keep them as Double but usually CSS needs units.
    @Column(name = "padding_top")
    private String paddingTop;

    @Column(name = "padding_bottom")
    private String paddingBottom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "amc_quotation_pdf_headings_id")
    private AmcQuotationPdfHeadings amcQuotationPdfHeadings;
}