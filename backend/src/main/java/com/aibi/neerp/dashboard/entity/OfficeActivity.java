package com.aibi.neerp.dashboard.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "tbl_office_activity")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OfficeActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "purpose", nullable = false, length = 256)
    private String purpose;

    @Column(name = "todo_date", nullable = false)
    private LocalDate todoDate;

    @Column(name = "status", nullable = false)
    private Integer status;
}

