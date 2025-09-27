package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(
        name = "tbl_fastener",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"floors"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fastener {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "fastener_name", nullable = false)
    private String fastenerName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "floors", referencedColumnName = "id", nullable = false)
    @NotNull(message = "Floor is mandatory")
    private Floor floor;

    @Min(value = 1, message = "Prize must be greater than 0")
    @Column(name = "price", nullable = true)
    private Integer price;
}
