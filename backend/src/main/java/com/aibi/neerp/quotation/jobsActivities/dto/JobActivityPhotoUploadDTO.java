package com.aibi.neerp.quotation.jobsActivities.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobActivityPhotoUploadDTO {
    @NotNull(message = "Job activity ID is required")
    private Integer jobActivityId;

    // Max 3 photos validation will be in service layer
    @Size(max = 3, message = "Maximum 3 photos allowed")
    private List<MultipartFile> photos;
}
