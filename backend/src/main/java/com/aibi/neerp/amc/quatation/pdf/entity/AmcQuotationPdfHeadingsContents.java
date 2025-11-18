package com.aibi.neerp.amc.quatation.pdf.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_amc_quotation_pdf_headings_contents")
@Getter
@Setter
public class AmcQuotationPdfHeadingsContents {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(columnDefinition = "TEXT")
    private String contentData;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String picture;   // base64 or long text

    @ManyToOne
    @JoinColumn(name = "heading_id", nullable = false)
    private AmcQuotationPdfHeadings amcQuotationPdfHeadings;
}

