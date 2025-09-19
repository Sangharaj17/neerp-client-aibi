package com.aibi.neerp.location.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@Entity
@Table(name = "states",
       uniqueConstraints = @UniqueConstraint(name = "uk_state_name", columnNames = "name"))
public class State {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // e.g., "Maharashtra", "Delhi"
    @Column(nullable = false, length = 100)
    private String name;

    // "STATE" or "UT"
    @Column(nullable = false, length = 100)
    private String type; // STATE / UT
}
