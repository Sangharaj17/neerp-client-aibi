package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotNull;



@Entity
@Table(name = "tbl_governor_rope")
@Getter
@Setter
public class GovernorRope {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "governor_name")
    private String governorName;

    @NotNull(message = "Prize is mandatory")
    private Integer prize;

    @ManyToOne
    @JoinColumn(name = "floor_id", referencedColumnName = "id") // FK to tbl_floor
    private Floor floor;

    @NotBlank(message = "Quantity cannot be blank")
    private String quantity;

    @Override
    public String toString() {
        return "GovernorRope{" +
                "id=" + id +
                ", governorName='" + governorName + '\'' +
                ", prize=" + prize +
                ", floor=" + floor +
                ", quantity='" + quantity + '\'' +
                '}';
    }
}
