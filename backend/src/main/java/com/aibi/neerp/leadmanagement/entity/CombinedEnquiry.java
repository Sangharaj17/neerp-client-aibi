package com.aibi.neerp.leadmanagement.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_combined_enquiry")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CombinedEnquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "lead_id", referencedColumnName = "lead_id")
    private NewLeads lead;
    
    @ManyToOne   
    @JoinColumn(name = "enquiry_type", referencedColumnName = "enquiry_type_id")
    private EnquiryType enquiryType; // ✅ Added foreign key field

    @Column(name = "project_name", length = 255)
    private String projectName; // ✅ Added plain string field
    
    @Column(name = "site_name", length = 255)
    private String siteName; // ✅ Added plain string field
   
    
    @Column(name = "created_date", nullable = true)
    private LocalDate createdDate;
    
    @OneToMany(mappedBy = "combinedEnquiry", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Enquiry> enquiries;
}
