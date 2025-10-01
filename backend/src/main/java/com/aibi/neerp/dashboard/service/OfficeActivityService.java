package com.aibi.neerp.dashboard.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.aibi.neerp.dashboard.dto.OfficeActivityRequestDto;
import com.aibi.neerp.dashboard.dto.OfficeActivityResponseDto;
import com.aibi.neerp.dashboard.entity.OfficeActivity;
import com.aibi.neerp.dashboard.repository.OfficeActivityRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OfficeActivityService {

    private final OfficeActivityRepository officeActivityRepository;
    
    // ✅ New create method
    public OfficeActivityResponseDto createOfficeActivity(OfficeActivityRequestDto requestDto) {
        OfficeActivity activity = OfficeActivity.builder()
                .purpose(requestDto.getPurpose())
                .todoDate(requestDto.getTodoDate())
                .status(0) // default false / pending
                .build();

        OfficeActivity saved = officeActivityRepository.save(activity);

        return mapToDto(saved);
    }

    public Page<OfficeActivityResponseDto> getPendingOfficeActivities(String search, Pageable pageable) {
        return officeActivityRepository.searchPendingOfficeActivities(search, pageable)
                .map(this::mapToDto);
    }

    private OfficeActivityResponseDto mapToDto(OfficeActivity activity) {
        String description = String.format("%s on %s",
                activity.getPurpose(),
                activity.getTodoDate() != null ? activity.getTodoDate().toString() : "");
        return OfficeActivityResponseDto.builder()
                .description(description)
                .build();
    }
}

