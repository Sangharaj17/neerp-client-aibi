package com.aibi.neerp.quotation.jobs.dto;

import com.aibi.neerp.amc.jobs.initial.dto.EmployeeDto;
import com.aibi.neerp.amc.jobs.initial.dto.LiftData;
import com.aibi.neerp.quotation.jobsActivities.dto.JobActivityResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NiJobDetailPageResponseDto {

    private QuotationJobResponseDTO jobDetails;
    private List<JobActivityResponseDTO> jobActivities;
    private List<LiftData> liftDatas;
    private List<EmployeeDto> employeeDtos;
    private List<com.aibi.neerp.quotation.jobs.entity.NiJobDocument> documents;
}
