package com.aibi.neerp.quotation.jobsActivities.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobActivityRequestDTO {

    @NotNull(message = "Job ID is required")
    private Integer jobId;

    private Integer jobActivityTypeId;

    @NotNull(message = "Activity date is required")
//    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate activityDate;

    @NotBlank(message = "Activity title is required")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String activityTitle;

    @Size(max = 5000, message = "Description cannot exceed 5000 characters")
    private String activityDescription;

    private Integer jobActivityBy;

    private String remark;

    private Boolean mailSent = false;

    @NotNull(message = "Created by is required")
    private Integer createdBy;

    private String signaturePersonName;
    private String signatureUrl;

//    @Size(max = 5, message = "Maximum 5 photos allowed")
//    private List<MultipartFile> photos;
}
