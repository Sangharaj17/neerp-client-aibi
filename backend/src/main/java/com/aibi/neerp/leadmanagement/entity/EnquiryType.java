package com.aibi.neerp.leadmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_enquiry_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EnquiryType {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "enquiry_type_id")
    private Integer enquiryTypeId;

    @Column(name = "enquiry_type_name", nullable = false, length = 100)
    private String enquiryTypeName;
}
