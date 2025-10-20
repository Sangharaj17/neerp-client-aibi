package com.aibi.neerp.amc.jobs.initial.dto;


import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BreakdownTodoRequestDto {
//    private Integer customerSiteId;
    private Integer userId;
    // perpose means for complaint form Complaint / Feedback
    private String purpose;
    private LocalDate todoDate;
    private LocalTime time;
    private String venue;
    private Long jobActivityTypeId;
    private Integer status;
    private String complaintName;
    private String complaintMob;
    private Integer jobId;
    private Integer renewalJobId;
    private List<Integer> liftIds; // List of Enquiry IDs
}

