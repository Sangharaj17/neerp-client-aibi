// Entity: NewCounterWeight.java
package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_new_counter_weight")
@Getter
@Setter
public class NewCounterWeight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "Counter Weight name cannot be blank")
    @Column(name = "new_counter_weight_name")
    private String newCounterWeightName;

    @ManyToOne
    @JoinColumn(name = "capacity_type", referencedColumnName = "id")
    @NotNull(message = "Capacity Type must be selected")
    private CapacityType capacityType;

    @ManyToOne
    @JoinColumn(name = "person_capacity_id", referencedColumnName = "id")
    private PersonCapacity personCapacity;

    @ManyToOne
    @JoinColumn(name = "weight_id", referencedColumnName = "id")
    private Weight weight;

    @NotBlank(message = "Quantity cannot be blank")
    private String quantity;

    @NotNull(message = "Price cannot be null")
    @Min(value = 1, message = "Price must be greater than 0")
    private Integer price;
}
