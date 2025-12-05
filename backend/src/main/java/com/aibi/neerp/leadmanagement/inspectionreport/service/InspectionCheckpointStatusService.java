package com.aibi.neerp.leadmanagement.inspectionreport.service;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aibi.neerp.exception.ResourceInUseException;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.leadmanagement.inspectionreport.dto.*;
import com.aibi.neerp.leadmanagement.inspectionreport.entity.*;
import com.aibi.neerp.leadmanagement.inspectionreport.repository.*;

@Service
public class InspectionCheckpointStatusService {

    @Autowired
    private InspectionCheckpointStatusRepository statusRepo;

    /**
     * Master create/update method
     * Handles:
     *  - New status
     *  - Update existing status
     *  - Delete removed status
     *
     * @author
     *     Sachin Shinde
     */
    @Transactional
    public String createOrUpdateInspectionCheckpointStatus(
            InspectionCheckpointStatusRequestDto wrapperDto) {

        try {

            List<InspectionCheckpointStatusDto> dtos =
                    wrapperDto.getInspectionCheckpointStatusDtos();

            if (dtos == null || dtos.isEmpty()) {
                return "No data found to process";
            }

            // -----------------------------------------
            // DELETE Status
            // -----------------------------------------
            deleteRemovedStatus(dtos);

            // -----------------------------------------
            // INSERT + UPDATE
            // -----------------------------------------
            for (InspectionCheckpointStatusDto dto : dtos) {

                if (dto.getId() == null) {
                    addStatus(dto); // new
                } else {
                    updateStatus(dto); // update
                }
            }

            return "Successfully Created or Updated";

        } catch (Exception ex) {
            ex.printStackTrace();
            throw new RuntimeException("Failed to process checkpoint status: " + ex.getMessage());
        }
    }


    // --------------------------------------------------------------------
    //                      DELETE STATUS LOGIC
    // --------------------------------------------------------------------
    private void deleteRemovedStatus(List<InspectionCheckpointStatusDto> dtos) {

        Set<Integer> incomingIds = dtos.stream()
                .map(InspectionCheckpointStatusDto::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        List<InspectionCheckpointStatus> existingStatuses = statusRepo.findAll();

        for (InspectionCheckpointStatus status : existingStatuses) {
            if (!incomingIds.contains(status.getId())) {
                deleteStatus(status.getId());
            }
        }
    }


    // --------------------------------------------------------------------
    //                        ADD STATUS
    // --------------------------------------------------------------------
    public void addStatus(InspectionCheckpointStatusDto dto) {

        InspectionCheckpointStatus newStatus = InspectionCheckpointStatus.builder()
                .statusName(dto.getStatusName())
                .build();

        statusRepo.save(newStatus);
    }


    // --------------------------------------------------------------------
    //                      UPDATE STATUS
    // --------------------------------------------------------------------
    public void updateStatus(InspectionCheckpointStatusDto dto) {

        InspectionCheckpointStatus status = statusRepo.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Checkpoint Status not found with ID: " + dto.getId()));

        status.setStatusName(dto.getStatusName());

        statusRepo.save(status);
    }


    // --------------------------------------------------------------------
    //                      DELETE STATUS
    // --------------------------------------------------------------------
    public void deleteStatus(Integer statusId) {

        try {
            statusRepo.deleteById(statusId);

        } catch (DataIntegrityViolationException ex) {
            throw new ResourceInUseException(
                    "Cannot delete checkpoint status ID " + statusId + " because it is referenced elsewhere.");
        }
    }


    // --------------------------------------------------------------------
    //                      GET ALL STATUSES
    // --------------------------------------------------------------------
    public List<InspectionCheckpointStatusDto> getAllStatuses() {

        List<InspectionCheckpointStatus> statuses = statusRepo.findAll();

        return statuses.stream()
                .map(status -> InspectionCheckpointStatusDto.builder()
                        .id(status.getId())
                        .statusName(status.getStatusName())
                        .build())
                .collect(Collectors.toList());
    }


    // --------------------------------------------------------------------
    //                      GET STATUS BY ID
    // --------------------------------------------------------------------
    public InspectionCheckpointStatusDto getStatusById(Integer id) {

        InspectionCheckpointStatus status = statusRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Checkpoint Status not found with ID: " + id));

        return InspectionCheckpointStatusDto.builder()
                .id(status.getId())
                .statusName(status.getStatusName())
                .build();
    }
}