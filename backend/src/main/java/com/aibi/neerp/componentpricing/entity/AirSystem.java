package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tbl_air_system")
@Getter
@Setter
public class AirSystem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "air_system_id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "air_type_id", referencedColumnName = "id")
    private AirType airType;

//    @NotBlank(message = "Air System name cannot be blank")
//    @Column(name = "air_system_name")
//    private String airSystemName;

    @NotNull(message = "Capacity Type must be selected")
    @ManyToOne
    @JoinColumn(name = "capacity_type", referencedColumnName = "id")
    private CapacityType capacityType;

    @ManyToOne
    @JoinColumn(name = "person_capacity_id", referencedColumnName = "id")
    private PersonCapacity personCapacity;

    @ManyToOne
    @JoinColumn(name = "weight_id", referencedColumnName = "id")
    private Weight weight;

    @NotNull(message = "Prize is required")
    private int price;

    private String quantity;
}
