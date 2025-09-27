package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(
        name = "tbl_counter_frame",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {
                        "counter_frame_type",
                        "capacity_type",
                        "person_capacity_id",
                        "weight_id",
                        "operator_type"
                }
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CounterFrameType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Foreign Key to tbl_wire_rope.id
    @NotNull(message = "Counter Frame Type (Wire Rope) is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "counter_frame_type", referencedColumnName = "id", nullable = false)
    private WireRopeType counterFrameType;

    @NotNull(message = "Capacity Type is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "capacity_type", referencedColumnName = "id", nullable = false)
    private CapacityType capacityType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_capacity_id", referencedColumnName = "id")
    private PersonCapacity personCapacity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "weight_id", referencedColumnName = "id")
    private Weight weight;

    @NotNull(message = "Operator Type must be selected")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operator_type", referencedColumnName = "id", nullable = false)
    private OperatorElevator operatorElevator;

    @NotNull(message = "Price cannot be null")
    @Min(value = 1, message = "Price must be greater than 0")
    @Column(name = "price", nullable = false)
    private Integer price;
}
