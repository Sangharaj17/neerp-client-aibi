package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "tbl_wire_rope")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WireRope {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull(message = "Wire Rope Type must be selected")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wire_rope_type", nullable = false)
    private WireRopeType wireRopeType;

    @NotNull(message = "Operator Type must be selected")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operator_type", referencedColumnName = "id", nullable = false)
    private OperatorElevator operatorElevator;

    @NotNull(message = "Floor must be selected")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "floor", referencedColumnName = "id", nullable = false)
    private Floor floor;

    @NotNull(message = "Wire rope quantity is required")
    @Column(name = "wire_rope_qty", nullable = false)
    private Integer wireRopeQty;

    @NotNull(message = "Price is required")
    @Column(name = "price", nullable = false)
    private Integer price;
}
