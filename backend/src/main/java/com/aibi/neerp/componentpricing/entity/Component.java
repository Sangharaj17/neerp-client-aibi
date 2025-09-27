package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_components")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Component {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;
}

