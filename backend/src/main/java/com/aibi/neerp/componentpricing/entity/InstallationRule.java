package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "tbl_installation_rules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InstallationRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lift_type", nullable = false)
    private Integer liftType; // e.g. 1, 2

//    @Column(name = "floor_limits", nullable = false, length = 255)
//    private String floorLimits; // e.g. "G+1,G+2,G+3,G+4"

//    @ElementCollection
//    @CollectionTable(name = "tbl_installation_rule_floors", joinColumns = @JoinColumn(name = "rule_id"))
//    @Column(name = "floor")
//    private List<String> floorLimits;

    // ✅ Many-to-Many with Floor
    @ManyToMany
    @JoinTable(
            name = "tbl_installation_rule_floors", // join table
            joinColumns = @JoinColumn(name = "rule_id"), // FK to InstallationRule
            inverseJoinColumns = @JoinColumn(name = "floor_id") // FK to Floor
    )
    private List<Floor> floorLimits;


    @Column(name = "base_amount", nullable = false)
    private Double baseAmount;

    @Column(name = "extra_amount", nullable = false)
    private Double extraAmount;
}
