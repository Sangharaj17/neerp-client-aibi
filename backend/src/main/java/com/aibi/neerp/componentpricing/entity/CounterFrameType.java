package com.aibi.neerp.componentpricing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "tbl_counter_frame_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CounterFrameType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Frame Type Name cannot be blank")
    @Column(name = "frame_type_name", nullable = false, unique = true)
    private String frameTypeName;
}
