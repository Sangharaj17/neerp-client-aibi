package com.aibi.neerp.leadmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_build_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BuildType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", length = 255, nullable = false)
    private String name;
}
