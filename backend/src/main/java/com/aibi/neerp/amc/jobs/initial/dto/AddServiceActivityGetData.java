package com.aibi.neerp.amc.jobs.initial.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddServiceActivityGetData {

    private String serviceName;

    private List<LiftData> serviceLifsDatas;

}
