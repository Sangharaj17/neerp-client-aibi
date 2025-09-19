package com.aibi.neerp.location.dto;

import java.util.List;

public record StateWithCitiesDto(
        String stateName,
        String type, // e.g. "State" or "UT"
        List<String> cities
) {}
