package com.aibi.neerp.location.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@Entity
@Table(name = "cities",
       uniqueConstraints = @UniqueConstraint(name = "uk_state_city", columnNames = {"state_id","name"}))
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // e.g., "Pune"
    @Column(nullable = false, length = 120)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "state_id",
        foreignKey = @ForeignKey(name = "fk_city_state"))
    private State state;
}
