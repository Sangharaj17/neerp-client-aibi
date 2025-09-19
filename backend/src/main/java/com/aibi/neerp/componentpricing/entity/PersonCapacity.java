package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_person_capacity")
@Getter
@Setter
public class PersonCapacity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "person_count", nullable = false)
    private Integer personCount;

    @Column(name = "label", nullable = false)
    private String label;

    @Column(name = "individualWeight", nullable = false)
    private Integer individualWeight;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id", nullable = false)
    private Unit unit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "capacity_type_id", nullable = false)
    private CapacityType capacityType;

    @Transient
    public String getDisplayName() {
        if (personCount == null || label == null || individualWeight == null || unit == null || unit.getUnitName() == null) {
            return "";
        }
        int totalWeight = personCount * individualWeight;
        return String.format("%02d %s/ %d %s", personCount, label, totalWeight, unit.getUnitName());
    }
}
