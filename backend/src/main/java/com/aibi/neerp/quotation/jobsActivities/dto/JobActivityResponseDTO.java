package com.aibi.neerp.quotation.jobsActivities.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobActivityResponseDTO {
    private Integer jobActivityId;
    private Integer jobId;
    private String jobNumber;
    private Long jobActivityTypeId;
    private String jobActivityTypeName;
    private LocalDate activityDate;
    private String activityTitle;
    private String activityDescription;
    private Integer jobActivityBy;
    private String jobActivityByName;
    private String remark;
    private Boolean mailSent;
    private Integer createdBy;
    private String createdByName;
    private String signaturePersonName;
    private String signatureUrl; // URL to access signature
    private String status;
    private LocalDateTime createdAt;
    private List<JobActivityPhotoDTO> photos;
}
