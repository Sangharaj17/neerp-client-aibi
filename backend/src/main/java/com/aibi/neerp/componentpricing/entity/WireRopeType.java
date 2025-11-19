package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "tbl_wire_rope_type", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"operator_type_id", "wire_rope_size", "wire_rope_type"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WireRopeType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Machine type must be selected")
    @ManyToOne
    @JoinColumn(name = "machine_type", referencedColumnName = "lift_type_id", nullable = false)
    private TypeOfLift machineType;

    @Column(name = "wire_rope_size", nullable = false)
    private Double wireRopeSize;

    @Column(name = "wire_rope_type", nullable = false)
    private String wireRopeType;
}
