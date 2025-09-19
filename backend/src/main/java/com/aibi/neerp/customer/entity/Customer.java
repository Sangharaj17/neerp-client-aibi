package com.aibi.neerp.customer.entity;


import com.aibi.neerp.leadmanagement.entity.NewLeads;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "tbl_customer")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Integer customerId;

    @Column(name = "customer_name", nullable = false, length = 255)
    private String customerName;

    @Column(name = "new_customer_name", length = 255)
    private String newCustomerName;

    @Column(name = "contact_number", nullable = false, length = 255)
    private String contactNumber;

    @Column(name = "gst_no", length = 255)
    private String gstNo;

    @Column(name = "email_id", nullable = false, length = 255)
    private String emailId;

    @Column(name = "address", nullable = false, length = 255)
    private String address;

    @Column(name = "is_verified")
    private Boolean isVerified;

    @Column(name = "active")
    private Boolean active;

    // 🔑 Foreign Key Relationship with NewLeads
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", referencedColumnName = "lead_id")
    private NewLeads lead;

    // 🔑 One-to-Many Relationship with Site
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Site> sites;
}

