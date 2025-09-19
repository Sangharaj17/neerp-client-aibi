package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "tbl_counter_weight")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CounterWeight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "counter_frame_name")
    private String counterFrameName;

    @NotNull(message = "Type of Lift is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_of_lift", referencedColumnName = "lift_type_id", nullable = false)
    private TypeOfLift typeOfLift;

    @NotNull(message = "Counter Frame Type is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "counter_frame_type", referencedColumnName = "id", nullable = false)
    private CounterFrameType counterFrameType;

    @NotNull(message = "Floors is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "floors", referencedColumnName = "id", nullable = false)
    private Floor floors;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price must be a positive number")
    @Column(name = "price")
    private Integer price;
}
