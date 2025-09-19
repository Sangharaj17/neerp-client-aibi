package com.aibi.neerp.amc.jobs.initial.dto;


import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmcJobActivityRequestDto {

    private Integer jobId;
    private Long jobActivityTypeId;
    private LocalDate activityDate;
    private String activityTime;
    private String activityDescription;
    private String jobService;
    private String jobTypeWork;
    private Integer executiveId;
    private Integer jobActivityById;
    private String jobActivityBy2;
    private Boolean mailSent;
    private String remark;
    private String signatureName;
    private byte[] signatureValue;
    private String customerFeedback;
    private String inTime;
    private String outTime;
    private String actService;
    private Integer breakdownTodoId; // optional
    private List<Integer> liftIds;   // ✅ multiple lift IDs
}

