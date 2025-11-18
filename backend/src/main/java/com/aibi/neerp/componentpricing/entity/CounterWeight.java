package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "tbl_counter_weight", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"counter_weight_type", "floors"})
})
//@Table(name = "tbl_counter_weight")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CounterWeight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "counter_weight_name")
    private String counterWeightName;

    @NotNull(message = "Counter Weight Type is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "counter_weight_type", referencedColumnName = "id", nullable = false)
    private CounterWeightType counterWeightType;

    @ManyToOne
    @JoinColumn(name = "operator_type", referencedColumnName = "id", nullable = false)
    @NotNull(message = "Operator Type is mandatory")
    private OperatorElevator operatorType;

    @NotNull(message = "Floors is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "floors", referencedColumnName = "id", nullable = false)
    private Floor floors;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price must be a positive number")
    @Column(name = "price")
    private Integer price;
}
