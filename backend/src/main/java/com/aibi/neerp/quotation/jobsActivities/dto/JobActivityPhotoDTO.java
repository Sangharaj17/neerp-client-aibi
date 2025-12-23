package com.aibi.neerp.quotation.jobsActivities.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobActivityPhotoDTO {
    private Integer photoId;
    private String photoUrl; // URL to access photo
    private LocalDateTime createdAt;
    private String createdByName;
    private Integer createdById;
}
