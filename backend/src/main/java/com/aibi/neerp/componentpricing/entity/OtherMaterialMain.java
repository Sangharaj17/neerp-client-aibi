package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_other_material_main")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtherMaterialMain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "material_main_type", nullable = false, unique = true)
    private String materialMainType;

    @Column(name = "active", nullable = false)
    private Boolean active = true;   // true / false

    @Column(name = "rule_expression")
    private String ruleExpression;

    @Column(nullable = false)
    private boolean isSystemDefined = false;
}
