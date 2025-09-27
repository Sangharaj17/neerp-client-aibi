package com.aibi.neerp.customer.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_site")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Site {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "site_id")
    private Integer siteId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "site_name", nullable = false, length = 255)
    private String siteName;

    @Column(name = "site_address", nullable = true, length = 255)
    private String siteAddress;

    @Column(name = "status", length = 250)
    private String status;
}

