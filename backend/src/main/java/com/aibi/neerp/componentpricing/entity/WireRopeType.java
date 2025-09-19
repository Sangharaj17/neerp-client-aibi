package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_wire_rope_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WireRopeType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "wire_rope_type", nullable = false, unique = true)
    private String wireRopeType;
}
