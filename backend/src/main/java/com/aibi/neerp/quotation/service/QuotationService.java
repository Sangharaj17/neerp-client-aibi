package com.aibi.neerp.quotation.service;

import com.aibi.neerp.componentpricing.entity.*;
import com.aibi.neerp.componentpricing.payload.ApiResponse;
import com.aibi.neerp.leadmanagement.entity.Enquiry;
import com.aibi.neerp.leadmanagement.repository.EnquiryRepository;
import com.aibi.neerp.quotation.dto.*;
import com.aibi.neerp.quotation.entity.*;
import com.aibi.neerp.customer.entity.Customer;
import com.aibi.neerp.customer.entity.Site;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.NewLeads;
import com.aibi.neerp.leadmanagement.repository.CombinedEnquiryRepository;
import com.aibi.neerp.leadmanagement.repository.NewLeadsRepository;
import com.aibi.neerp.quotation.repository.QuotationLiftDetailRepository;
import com.aibi.neerp.quotation.repository.QuotationLiftMaterialRepository;
import com.aibi.neerp.quotation.repository.QuotationMainRepository;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.quotation.repository.SelectedQuotationMaterialRepository;
import com.aibi.neerp.quotation.utility.PaginationResponse;
import com.aibi.neerp.quotation.dto.QuotationMainResponseDTO;
import com.aibi.neerp.quotation.utility.QuotationStatus;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


import java.lang.reflect.Method;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class QuotationService {

    private final QuotationMainRepository quotationMainRepository;
    private final QuotationLiftDetailRepository quotationLiftDetailRepository;
    private final NewLeadsRepository newLeadsRepository;
    private final CombinedEnquiryRepository combinedEnquiryRepository;
    private final EmployeeRepository employeeRepository;
    private final EnquiryRepository enquiryRepository;
    @Autowired
    private QuotationLiftMaterialRepository quotationLiftMaterialRepository;
    @Autowired
    private SelectedQuotationMaterialRepository selectedQuotationMaterialRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void markLiftsAsSaved(LiftSaveStatusRequestDTO request) {
        List<Long> liftIds = request.getLiftIds();
        if (liftIds == null || liftIds.isEmpty()) {
            throw new IllegalArgumentException("Lift IDs cannot be empty.");
        }

        // 1. Update the individual LIFT details (QuotationLiftDetail)
        log.info("Updating {} lifts to isSaved=true, isFinalized=false ", liftIds.size());
        quotationLiftDetailRepository.updateSaveStatusForLifts(liftIds);

        // 2. Update the parent QuotationMain entity
        quotationMainRepository.findById(request.getQuotationMainId())
                .ifPresent(mainEntity -> {

                    // Set Remarks (assuming you added a 'remarks' field to QuotationMain)
                    mainEntity.setRemarks(request.getRemarks());

                    // Set CreatedBy/CreatedAt
                    if (request.getCreatedByEmployeeId() != null) {
                        // Look up the Employee entity
                        employeeRepository.findById(request.getCreatedByEmployeeId()).ifPresent(employee -> {
                            mainEntity.setCreatedBy(employee);
                        });
                    }

                    // Set createdAt to current time (if you want to track the last modification time for 'save')
                    mainEntity.setCreatedAt(LocalDateTime.now());

//                    mainEntity.setStatus("SAVED");
                    mainEntity.setStatus(QuotationStatus.SAVED);

                    quotationMainRepository.save(mainEntity);
                    log.info("QuotationMain ID {} updated with remarks and createdBy/createdAt.", request.getQuotationMainId());
                });
    }

    @Transactional
    public void onlyMarkLiftsAsSaved(List<Long> liftIds) {
        if (liftIds == null || liftIds.isEmpty()) {
            throw new IllegalArgumentException("Lift IDs cannot be empty.");
        }

        log.info("Updating {} lifts to isSaved=true, isFinalized=false", liftIds.size());
        quotationLiftDetailRepository.updateSaveStatusForLifts(liftIds);
    }

    // =========================================================
    // 🔹 CREATE OR UPDATE QUOTATION
    // =========================================================
    public ApiResponse<QuotationMainResponseDTO> saveQuotation(QuotationMainRequestDTO dto) {
        try {
            log.info("Saving quotation {}", dto.getQuotationNo());
            System.out.println("-------Main-----11111111111-----------");
            QuotationMain entity = (dto.getId() != null)
                    ? quotationMainRepository.findById(dto.getId()).orElse(new QuotationMain())
                    : new QuotationMain();

            System.out.println(entity.getId() + "------->" + entity.getQuotationNo() + "-------Main--set main Quotation---2222222222222-----------" + entity);

            // --- Basic Header Mapping ---
            entity.setQuotationNo(dto.getQuotationNo());
            entity.setQuotationDate(dto.getQuotationDate());
            entity.setEdition(dto.getEdition());
            entity.setTotalAmount(dto.getTotalQuotationAmount());
            entity.setStatus(dto.getStatus());
            entity.setRemarks(dto.getRemarks());

            System.out.println("-------Main---get Lead--1333333333333333-----------" + dto.getLeadId());
            // --- Lead / Enquiry Reference Mapping ---
            if (dto.getLeadId() != null)
                entity.setLead(newLeadsRepository.findById(dto.getLeadId()).orElse(null));

            System.out.println("-------Main--- set Lead--44444444444-----------" + dto.getLeadTypeId());
            entity.setLeadTypeId(dto.getLeadTypeId());
            entity.setLeadDate(dto.getLeadDate());

            System.out.println("-------Main----get & set combined enquiry -555555555555-----------" + dto.getCombinedEnquiryId());
            if (dto.getCombinedEnquiryId() != null)
                entity.setCombinedEnquiry(combinedEnquiryRepository.findById(dto.getCombinedEnquiryId()).orElse(null));

            System.out.println("-------Main--- set EnquiryTypeId-------------" + dto.getEnquiryTypeId());
            entity.setEnquiryTypeId(dto.getEnquiryTypeId());

            // --- Customer / Site ---
            entity.setCustomerName(dto.getCustomerName());
            entity.setCustomerId(dto.getCustomerId());
            entity.setSiteName(dto.getSiteName());
            entity.setSiteId(dto.getSiteId());
            System.out.println("-------Main-----77777777777777-----------" + dto.getCreatedByEmployeeId());

            // --- Created / Approved Info ---
            if (dto.getCreatedByEmployeeId() != null)
                entity.setCreatedBy(employeeRepository.findById(dto.getCreatedByEmployeeId()).orElse(null));

            System.out.println("-------Main-----888888888888-----------");
//            if (dto.getApprovedByEmployeeId() != null)
//                entity.setApprovedBy(employeeRepository.findById(dto.getApprovedByEmployeeId()).orElse(null));

            entity.setCreatedAt(LocalDateTime.now());
            entity.setStatus(QuotationStatus.DRAFTED);
//            entity.setApprovedAt(LocalDateTime.now());

            // --- Lift Details Mapping ---
//            entity.getLiftDetails().clear();
//            if (dto.getLiftDetails() != null && !dto.getLiftDetails().isEmpty()) {
//                for (QuotationLiftDetailRequestDTO liftDTO : dto.getLiftDetails()) {
//                    QuotationLiftDetail liftDetail = mapLiftDetailDTOToEntity(liftDTO, entity);
//                    entity.getLiftDetails().add(liftDetail);
//                }
//            }

            // ******************* Lift Details Mapping ***************
            System.out.println("-------Main---getLiftDetails--888888888888-----------" + dto.getLiftDetails().isEmpty());

            if (dto.getLiftDetails() != null && !dto.getLiftDetails().isEmpty()) {
                if (entity.getLiftDetails() == null) {
                    // Initialize the collection if it's null (for new QuotationMain)
                    entity.setLiftDetails(new ArrayList<>());
                }

                System.out.println("-------Main-----999999999999999-----------");

                // We iterate over the incoming DTOs and update the corresponding entity or create a new one.
                for (QuotationLiftDetailRequestDTO liftDTO : dto.getLiftDetails()) {
                    QuotationLiftDetail liftDetail = null;

                    // 1. 🟢 Case 1: Update existing lift by ID
                    if (liftDTO.getId() != null) {
                        liftDetail = entity.getLiftDetails().stream()
                                .filter(ld -> ld.getId() != null && ld.getId().equals(liftDTO.getId()))
                                .findFirst()
                                .orElse(null);
                    }

                    // 2. 🟡 Case 2: ID is null - check for existing lift by enquiryId in the current quotation entity
                    // Assuming ld.getEnquiryId() is available, as ld.getEnquiry() is flagged as possibly null/unfetched
                    if (liftDetail == null && liftDTO.getEnquiryId() != null) {
                        liftDetail = entity.getLiftDetails().stream()
                                .filter(ld -> ld.getEnquiry().getEnquiryId() != null
                                        && ld.getEnquiry().getEnquiryId().equals(liftDTO.getEnquiryId()))
                                .findFirst()
                                .orElse(null);
                    }

                    // 3. 🔴 Case 3: New lift (id is null AND no matching enquiryId found)
                    boolean isNewLift = (liftDetail == null);
                    if (isNewLift) {
                        liftDetail = new QuotationLiftDetail();
                    }

                    // Map DTO to Entity
                    // This method must handle setting the bidirectional link back to 'entity' (QuotationMain)
                    liftDetail = mapLiftDetailDTOToEntity(liftDTO, entity, liftDetail);

                    // If it's a new lift, add it to the existing collection in the parent entity.
                    // If it's an update, the entity is already in the collection, so we don't re-add it.
                    if (isNewLift) {
                        entity.getLiftDetails().add(liftDetail);
                    }
                }

                // CRITICAL CHANGE: DO NOT call entity.setLiftDetails(updatedList) or clear the list.
                // By only adding new entities to the existing collection,
                // the database entities not in the payload are left untouched.
            }

            QuotationMain saved = quotationMainRepository.save(entity);
            log.info("Quotation saved successfully with ID {}", saved.getId());

            return new ApiResponse<>(true, "Quotation saved successfully",
                    mapQuotationEntityToResponseDTO(saved));

        } catch (Exception ex) {
            log.error("Error saving quotation: {}", ex.getMessage(), ex);
            return new ApiResponse<>(false, "Error saving quotation: " + ex.getMessage(), null);
        }
    }


    // =========================================================
    // 🔹 GET ALL QUOTATIONS
    // =========================================================
    public ApiResponse<List<QuotationMainResponseDTO>> getAllQuotations() {
        try {
            List<QuotationMain> quotations = quotationMainRepository.findAll();
            List<QuotationMainResponseDTO> response = quotations.stream()
                    .map(this::mapQuotationEntityToResponseDTO)
                    .collect(Collectors.toList());
            return new ApiResponse<>(true, "Fetched all quotations", response);
        } catch (Exception ex) {
            log.error("Error fetching quotations: {}", ex.getMessage());
            return new ApiResponse<>(false, "Error fetching quotations", null);
        }
    }


    // =========================================================
    // 🔹 GET QUOTATION BY ID
    // =========================================================
    public ApiResponse<QuotationMainResponseDTO> getQuotationById(Integer id) {
        return quotationMainRepository.findById(id)
                .map(q -> new ApiResponse<>(true, "Fetched successfully", mapQuotationEntityToResponseDTO(q)))
                .orElseGet(() -> new ApiResponse<>(false, "Quotation not found", null));
    }


    // =========================================================
    // 🔹 DELETE QUOTATION BY ID PERMANENTLY
    // =========================================================
    public ApiResponse<String> deleteQuotation(Integer id) {
        if (!quotationMainRepository.existsById(id))
            return new ApiResponse<>(false, "Quotation not found", null);

        quotationMainRepository.deleteById(id);
        return new ApiResponse<>(true, "Quotation deleted successfully", null);
    }

    // =========================================================
    // 🔹 GET EXISTING LIFTS FOR QUOTATIONS (by Lead + Combined Enquiry)
    // =========================================================
    public ApiResponse<List<QuotationMainResponseDTO>> getQuotationsByLeadAndCombinedEnquiry(
            Integer leadId, Integer combinedEnquiryId) {
        try {
            log.info("Fetching quotations for Lead ID: {} and Combined Enquiry ID: {}", leadId, combinedEnquiryId);

            if (leadId == null || combinedEnquiryId == null) {
                return new ApiResponse<>(false, "Lead ID and Combined Enquiry ID are required", null);
            }

            // 🔹 Fetch quotations matching Lead + Combined Enquiry
            List<QuotationMain> quotations = quotationMainRepository
                    .findByLead_LeadIdAndCombinedEnquiry_Id(leadId, combinedEnquiryId);

            if (quotations.isEmpty()) {
                return new ApiResponse<>(true, "No quotations found for given lead and combined enquiry", Collections.emptyList());
            }


            // 🔹 Map to DTOs
            List<QuotationMainResponseDTO> responseList = quotations.stream()
                    .peek(q -> q.getLiftDetails().sort(Comparator.comparing(QuotationLiftDetail::getId)))
                    .map(this::mapQuotationEntityToResponseDTO)
                    .collect(Collectors.toList());


            System.out.println(String.format(
                    "Fetched %d quotations for Lead ID: %d and Combined Enquiry ID: %d",
                    responseList.size(), leadId, combinedEnquiryId
            ));

            log.info("Fetched {} quotations for Lead ID: {} and Combined Enquiry ID: {}",
                    responseList.size(), leadId, combinedEnquiryId);

            Set<Long> allEnquiryIds = responseList.stream()
                    // 1. Get the list of lift details from each QuotationMainResponseDTO
                    .flatMap(quotation -> {
                        // Handle case where liftDetails might be null or empty
                        List<QuotationLiftDetailResponseDTO> liftDetails = quotation.getLiftDetails();
                        return (liftDetails != null) ? liftDetails.stream() : java.util.stream.Stream.empty();
                    })
                    // 2. Map each QuotationLiftDetailResponseDTO to its enquiryId (Long)
                    .map(liftDetail -> liftDetail.getEnquiryId())
                    // 3. Filter out any null IDs (for optional relationships)
                    .filter(java.util.Objects::nonNull)
                    // 4. Collect the unique IDs into a Set
                    .collect(Collectors.toSet());

            // To print the result:
            System.out.println("Extracted Enquiry IDs: " + allEnquiryIds);

            return new ApiResponse<>(true, "Fetched quotations successfully", responseList);

        } catch (Exception ex) {
            log.error("Error fetching quotations for Lead ID {} and Combined Enquiry ID {}: {}",
                    leadId, combinedEnquiryId, ex.getMessage(), ex);
            return new ApiResponse<>(false, "Error fetching quotations: " + ex.getMessage(), null);
        }
    }


    // =========================================================
    // 🔹 GET EXISTING ALL QUOTATIONS WITHOUT LIFTS DETAILS
    // =========================================================
    public ApiResponse<List<QuotationMainResponseDTO>> getAllMainQuotations() {
        log.info("Fetching all quotations (without lift details)...");
        try {
            // 💡 Use the standard findAll(), but ensure the mapping is fast
//            List<QuotationMain> quotations = quotationMainRepository.findAll();

            List<QuotationMain> quotations = quotationMainRepository.findAllWithEagerAssociations();

            List<QuotationMainResponseDTO> response = quotations.stream()
                    .map(this::mapQuotationMainToResponseDTOWithoutLifts)
                    .collect(Collectors.toList());

            return new ApiResponse<>(true, "Fetched all quotations", response);
        } catch (Exception ex) {
            log.error("Error fetching all quotations: {}", ex.getMessage());
            return new ApiResponse<>(false, "Error fetching quotations", null);
        }
    }


    // =========================================================
    // 🔹 GET EXISTING ALL QUOTATIONS WITHOUT LIFTS DETAILS WITH PAGINATION
    // =========================================================
    public ApiResponse<PaginationResponse<QuotationMainResponseDTO>> getPageWiseMainQuotations(Pageable pageable) {
        log.info("Fetching paginated quotations. Page: {}, Size: {}", pageable.getPageNumber(), pageable.getPageSize());
        List<QuotationStatus> allowedStatuses = List.of(
                QuotationStatus.SAVED,
                QuotationStatus.FINALIZED
        );
        try {
            Page<QuotationMain> quotationPage = quotationMainRepository.findAllWithEagerAssociationsPageable(
                    allowedStatuses, // 💡 Pass the Enum List here
                    pageable
            );
            List<QuotationMainResponseDTO> dtoList = quotationPage.stream()
                    .map(this::mapQuotationMainToResponseDTOWithoutLifts)
                    .collect(Collectors.toList());


            // 3. Construct the Pagination Response DTO
            PaginationResponse<QuotationMainResponseDTO> paginationResponse = PaginationResponse.<QuotationMainResponseDTO>builder()
                    .content(dtoList)
                    .currentPage(quotationPage.getNumber())
                    .totalElements(quotationPage.getTotalElements())
                    .totalPages(quotationPage.getTotalPages())
                    .pageSize(quotationPage.getSize())
                    .build();

            return new ApiResponse<>(true, "Fetched paginated quotations", paginationResponse);
        } catch (Exception ex) {
            log.error("Error fetching all quotations: {}", ex.getMessage());
            return new ApiResponse<>(false, "Error fetching quotations", null);
        }
    }


    // =========================================================
    // 🔹 FINALIZE QUOTATION
    // =========================================================
    public ApiResponse<Void> finalizeQuotation(Integer quotationId, Integer finalizedByEmployeeId) {
        try {
            QuotationMain quotation = quotationMainRepository.findById(quotationId)
                    .orElseThrow(() -> new RuntimeException("Quotation not found with ID: " + quotationId));

            if (Boolean.TRUE.equals(quotation.getIsFinalized())) {
                return new ApiResponse<>(false, "Quotation is already finalized.", null);
            }

            Employee finalizingEmployee = employeeRepository.findById(finalizedByEmployeeId)
                    .orElseThrow(() -> new RuntimeException("Finalizing Employee not found with ID: " + finalizedByEmployeeId));


            // 1. Update the status fields
            quotation.setIsFinalized(true);
//            quotation.setStatus("FINALIZED");
            quotation.setStatus(QuotationStatus.FINALIZED);
            quotation.setFinalizedAt(LocalDateTime.now());
            quotation.setFinalizedBy(finalizingEmployee);

            // 2. Save the updated entity
            quotationMainRepository.save(quotation);

            log.info("Quotation ID {} successfully finalized by Employee ID {}", quotationId, finalizingEmployee.getEmployeeId());

            return new ApiResponse<>(true, "Quotation finalized successfully.", null);

        } catch (RuntimeException ex) {
            log.error("Finalization failed for Quotation ID {}: {}", quotationId, ex.getMessage());
            return new ApiResponse<>(false, ex.getMessage(), null);
        } catch (Exception ex) {
            log.error("An unexpected error occurred during finalization of Quotation ID {}: {}", quotationId, ex.getMessage(), ex);
            return new ApiResponse<>(false, "An unexpected server error occurred during finalization.", null);
        }
    }


    // =========================================================
    // 🔹 DELETE QUOTATION BY CHANGING THE STATUS ONLY
    // =========================================================
    public ApiResponse<Void> deleteQuotation(Integer quotationId, Integer deletedByEmployeeId) {
        try {
            QuotationMain quotation = quotationMainRepository.findById(quotationId)
                    .orElseThrow(() -> new RuntimeException("Quotation not found with ID: " + quotationId));

            if (Boolean.TRUE.equals(quotation.getIsDeleted())) {
                return new ApiResponse<>(false, "Quotation is already deleted.", null);
            }

            Employee finalizingEmployee = employeeRepository.findById(deletedByEmployeeId)
                    .orElseThrow(() -> new RuntimeException("Deleting Employee not found with ID: " + deletedByEmployeeId));


            // 1. Update the status fields
            quotation.setIsDeleted(true);
//            quotation.setStatus("DELETED");
            quotation.setStatus(QuotationStatus.DELETED);
            quotation.setDeletedAt(LocalDateTime.now());
            quotation.setDeletedBy(finalizingEmployee);

            // 2. Save the updated entity
            quotationMainRepository.save(quotation);

            log.info("Quotation ID {} successfully deleted by Employee ID {}", quotationId, finalizingEmployee.getEmployeeId());

            return new ApiResponse<>(true, "Quotation deleted successfully.", null);

        } catch (RuntimeException ex) {
            log.error("Deletion failed for Quotation ID {}: {}", quotationId, ex.getMessage());
            return new ApiResponse<>(false, ex.getMessage(), null);
        } catch (Exception ex) {
            log.error("An unexpected error occurred during finalization of Quotation ID {}: {}", quotationId, ex.getMessage(), ex);
            return new ApiResponse<>(false, "An unexpected server error occurred during finalization.", null);
        }
    }


// =========================================================
// 🔹 GET EXISTING LIFTS FOR QUOTATION DETAILS (by Lead + Combined Enquiry)
// =========================================================
//    public ApiResponse<List<QuotationLiftDetailResponseDTO>> getExistingLiftsForQuotation(Integer leadId, Integer combinedEnquiryId) {
//        try {
//            log.info("Fetching existing lifts for Lead ID: {} and Combined Enquiry ID: {}", leadId, combinedEnquiryId);
//
//            List<QuotationLiftDetail> results;
//
//            // ✅ Conditional repository calls (no need for EntityManager)
//            if (leadId != null && combinedEnquiryId != null) {
//                results = quotationLiftDetailRepository.findByLead_LeadIdAndCombinedEnquiry_Id(leadId, combinedEnquiryId);
//            } else {
//                return new ApiResponse<>(false, "Either leadId or combinedEnquiryId must be provided", null);
//            }
//
//            if (results.isEmpty()) {
//                return new ApiResponse<>(true, "No existing lifts found", Collections.emptyList());
//            }
//
//            List<QuotationLiftDetailResponseDTO> responseList = results.stream()
//                    .map(this::mapLiftDetailEntityToDTO)
//                    .collect(Collectors.toList());
//            System.out.println("Existing lifts for lead id: " + leadId
//                    + " and combined enquiry ID: " + combinedEnquiryId
//                    + " are: " + responseList);
//
//            System.out.println("Existing lifts: " +
//                    responseList.stream()
//                            .map(QuotationLiftDetailResponseDTO::getEnquiryId)
//                            .toList()
//            );
//
//
//            return new ApiResponse<>(true, "Fetched existing lifts successfully", responseList);
//
//        } catch (Exception ex) {
//            log.error("Error fetching existing lifts: {}", ex.getMessage(), ex);
//            return new ApiResponse<>(false, "Error fetching existing lifts: " + ex.getMessage(), null);
//        }
//    }
//

    // ***********************************************************************************
// =========================================================
// 🔹 Helper Mappers (Manual)
// =========================================================
    private QuotationLiftDetail mapLiftDetailDTOToEntity(
            QuotationLiftDetailRequestDTO dto,
            QuotationMain main,
            QuotationLiftDetail entity) {

        // ********************Main Quotation details/ Basic Details ****************************
        if (dto.getId() != null)
            entity.setId(dto.getId());

        entity.setLiftQuotationNo(dto.getLiftQuotationNo());
        entity.setQuotationMain(main);

        // --- Lead / Enquiry Mapping ---
        if (dto.getLeadId() != null)
            entity.setLead(ref(NewLeads.class, dto.getLeadId()));

        entity.setLeadTypeId(dto.getLeadTypeId());
        entity.setLeadDate(dto.getLeadDate());

        if (dto.getCombinedEnquiryId() != null)
            entity.setCombinedEnquiry(ref(CombinedEnquiry.class, dto.getCombinedEnquiryId()));

        if (dto.getEnquiryId() != null)
            entity.setEnquiry(ref(Enquiry.class, dto.getEnquiryId()));

        entity.setEnquiryTypeId(dto.getEnquiryTypeId());
        entity.setEnqDate(dto.getEnqDate());
        System.out.println("------------111111111111-----------");

        // ****************************** Lift Configuration ***************************
        if (dto.getLiftTypeId() != null) entity.setLiftType(ref(OperatorElevator.class, dto.getLiftTypeId()));
        if (dto.getTypeOfLiftId() != null) entity.setTypeOfLift(ref(TypeOfLift.class, dto.getTypeOfLiftId()));
        if (dto.getMachineRoomId() != null) entity.setMachineRoom(ref(MachineRoom.class, dto.getMachineRoomId()));
        if (dto.getCapacityTypeId() != null) entity.setCapacityType(ref(CapacityType.class, dto.getCapacityTypeId()));
        if (dto.getPersonCapacityId() != null)
            entity.setPersonCapacity(ref(PersonCapacity.class, dto.getPersonCapacityId()));
        if (dto.getWeightId() != null) entity.setWeight(ref(Weight.class, dto.getWeightId()));

        System.out.println("------------122222222222222222-----------");
        entity.setFloors(dto.getFloors());
        entity.setStops(dto.getStops());
        entity.setOpenings(dto.getOpenings());
        entity.setFloorDesignations(dto.getFloorDesignations());

        System.out.println("------------3333333333333331-----------");
        // --- Additional Floor Selections ---
        if (dto.getFloorSelectionIds() != null && !dto.getFloorSelectionIds().isEmpty()) {
            entity.setFloorSelections(
                    dto.getFloorSelectionIds().stream()
                            .filter(Objects::nonNull)
                            .distinct()
                            .map(id -> ref(AdditionalFloors.class, id))
                            .collect(Collectors.toList())
            );
        } else {
            entity.setFloorSelections(new ArrayList<>());
        }

        System.out.println("------------44444444444444444-----------");

        entity.setCarTravel(dto.getCarTravel());
        entity.setSpeed(dto.getSpeed());

        System.out.println("------------555555555555555-----------");
        // --- Cabin Design ---
        if (dto.getCabinTypeId() != null) entity.setCabinType(ref(CabinType.class, dto.getCabinTypeId()));
        if (dto.getCabinSubTypeId() != null) entity.setCabinSubType(ref(CabinSubType.class, dto.getCabinSubTypeId()));
        if (dto.getLightFittingId() != null) entity.setLightFitting(ref(LightFitting.class, dto.getLightFittingId()));
        if (dto.getCabinFlooringId() != null)
            entity.setCabinFlooring(ref(CabinFlooring.class, dto.getCabinFlooringId()));
        if (dto.getCabinCeilingId() != null) entity.setCabinCeiling(ref(CabinCeiling.class, dto.getCabinCeilingId()));
        if (dto.getAirTypeId() != null) entity.setAirType(ref(AirType.class, dto.getAirTypeId()));
        if (dto.getAirSystemId() != null) entity.setAirSystem(ref(AirSystem.class, dto.getAirSystemId()));

        if (dto.getCarEntranceId() != null) entity.setCarEntrance(ref(CarDoorType.class, dto.getCarEntranceId()));
        if (dto.getCarEntranceSubTypeId() != null)
            entity.setCarEntranceSubType(ref(CarDoorSubType.class, dto.getCarEntranceSubTypeId()));
        if (dto.getLandingEntranceSubType1Id() != null)
            entity.setLandingEntranceSubType1(ref(LandingDoorSubType.class, dto.getLandingEntranceSubType1Id()));
        if (dto.getLandingEntranceSubType2Id() != null)
            entity.setLandingEntranceSubType2(ref(LandingDoorSubType.class, dto.getLandingEntranceSubType2Id()));

        entity.setLandingEntranceCount(dto.getLandingEntranceCount());
        entity.setLandingEntranceSubType2_fromFloor(dto.getLandingEntranceSubType2_fromFloor());
        entity.setLandingEntranceSubType2_toFloor(dto.getLandingEntranceSubType2_toFloor());

        // --- Control & Mechanical Parts ---
        if (dto.getControlPanelTypeId() != null)
            entity.setControlPanelType(ref(ControlPanelType.class, dto.getControlPanelTypeId()));
        entity.setManufacture(dto.getManufacture());
        if (dto.getControlPanelMakeId() != null)
            entity.setControlPanelMake(ref(Manufacture.class, dto.getControlPanelMakeId()));
//        if (dto.getWiringHarnessId() != null) entity.setWiringHarness(ref(Harness.class, dto.getWiringHarnessId()));
        if (dto.getWiringHarnessId() != null) entity.setWiringHarness(ref(Manufacture.class, dto.getWiringHarnessId()));

        if (dto.getGuideRailId() != null) entity.setGuideRail(ref(CounterWeight.class, dto.getGuideRailId()));
        if (dto.getBracketTypeId() != null) entity.setBracket(ref(Bracket.class, dto.getBracketTypeId()));
        if (dto.getRopingTypeId() != null) entity.setRopingType(ref(WireRope.class, dto.getRopingTypeId()));
        if (dto.getLopTypeId() != null) entity.setLopType(ref(LopType.class, dto.getLopTypeId()));
        if (dto.getCopTypeId() != null) entity.setCopType(ref(Cop.class, dto.getCopTypeId()));

        entity.setOverhead(dto.getOverhead());
        if (dto.getOperationTypeId() != null)
            entity.setOperationType(ref(OperationType.class, dto.getOperationTypeId()));

        // --- Dimensions ---
        entity.setMachineRoomDepth(dto.getMachineRoomDepth());
        entity.setMachineRoomWidth(dto.getMachineRoomWidth());
        entity.setShaftWidth(dto.getShaftWidth());
        entity.setShaftDepth(dto.getShaftDepth());
        entity.setCarInternalWidth(dto.getCarInternalWidth());
        entity.setCarInternalDepth(dto.getCarInternalDepth());
        entity.setCarInternalHeight(dto.getCarInternalHeight());

        entity.setStdFeatureIds(dto.getStdFeatureIds());
        entity.setAutoRescue(dto.getAutoRescue());

        // --- Manufacturers ---
        if (dto.getVfdMainDriveId() != null) entity.setVfdMainDrive(ref(Manufacture.class, dto.getVfdMainDriveId()));
        if (dto.getDoorOperatorId() != null) entity.setDoorOperator(ref(Manufacture.class, dto.getDoorOperatorId()));
        if (dto.getMainMachineSetId() != null)
            entity.setMainMachineSet(ref(Manufacture.class, dto.getMainMachineSetId()));
        if (dto.getCarRailsId() != null) entity.setCarRails(ref(Manufacture.class, dto.getCarRailsId()));
        if (dto.getCounterWeightRailsId() != null)
            entity.setCounterWeightRails(ref(Manufacture.class, dto.getCounterWeightRailsId()));
        if (dto.getWireRopeId() != null) entity.setWireRope(ref(Manufacture.class, dto.getWireRopeId()));
        if (dto.getWarrantyPeriodId() != null && dto.getWarrantyPeriodId() > 0) {
            entity.setWarrantyPeriod(ref(Warranty.class, dto.getWarrantyPeriodId()));
        } else {
            entity.setWarrantyPeriod(null);
        }
//        System.out.println("Warranty Period ID => " + dto.getWarrantyPeriodId());
//        System.out.println("Warranty Ref => " + entity.getWarrantyPeriod());


        // --- Installation & Lift Count ---
        entity.setPwdIncludeExclude(dto.getPwdIncludeExclude());
        entity.setScaffoldingIncludeExclude(dto.getScaffoldingIncludeExclude());
        if (dto.getInstallationAmountRuleId() != null)
            entity.setInstallationRule(ref(InstallationRule.class, dto.getInstallationAmountRuleId()));
        entity.setLiftQuantity(dto.getLiftQuantity());

        // --- Pricing ---
        entity.setLiftRate(dto.getLiftRate());
        entity.setTotalAmount(dto.getTotalAmount());
        entity.setTotalAmountWithoutGST(dto.getTotalAmountWithoutGST());
        entity.setTotalAmountWithoutLoad(dto.getTotalAmountWithoutLoad());
        entity.setIsLiftRateManual(dto.getIsLiftRateManual());
        entity.setCommercialTotal(dto.getCommercialTotal());
        entity.setCommercialTaxAmount(dto.getCommercialTaxAmount());
        entity.setCommercialFinalAmount(dto.getCommercialFinalAmount());
        entity.setTax(dto.getTax());
        entity.setLoadPerAmt(dto.getLoadPerAmt());
        entity.setLoadAmt(dto.getLoadAmt());

        // --- Price Breakdown ---
        entity.setArdPrice(dto.getArdPrice());
        entity.setMachinePrice(dto.getMachinePrice());
        entity.setGovernorPrice(dto.getGovernorPrice());
        entity.setTruffingPrice(dto.getTruffingPrice());
        entity.setFastenerPrice(dto.getFastenerPrice());
        entity.setInstallationAmount(dto.getInstallationAmount());
        entity.setManualPrice(dto.getManualPrice());
        entity.setCommonPrice(dto.getCommonPrice());
        entity.setOtherPrice(dto.getOtherPrice());

        entity.setCabinPrice(dto.getCabinPrice());
        entity.setLightFittingPrice(dto.getLightFittingPrice());
        entity.setCabinFlooringPrice(dto.getCabinFlooringPrice());
        entity.setCabinCeilingPrice(dto.getCabinCeilingPrice());
        entity.setAirSystemPrice(dto.getAirSystemPrice());
        entity.setCarEntrancePrice(dto.getCarEntrancePrice());
        entity.setLandingEntrancePrice1(dto.getLandingEntrancePrice1());
        entity.setLandingEntrancePrice2(dto.getLandingEntrancePrice2());
        entity.setControlPanelTypePrice(dto.getControlPanelTypePrice());
        entity.setWiringHarnessPrice(dto.getWiringHarnessPrice());
        entity.setGuideRailPrice(dto.getGuideRailPrice());
        entity.setBracketTypePrice(dto.getBracketTypePrice());
        entity.setWireRopePrice(dto.getWireRopePrice());
        entity.setRopingTypePrice(dto.getRopingTypePrice());
        entity.setLopTypePrice(dto.getLopTypePrice());
        entity.setCopTypePrice(dto.getCopTypePrice());

        // --- Add-on Prices ---
        entity.setPwdAmount(dto.getPwdAmount());
        entity.setBambooScaffolding(dto.getBambooScaffolding());
        entity.setArdAmount(dto.getArdAmount());
        entity.setOverloadDevice(dto.getOverloadDevice());
        entity.setTransportCharges(dto.getTransportCharges());
        entity.setOtherCharges(dto.getOtherCharges());
        entity.setPowerBackup(dto.getPowerBackup());
        entity.setFabricatedStructure(dto.getFabricatedStructure());
        entity.setElectricalWork(dto.getElectricalWork());
        entity.setIbeamChannel(dto.getIbeamChannel());
        entity.setDuplexSystem(dto.getDuplexSystem());
        entity.setTelephonicIntercom(dto.getTelephonicIntercom());
        entity.setGsmIntercom(dto.getGsmIntercom());
        entity.setNumberLockSystem(dto.getNumberLockSystem());
        entity.setThumbLockSystem(dto.getThumbLockSystem());

        entity.setTruffingQty(dto.getTruffingQty());
        entity.setTruffingType(dto.getTruffingType());
        entity.setFastenerType(dto.getFastenerType());

        // --- Misc ---
        entity.setPitDepth(dto.getPitDepth());
        entity.setMainSupplySystem(dto.getMainSupplySystem());
        entity.setAuxlSupplySystem(dto.getAuxlSupplySystem());
        entity.setSignals(dto.getSignals());
        entity.setQuotationDate(dto.getQuotationDate());

        entity.setIsSaved(dto.getIsSaved());
        entity.setIsFinalized(dto.getIsFinalized());


        // ----------------------------------------------------
        // ✅ 1. MAPPING FOR: QuotationLiftMaterial (Manual & Common Details)
        // ----------------------------------------------------

        // Initialize the collection if it's null (important for new entities)
        if (entity.getLiftMaterials() == null) {
            entity.setLiftMaterials(new ArrayList<>());
        }

        // 1. Create a temporary list for all incoming materials
        List<QuotationLiftMaterial> incomingMaterials = new ArrayList<>();

        // 2. Process Manual Materials and add to incomingMaterials
        if (dto.getManualDetails() != null) {
            dto.getManualDetails().forEach(materialDTO -> {
                // PASS "MANUAL" list type
                QuotationLiftMaterial material = mapMaterialDTOToLiftMaterialEntity(materialDTO, entity, "MANUAL");
                incomingMaterials.add(material);
            });
        }

        // 3. Process Common Materials and add to incomingMaterials
        if (dto.getCommonDetails() != null) {
            dto.getCommonDetails().forEach(materialDTO -> {
                // PASS "COMMON" list type
                QuotationLiftMaterial material = mapMaterialDTOToLiftMaterialEntity(materialDTO, entity, "COMMON");
                incomingMaterials.add(material);
            });
        }

        // 2. Process Other Materials and add to incomingMaterials
        if (dto.getOtherDetails() != null) {
            dto.getOtherDetails().forEach(materialDTO -> {
                // PASS "others" list type
                QuotationLiftMaterial material = mapMaterialDTOToLiftMaterialEntity(materialDTO, entity, "OTHERS");
                incomingMaterials.add(material);
            });
        }

        // 4. Synchronize the current persisted collection with the incoming list.
        entity.getLiftMaterials().clear();
        entity.getLiftMaterials().addAll(incomingMaterials);

        // ----------------------------------------------------
        // ✅ 2. MAPPING FOR: SelectedQuotationMaterial
        // This now uses dto.getSelectedMaterials() which is assumed to be in the Lift DTO
        // ----------------------------------------------------

        // Initialize the collection if it's null
        if (entity.getSelectedMaterials() == null) {
            entity.setSelectedMaterials(new ArrayList<>());
        }

        List<SelectedQuotationMaterial> incomingSelectedMaterials = new ArrayList<>();

        if (dto.getSelectedMaterials() != null && !dto.getSelectedMaterials().isEmpty()) {
            for (SelectedMaterialRequestDTO materialDTO : dto.getSelectedMaterials()) {
                // NOTE: The helper method MUST be updated to accept QuotationLiftDetail (entity)
                // as the parent instead of QuotationMain.
                if (materialDTO.getMaterialName().equals("PVC MAT")) {
                    System.out.println("_____materialDTO___________>>>>>>>" + materialDTO);
                }
                SelectedQuotationMaterial material = mapSelectedMaterialDTOToEntity(materialDTO, entity);

                if (materialDTO.getMaterialName().equals("PVC MAT")) {
                    System.out.println("_____SelectedQuotationMaterial___________>>>>>>>" + material);
                }

                incomingSelectedMaterials.add(material);
            }
        }

        // Synchronize the current persisted collection with the incoming list.
        // Since orphanRemoval=true is set on the @OneToMany, clearing and re-adding handles CRUD.
        entity.getSelectedMaterials().clear();
        entity.getSelectedMaterials().addAll(incomingSelectedMaterials);

        return entity;
    }

//    private QuotationLiftDetail mapLiftDetailDTOToEntity(QuotationLiftDetailRequestDTO dto, QuotationMain main, QuotationLiftDetail entity) {

    /// /        QuotationLiftDetail entity = new QuotationLiftDetail();
//
//        // 🔹 Primary & Basic Info
//        entity.setLiftQuotationNo(dto.getLiftQuotationNo());
//        entity.setQuotationMain(main);
//        entity.setLiftQuantity(dto.getLiftQuantity());
//        entity.setStops(dto.getStops());
//        entity.setFloors(dto.getFloors());
//        entity.setOpenings(dto.getOpenings());
//        entity.setFloorDesignations(dto.getFloorDesignations());
//
//        if (dto.getFloorSelectionIds() != null && !dto.getFloorSelectionIds().isEmpty()) {
//            entity.setFloorSelections(
//                    dto.getFloorSelectionIds().stream()
//                            .map(id -> ref(AdditionalFloors.class, id))
//                            .collect(Collectors.toList())
//            );
//        } else {
//            entity.setFloorSelections(new ArrayList<>());
//        }
//
//
//        entity.setCarTravel(dto.getCarTravel());
//        entity.setSpeed(dto.getSpeed());
//        entity.setQuotationDate(dto.getQuotationDate());
//
//        // 🔹 Lead & Enquiry
//        if (dto.getLeadId() != null) {
//            NewLeads lead = new NewLeads();
//            lead.setLeadId(dto.getLeadId().intValue());
//            entity.setLead(lead);
//        }
//        entity.setLeadTypeId(dto.getLeadTypeId());
//        entity.setLeadDate(dto.getLeadDate());
//
//        if (dto.getCombinedEnquiryId() != null)
//            entity.setCombinedEnquiry(ref(CombinedEnquiry.class, dto.getCombinedEnquiryId().intValue()));
//
//        if (dto.getEnquiryId() != null)
//            entity.setEnquiry(ref(Enquiry.class, dto.getEnquiryId().intValue()));
//
//        entity.setEnquiryTypeId(dto.getEnquiryTypeId());
//        entity.setEnqDate(dto.getEnqDate());
//
//        // 🔹 Lift Configuration Relations
//        if (dto.getLiftTypeId() != null) entity.setLiftType(ref(OperatorElevator.class, dto.getLiftTypeId()));
//        if (dto.getTypeOfLiftId() != null) entity.setTypeOfLift(ref(TypeOfLift.class, dto.getTypeOfLiftId()));
//        if (dto.getMachineRoomId() != null) entity.setMachineRoom(ref(MachineRoom.class, dto.getMachineRoomId()));
//        if (dto.getCapacityTypeId() != null) entity.setCapacityType(ref(CapacityType.class, dto.getCapacityTypeId()));
//        if (dto.getPersonCapacityId() != null)
//            entity.setPersonCapacity(ref(PersonCapacity.class, dto.getPersonCapacityId()));
//        if (dto.getWeightId() != null) entity.setWeight(ref(Weight.class, dto.getWeightId()));
//        if (dto.getCabinTypeId() != null) entity.setCabinType(ref(CabinType.class, dto.getCabinTypeId()));
//        if (dto.getCabinSubTypeId() != null) entity.setCabinSubType(ref(CabinSubType.class, dto.getCabinSubTypeId()));
//        if (dto.getInstallationAmountRuleId() != null)
//            entity.setInstallationRule(ref(InstallationRule.class, dto.getInstallationAmountRuleId()));
//
//        // 🔹 Cabin Design
//        if (dto.getLightFittingId() != null) entity.setLightFitting(ref(LightFitting.class, dto.getLightFittingId()));
//        if (dto.getCabinFlooringId() != null)
//            entity.setCabinFlooring(ref(CabinFlooring.class, dto.getCabinFlooringId()));
//        if (dto.getCabinCeilingId() != null) entity.setCabinCeiling(ref(CabinCeiling.class, dto.getCabinCeilingId()));
//        if (dto.getAirSystemId() != null) entity.setAirSystem(ref(AirSystem.class, dto.getAirSystemId()));
//        if (dto.getCarEntranceId() != null) entity.setCarEntrance(ref(CarDoorType.class, dto.getCarEntranceId()));
//        if (dto.getCarEntranceSubTypeId() != null)
//            entity.setCarEntranceSubType(ref(CarDoorSubType.class, dto.getCarEntranceSubTypeId()));
//        if (dto.getLandingEntranceSubType1Id() != null)
//            entity.setLandingEntranceSubType1(ref(LandingDoorSubType.class, dto.getLandingEntranceSubType1Id()));
//        if (dto.getLandingEntranceSubType2Id() != null)
//            entity.setLandingEntranceSubType2(ref(LandingDoorSubType.class, dto.getLandingEntranceSubType2Id()));
//
//        entity.setLandingEntranceCount(dto.getLandingEntranceCount());
//        entity.setLandingEntranceSubType2_fromFloor(dto.getLandingEntranceSubType2_fromFloor());
//        entity.setLandingEntranceSubType2_toFloor(dto.getLandingEntranceSubType2_toFloor());
//
//        // 🔹 Additional Cabin Attributes
//        if (dto.getControlPanelTypeId() != null)
//            entity.setControlPanelType(ref(ControlPanelType.class, dto.getControlPanelTypeId()));
//        if (dto.getWiringHarnessId() != null) entity.setWiringHarness(ref(Harness.class, dto.getWiringHarnessId()));
//        if (dto.getGuideRailId() != null) entity.setGuideRail(ref(CounterWeight.class, dto.getGuideRailId()));
//        if (dto.getBracketTypeId() != null) entity.setBracketType(ref(BracketType.class, dto.getBracketTypeId()));
//        if (dto.getRopingTypeId() != null) entity.setRopingType(ref(WireRope.class, dto.getRopingTypeId()));
//        if (dto.getLopTypeId() != null) entity.setLopType(ref(LopType.class, dto.getLopTypeId()));
//        if (dto.getCopTypeId() != null) entity.setCopType(ref(Cop.class, dto.getCopTypeId()));
//        if (dto.getOperationTypeId() != null)
//            entity.setOperationType(ref(OperationType.class, dto.getOperationTypeId()));
//
//        entity.setManufacture(dto.getManufacture());
//        entity.setOverhead(dto.getOverhead());
//        entity.setMachineRoomDepth(dto.getMachineRoomDepth());
//        entity.setMachineRoomWidth(dto.getMachineRoomWidth());
//        entity.setShaftWidth(dto.getShaftWidth());
//        entity.setShaftDepth(dto.getShaftDepth());
//        entity.setCarInternalWidth(dto.getCarInternalWidth());
//        entity.setCarInternalDepth(dto.getCarInternalDepth());
//        entity.setCarInternalHeight(dto.getCarInternalHeight());
//        entity.setStdFeatureIds(dto.getStdFeatureIds());
//
//        // 🔹 Pricing & Flags
//        entity.setLiftRate(dto.getLiftRate());
//        entity.setPwdIncludeExclude(dto.getPwdIncludeExclude());
//        entity.setScaffoldingIncludeExclude(dto.getScaffoldingIncludeExclude());
//        entity.setTotalAmount(dto.getTotalAmount());
//        entity.setCommercialTotal(dto.getCommercialTotal());
//        entity.setCommercialTaxAmount(dto.getCommercialTaxAmount());
//        entity.setCommercialFinalAmount(dto.getCommercialFinalAmount());
//        entity.setArdPrice(dto.getArdPrice());
//        entity.setMachinePrice(dto.getMachinePrice());
//        entity.setGovernorPrice(dto.getGovernorPrice());
//        entity.setTruffingPrice(dto.getTruffingPrice());
//        entity.setFastenerPrice(dto.getFastenerPrice());
//        entity.setInstallationAmount(dto.getInstallationAmount());
//        entity.setManualPrice(dto.getManualPrice());
//
//        // 🔹 Price Breakdown
//        entity.setCabinPrice(dto.getCabinPrice());
//        entity.setLightFittingPrice(dto.getLightFittingPrice());
//        entity.setCabinFlooringPrice(dto.getCabinFlooringPrice());
//        entity.setCabinCeilingPrice(dto.getCabinCeilingPrice());
//        entity.setAirSystemPrice(dto.getAirSystemPrice());
//        entity.setCarEntrancePrice(dto.getCarEntrancePrice());
//        entity.setLandingEntrancePrice1(dto.getLandingEntrancePrice1());
//        entity.setLandingEntrancePrice2(dto.getLandingEntrancePrice2());
//        entity.setControlPanelTypePrice(dto.getControlPanelTypePrice());
//        entity.setWiringHarnessPrice(dto.getWiringHarnessPrice());
//        entity.setGuideRailPrice(dto.getGuideRailPrice());
//        entity.setBracketTypePrice(dto.getBracketTypePrice());
//        entity.setWireRopePrice(dto.getWireRopePrice());
//        entity.setRopingTypePrice(dto.getRopingTypePrice());
//        entity.setLopTypePrice(dto.getLopTypePrice());
//        entity.setCopTypePrice(dto.getCopTypePrice());
//
//        // 🔹 Other Charges
//        entity.setPwdAmount(dto.getPwdAmount());
//        entity.setBambooScaffolding(dto.getBambooScaffolding());
//        entity.setArdAmount(dto.getArdAmount());
//        entity.setOverloadDevice(dto.getOverloadDevice());
//        entity.setTransportCharges(dto.getTransportCharges());
//        entity.setOtherCharges(dto.getOtherCharges());
//        entity.setPowerBackup(dto.getPowerBackup());
//        entity.setFabricatedStructure(dto.getFabricatedStructure());
//        entity.setElectricalWork(dto.getElectricalWork());
//        entity.setIbeamChannel(dto.getIbeamChannel());
//        entity.setDuplexSystem(dto.getDuplexSystem());
//        entity.setTelephonicIntercom(dto.getTelephonicIntercom());
//        entity.setGsmIntercom(dto.getGsmIntercom());
//        entity.setNumberLockSystem(dto.getNumberLockSystem());
//        entity.setThumbLockSystem(dto.getThumbLockSystem());
//        entity.setTruffingQty(dto.getTruffingQty());
//        entity.setTruffingType(dto.getTruffingType());
//        entity.setFastenerType(dto.getFastenerType());
//
//        // 🔹 Other Info
//        entity.setPitDepth(dto.getPitDepth());
//        entity.setMainSupplySystem(dto.getMainSupplySystem());
//        entity.setAuxlSupplySystem(dto.getAuxlSupplySystem());
//        entity.setSignals(dto.getSignals());
//
//        return entity;
//    }
    private QuotationMainResponseDTO mapQuotationEntityToResponseDTO(QuotationMain entity) {
        QuotationMainResponseDTO dto = new QuotationMainResponseDTO();

        final Optional<NewLeads> leadOpt = Optional.ofNullable(entity.getLead());
        final Optional<Employee> createdByOpt = Optional.ofNullable(entity.getCreatedBy());
        final Optional<Employee> finalizedByOpt = Optional.ofNullable(entity.getFinalizedBy());
        final Optional<Employee> deletedByOpt = Optional.ofNullable(entity.getDeletedBy());
        final Optional<CombinedEnquiry> combinedEnquiryOpt = Optional.ofNullable(entity.getCombinedEnquiry());

        dto.setId(entity.getId());
        dto.setQuotationNo(entity.getQuotationNo());
        dto.setQuotationDate(entity.getQuotationDate());
        dto.setEdition(entity.getEdition());
        dto.setTotalAmount(entity.getTotalAmount());
        dto.setStatus(entity.getStatus().name());
        dto.setRemarks(entity.getRemarks());

        // --- Lead / Enquiry ---
        dto.setLeadId(leadOpt.map(NewLeads::getLeadId).orElse(null));
        dto.setLeadTypeId(entity.getLeadTypeId());
        dto.setLeadDate(entity.getLeadDate());
        dto.setCombinedEnquiryId(combinedEnquiryOpt.map(CombinedEnquiry::getId).orElse(null));
        dto.setEnquiryTypeId(entity.getEnquiryTypeId());

        // --- Customer / Site ---
        dto.setCustomerName(entity.getCustomerName());
        dto.setCustomerName2(leadOpt.map(NewLeads::getCustomerName2).orElse(null));
//        dto.setCustomerName(leadOpt.map(NewLeads::getCustomer1Contact).orElse(entity.getCustomerName()));
        dto.setCustomerId(entity.getCustomerId());
        dto.setCustomerAdder(leadOpt.map(NewLeads::getAddress).orElse(null));
        dto.setCustomerStd(leadOpt.map(NewLeads::getStatus).orElse(null)); // Assuming Status field holds the STD code
        dto.setContactNumber(leadOpt.map(NewLeads::getContactNo).orElse(null));
        dto.setContactNumber1(leadOpt.map(NewLeads::getCustomer1Contact).orElse(null));
        dto.setContactNumber2(leadOpt.map(NewLeads::getCustomer2Contact).orElse(null));
        dto.setSalutations1(leadOpt.map(NewLeads::getSalutations).orElse(null));
        dto.setSalutations2(leadOpt.map(NewLeads::getSalutations2).orElse(null));

        dto.setSiteName(entity.getSiteName());
        dto.setSiteId(entity.getSiteId());
        dto.setSiteAdder(leadOpt.map(NewLeads::getSiteAddress).orElse(null));

        // --- Created / Approved ---
        dto.setCreatedByEmployeeId(createdByOpt.map(Employee::getEmployeeId).orElse(null));
        dto.setCreatedByEmployeeName(createdByOpt.map(Employee::getEmployeeName).orElse(null));
        dto.setEmployeeContactNumber(createdByOpt.map(Employee::getContactNumber).orElse(null));
        dto.setEmployeeRoleId(createdByOpt.map(Employee::getEmployeeId).orElse(null));
        dto.setEmployeeRoleName(createdByOpt.map(Employee::getEmployeeName).orElse(null));


        dto.setCreatedAt(entity.getCreatedAt());
        dto.setIsFinalized(entity.getIsFinalized());
        dto.setFinalizedByEmployeeId(finalizedByOpt.map(Employee::getEmployeeId).orElse(null));
        dto.setFinalizedByEmployeeName(finalizedByOpt.map(Employee::getEmployeeName).orElse(null));

        dto.setFinalizedAt(entity.getFinalizedAt());
        dto.setIsDeleted(entity.getIsDeleted());
        dto.setDeletedByEmployeeId(deletedByOpt.map(Employee::getEmployeeId).orElse(null));
        dto.setDeletedByEmployeeName(deletedByOpt.map(Employee::getEmployeeName).orElse(null));
        dto.setDeletedAt(entity.getDeletedAt());

        // --- Lift Details ---
        List<QuotationLiftDetailResponseDTO> liftResponses = entity.getLiftDetails().stream()
                .map(this::mapLiftDetailEntityToDTO)
                .collect(Collectors.toList());
        dto.setLiftDetails(liftResponses);

        return dto;
    }

    private QuotationLiftDetailResponseDTO mapLiftDetailEntityToDTO(QuotationLiftDetail entity) {
        if (entity == null) return null;

        return QuotationLiftDetailResponseDTO.builder()
                .id(entity.getId())
                .liftQuotationNo(entity.getLiftQuotationNo())
                .quotationDate(entity.getQuotationDate())

                // --- References ---
                .quotationMainId(Long.valueOf(entity.getQuotationMain() != null ? entity.getQuotationMain().getId() : null))
                .leadId(Long.valueOf(entity.getLead() != null ? entity.getLead().getLeadId() : null))
                .leadName(entity.getLead() != null ? entity.getLead().getLeadCompanyName() + " - " + entity.getLead().getSiteName() : null)
                .leadTypeId(entity.getLeadTypeId())
                .leadDate(entity.getLeadDate())

                .combinedEnquiryId(Long.valueOf(entity.getCombinedEnquiry() != null ? entity.getCombinedEnquiry().getId() : null))
                .enquiryId(Long.valueOf(entity.getEnquiry() != null ? entity.getEnquiry().getEnquiryId() : null))
//                .enquiryNo(entity.getEnquiry() != null ? entity.getEnquiry().getEnquiryNo() : null)
                .enquiryTypeId(entity.getEnquiryTypeId())
                .enqDate(entity.getEnqDate())

                // --- Lift Config ---
                .liftType(entity.getLiftType() != null ? entity.getLiftType().getId() : null)
                .liftTypeName(entity.getLiftType() != null ? entity.getLiftType().getName() : null)
                .typeOfLift(entity.getTypeOfLift() != null ? entity.getTypeOfLift().getId() : null)
                .typeOfLiftName(entity.getTypeOfLift() != null ? entity.getTypeOfLift().getLiftTypeName() : null)
                .machineRoom(entity.getMachineRoom() != null ? entity.getMachineRoom().getId() : null)
                .machineRoomName(entity.getMachineRoom() != null ? entity.getMachineRoom().getMachineRoomName() : null)
                .capacityType(entity.getCapacityType() != null ? entity.getCapacityType().getId() : null)
                .capacityTypeName(entity.getCapacityType() != null ? entity.getCapacityType().getType() : null)
                .personCapacity(entity.getPersonCapacity() != null ? entity.getPersonCapacity().getId() : null)
                .personCapacityName(entity.getPersonCapacity() != null ? entity.getPersonCapacity().getDisplayName() : null)
                .weight(entity.getWeight() != null ? entity.getWeight().getId() : null)
                .weightName(entity.getWeight() != null ? entity.getWeight().getWeightValue() + " " + entity.getWeight().getUnit().getUnitName() : null)
                .cabinType(entity.getCabinType() != null ? entity.getCabinType().getId() : null)
                .cabinTypeName(entity.getCabinType() != null ? entity.getCabinType().getCabinType() : null)
                .cabinSubType(entity.getCabinSubType() != null ? entity.getCabinSubType().getId() : null)
                .cabinSubTypeName(entity.getCabinSubType() != null ? entity.getCabinSubType().getCabinSubName() : null)
                .installationRuleId(Math.toIntExact(entity.getInstallationRule() != null ? entity.getInstallationRule().getId() : null))
                .installationRuleName(entity.getInstallationRule() != null ? entity.getInstallationRule().getBaseAmount() + " + " + entity.getInstallationRule().getExtraAmount() : null)

                .liftQuantity(entity.getLiftQuantity())
                .stops(entity.getStops())
                .floors(entity.getFloors())
                .openings(entity.getOpenings())
                .floorDesignations(entity.getFloorDesignations())
                .floorSelectionLabels(entity.getFloorSelections() != null
                        ? entity.getFloorSelections().stream()
                        .map(AdditionalFloors::getLabel)
                        .collect(Collectors.toList())
                        : null)
                .floorSelectionIds(entity.getFloorSelections() != null
                        ? entity.getFloorSelections().stream()
                        .map(AdditionalFloors::getId)
                        .collect(Collectors.toList())
                        : null)

                .carTravel(entity.getCarTravel())
                .speed(entity.getSpeed())

                // --- Cabin Design ---
                .lightFitting(entity.getLightFitting() != null ? entity.getLightFitting().getId() : null)
                .lightFittingName(entity.getLightFitting() != null ? entity.getLightFitting().getName() : null)
                .cabinFlooring(entity.getCabinFlooring() != null ? entity.getCabinFlooring().getId() : null)
                .cabinFlooringName(entity.getCabinFlooring() != null ? entity.getCabinFlooring().getFlooringName() : null)
                .cabinCeiling(entity.getCabinCeiling() != null ? entity.getCabinCeiling().getId() : null)
                .cabinCeilingName(entity.getCabinCeiling() != null ? entity.getCabinCeiling().getCeilingName() : null)
//                .airSystemId(entity.getAirSystem() != null ? entity.getAirSystem().getId() : null)
//                .airSystemName(entity.getAirSystem() != null ? entity.getAirSystem().getAirType().getName() : null)
                .airType(entity.getAirType() != null ? entity.getAirType().getId() : null)
                .airTypeName(entity.getAirType() != null ? entity.getAirType().getName() : null)
                .carEntrance(entity.getCarEntrance() != null ? entity.getCarEntrance().getCarDoorId() : null)
                .carEntranceName(entity.getCarEntrance() != null ? entity.getCarEntrance().getCarDoorType() : null)
                .carEntranceSubType(entity.getCarEntranceSubType() != null ? entity.getCarEntranceSubType().getId() : null)
                .carEntranceSubTypeName(entity.getCarEntranceSubType() != null ? entity.getCarEntranceSubType().getCarDoorSubtype() : null)
                .landingEntranceSubType1(entity.getLandingEntranceSubType1() != null ? entity.getLandingEntranceSubType1().getId() : null)
                .landingEntranceSubType1Name(entity.getLandingEntranceSubType1() != null ? entity.getLandingEntranceSubType1().getName() : null)
                .landingEntranceSubType2(entity.getLandingEntranceSubType2() != null ? entity.getLandingEntranceSubType2().getId() : null)
                .landingEntranceSubType2Name(entity.getLandingEntranceSubType2() != null ? entity.getLandingEntranceSubType2().getName() : null)
                .landingEntranceCount(entity.getLandingEntranceCount())
                .landingEntranceSubType2_fromFloor(entity.getLandingEntranceSubType2_fromFloor())
                .landingEntranceSubType2_toFloor(entity.getLandingEntranceSubType2_toFloor())

                // --- Control Panel & Wiring ---
                .controlPanelType(entity.getControlPanelType() != null ? entity.getControlPanelType().getId() : null)
                .controlPanelTypeName(entity.getControlPanelType() != null ? entity.getControlPanelType().getControlPanelType() : null)
                .manufacture(entity.getManufacture())
                .wiringHarness(entity.getWiringHarness() != null ? entity.getWiringHarness().getId() : null)
                .wiringHarnessName(entity.getWiringHarness() != null ? entity.getWiringHarness().getName() : null)
                .guideRail(entity.getGuideRail() != null ? entity.getGuideRail().getId() : null)
                .guideRailName(entity.getGuideRail() != null ? entity.getGuideRail().getCounterWeightName() : null)
                .bracketType(entity.getBracket() != null ? entity.getBracket().getId() : null)
                .bracketTypeName(entity.getBracket() != null ? entity.getBracket().getBracketType().getName() : null)
                .ropingType(entity.getRopingType() != null ? entity.getRopingType().getId() : null)
                .ropingTypeName(entity.getRopingType() != null ? entity.getRopingType().getWireRopeType().getWireRopeType() : null)
                .lopType(entity.getLopType() != null ? entity.getLopType().getId() : null)
                .lopTypeName(entity.getLopType() != null ? entity.getLopType().getLopName() : null)
                .copType(entity.getCopType() != null ? entity.getCopType().getId() : null)
                .copTypeName(entity.getCopType() != null ? entity.getCopType().getCopName() : null)
                .overhead(entity.getOverhead())
                .operationType(entity.getOperationType() != null ? entity.getOperationType().getId() : null)
                .operationTypeName(entity.getOperationType() != null ? entity.getOperationType().getName() : null)

                // --- Dimensions ---
                .machineRoomDepth(entity.getMachineRoomDepth())
                .machineRoomWidth(entity.getMachineRoomWidth())
                .shaftWidth(entity.getShaftWidth())
                .shaftDepth(entity.getShaftDepth())
                .carInternalWidth(entity.getCarInternalWidth())
                .carInternalDepth(entity.getCarInternalDepth())
                .carInternalHeight(entity.getCarInternalHeight())

                .stdFeatureIds(entity.getStdFeatureIds())

                // --- Additional Components ---
                .vfdMainDrive(entity.getVfdMainDrive() != null ? entity.getVfdMainDrive().getId() : null)
                .vfdMainDriveName(entity.getVfdMainDrive() != null ? entity.getVfdMainDrive().getName() : null)
                .doorOperator(entity.getDoorOperator() != null ? entity.getDoorOperator().getId() : null)
                .doorOperatorName(entity.getDoorOperator() != null ? entity.getDoorOperator().getName() : null)
                .mainMachineSet(entity.getMainMachineSet() != null ? entity.getMainMachineSet().getId() : null)
                .mainMachineSetName(entity.getMainMachineSet() != null ? entity.getMainMachineSet().getName() : null)
                .carRails(entity.getCarRails() != null ? entity.getCarRails().getId() : null)
                .carRailsName(entity.getCarRails() != null ? entity.getCarRails().getName() : null)
                .counterWeightRails(entity.getCounterWeightRails() != null ? entity.getCounterWeightRails().getId() : null)
                .counterWeightRailsName(entity.getCounterWeightRails() != null ? entity.getCounterWeightRails().getName() : null)
                .wireRope(entity.getWireRope() != null ? entity.getWireRope().getId() : null)
                .wireRopeName(entity.getWireRope() != null ? entity.getWireRope().getName() : null)
                .controlPanelMake(entity.getControlPanelMake() != null ? entity.getControlPanelMake().getId() : null)
                .controlPanelMakeName(entity.getControlPanelMake() != null ? entity.getControlPanelMake().getName() : null)
                .warrantyPeriod(entity.getWarrantyPeriod() != null ? entity.getWarrantyPeriod().getId() : null)
                .warrantyPeriodName(entity.getWarrantyPeriod() != null ? entity.getWarrantyPeriod().getWarrantyMonth() + " Months" : null)

                // --- Pricing & Charges ---
                .liftRate(entity.getLiftRate())
                .pwdIncludeExclude(entity.getPwdIncludeExclude())
                .scaffoldingIncludeExclude(entity.getScaffoldingIncludeExclude())

                .totalAmount(entity.getTotalAmount())
                .totalAmountWithoutGST(entity.getTotalAmountWithoutGST())
                .totalAmountWithoutLoad(entity.getTotalAmountWithoutLoad())
                .isLiftRateManual(entity.getIsLiftRateManual())
                .commercialTotal(entity.getCommercialTotal())
                .commercialTaxAmount(entity.getCommercialTaxAmount())
                .commercialFinalAmount(entity.getCommercialFinalAmount())
                .tax(entity.getTax())
                .loadAmt(entity.getLoadAmt())
                .loadPerAmt(entity.getLoadPerAmt())

                // --- Internal Fields ---
                .ardPrice(entity.getArdPrice())
                .machinePrice(entity.getMachinePrice())
                .governorPrice(entity.getGovernorPrice())
                .truffingPrice(entity.getTruffingPrice())
                .fastenerPrice(entity.getFastenerPrice())
                .installationAmount(entity.getInstallationAmount())
                .manualPrice(entity.getManualPrice())
                .commonPrice(entity.getCommonPrice())
                .otherPrice(entity.getOtherPrice())

                // Inside mapLiftDetailEntityToDTO
                .selectedMaterials(entity.getSelectedMaterials() != null
                        ? entity.getSelectedMaterials().stream()
                        // Your mapMaterialEntityToResponseDTO method returns SelectedMaterialResponseDTO
                        .map(this::mapMaterialEntityToResponseDTO)
                        .collect(Collectors.toList())
                        : Collections.emptyList())

                // --- Breakdown ---
                .cabinPrice(entity.getCabinPrice())
                .lightFittingPrice(entity.getLightFittingPrice())
                .cabinFlooringPrice(entity.getCabinFlooringPrice())
                .cabinCeilingPrice(entity.getCabinCeilingPrice())
                .airSystemPrice(entity.getAirSystemPrice())
                .carEntrancePrice(entity.getCarEntrancePrice())
                .landingEntrancePrice1(entity.getLandingEntrancePrice1())
                .landingEntrancePrice2(entity.getLandingEntrancePrice2())

                .controlPanelTypePrice(entity.getControlPanelTypePrice())
                .wiringHarnessPrice(entity.getWiringHarnessPrice())
                .guideRailPrice(entity.getGuideRailPrice())
                .bracketTypePrice(entity.getBracketTypePrice())
                .wireRopePrice(entity.getWireRopePrice())
                .ropingTypePrice(entity.getRopingTypePrice())
                .lopTypePrice(entity.getLopTypePrice())
                .copTypePrice(entity.getCopTypePrice())

                // --- Other Charges ---
                .pwdAmount(entity.getPwdAmount())
                .bambooScaffolding(entity.getBambooScaffolding())
                .ardAmount(entity.getArdAmount())
                .overloadDevice(entity.getOverloadDevice())
                .transportCharges(entity.getTransportCharges())
                .otherCharges(entity.getOtherCharges())
                .powerBackup(entity.getPowerBackup())
                .fabricatedStructure(entity.getFabricatedStructure())
                .electricalWork(entity.getElectricalWork())
                .ibeamChannel(entity.getIbeamChannel())
                .duplexSystem(entity.getDuplexSystem())
                .telephonicIntercom(entity.getTelephonicIntercom())
                .gsmIntercom(entity.getGsmIntercom())
                .numberLockSystem(entity.getNumberLockSystem())
                .thumbLockSystem(entity.getThumbLockSystem())

                .truffingQty(entity.getTruffingQty())
                .truffingType(entity.getTruffingType())
                .fastenerType(entity.getFastenerType())

                // --- Misc Info ---
                .pitDepth(entity.getPitDepth())
                .mainSupplySystem(entity.getMainSupplySystem())
                .auxlSupplySystem(entity.getAuxlSupplySystem())
                .signals(entity.getSignals())

                .isSaved(entity.getIsSaved())
                .isFinalized(entity.getIsFinalized())

                .build();
    }

    /**
     * Maps QuotationMain entity to DTO, explicitly excluding liftDetails.
     *
     * @param entity The QuotationMain entity.
     * @return The QuotationMainResponseDTO.
     */
    private QuotationMainResponseDTO mapQuotationMainToResponseDTOWithoutLifts(QuotationMain entity) {
        Employee createdBy = entity.getCreatedBy();
        Employee finalizedBy = entity.getFinalizedBy();
        Employee deletedBy = entity.getDeletedBy();

        System.out.println("Mapping QuotationMain ID " + entity.getId() + " without lift details isFinalised:" + entity.getIsFinalized());
        return QuotationMainResponseDTO.builder()
                .id(entity.getId())
                .quotationNo(entity.getQuotationNo())
                .quotationDate(entity.getQuotationDate())
                .edition(entity.getEdition())
                .totalAmount(entity.getTotalAmount())
                .status(entity.getStatus().name())
                .remarks(entity.getRemarks())

                // Lead & Enquiry
                .leadId(entity.getLead() != null ? entity.getLead().getLeadId() : null)
                .leadTypeId(entity.getLeadTypeId())
                .leadDate(entity.getLeadDate())
                .combinedEnquiryId(entity.getCombinedEnquiry() != null ? entity.getCombinedEnquiry().getId() : null)
                .enquiryTypeId(entity.getEnquiryTypeId())

                // Customer & Site
                .customerName(entity.getCustomerName())
                .customerId(entity.getCustomerId())
//                .customerAdder(entity.getLead() != null ? entity.getLead().getAddress() : null)
//                .customerStd(entity.getLead() != null ? entity.getLead().getStatus() : null)

                .siteName(entity.getSiteName())
                .siteId(entity.getSiteId())
//                .siteAdder(entity.getLead() != null ? entity.getLead().getSiteAddress() : null)

                // Created / Approved info
                .createdByEmployeeId(createdBy != null ? createdBy.getEmployeeId() : null)
                .createdByEmployeeName(createdBy != null ? createdBy.getEmployeeName() + " - " + createdBy.getUsername() : null) // Adjust names as needed
                .createdAt(entity.getCreatedAt())
                .isFinalized(entity.getIsFinalized())
                .finalizedByEmployeeId(finalizedBy != null ? finalizedBy.getEmployeeId() : null)
                .finalizedByEmployeeName(finalizedBy != null ? finalizedBy.getEmployeeName() + " - " + finalizedBy.getUsername() : null) // Adjust names as needed
                .finalizedAt(entity.getFinalizedAt())
                .isDeleted(entity.getIsDeleted())
                .deletedByEmployeeId(deletedBy != null ? deletedBy.getEmployeeId() : null)
                .deletedByEmployeeName(deletedBy != null ? deletedBy.getEmployeeName() + " - " + finalizedBy.getUsername() : null) // Adjust names as needed
                .deletedAt(entity.getDeletedAt())

                // 💡 IMPORTANT: Do NOT call .getLiftDetails() here, and leave the liftDetails field empty/null
                .liftDetails(List.of()) // Explicitly set to an empty list
                .build();
    }


    // **********mapping for SelectedQuotationMaterial from SelectedMaterialRequestDTO **********
    // Assuming this helper method is defined in the same service class
    private SelectedQuotationMaterial mapSelectedMaterialDTOToEntity(
            SelectedMaterialRequestDTO dto,
            QuotationLiftDetail liftDetailEntity) { // <-- NEW PARENT

        SelectedQuotationMaterial material;

        if (dto.getId() != null) {
            // Look up and update existing material entity
            material = selectedQuotationMaterialRepository.findById(dto.getId())
                    .orElse(new SelectedQuotationMaterial());
        } else {
            material = new SelectedQuotationMaterial();
        }

        // Set the CRITICAL bidirectional link
        material.setQuotationLiftDetail(liftDetailEntity); // Assuming the field name in entity is quotationLiftDetail

        material.setMaterialName(dto.getMaterialName());
        material.setMaterialType(dto.getMaterialType());
        material.setMaterialDisplayName(dto.getMaterialDisplayName());
        material.setQuantity(dto.getQuantity());
        material.setQuantityUnit(dto.getQuantityUnit());
        material.setPrice(dto.getPrice());
        material.setMaterialId(dto.getMaterialId());
        material.setOperatorType(dto.getOperatorType());

        // Set leadId from the parent QuotationMain via LiftDetail if necessary
        if (liftDetailEntity.getLead() != null) {
            // Assuming getLeadId() exists on NewLeads or you have a way to get it
            material.setLeadId(liftDetailEntity.getLead().getLeadId());
        }

        return material;
    }
    // **********mapping for SelectedMaterialResponseDTO from SelectedQuotationMaterial **********

    private SelectedMaterialResponseDTO mapMaterialEntityToResponseDTO(SelectedQuotationMaterial entity) {
        SelectedMaterialResponseDTO dto = new SelectedMaterialResponseDTO();
        dto.setId(entity.getId());
        dto.setLeadId(entity.getLeadId());
        dto.setQuotationLiftDetailId(Math.toIntExact(entity.getQuotationLiftDetail().getId()));
        dto.setMaterialName(entity.getMaterialName());
        dto.setMaterialType(entity.getMaterialType());
        dto.setMaterialDisplayName(entity.getMaterialDisplayName());
        dto.setQuantity(entity.getQuantity());
        dto.setQuantityUnit(entity.getQuantityUnit());
        dto.setPrice(entity.getPrice());
        dto.setMaterialId(entity.getMaterialId());

        // Calculate total amount for the DTO
        if (entity.getQuantity() != null && entity.getPrice() != null) {
            dto.setTotalAmount(entity.getQuantity() * entity.getPrice());
        } else {
            dto.setTotalAmount(0.0);
        }
        return dto;
    }


    // **********mapping for QuotationLiftMaterial from ManualOrCommonMaterialDTO **********
// Logic for your service class (replace Long with the actual ID type of QuotationLiftMaterial)
    private QuotationLiftMaterial mapMaterialDTOToLiftMaterialEntity(
            ManualOrCommonMaterialDTO dto,
            QuotationLiftDetail parentEntity,
            String listType) { // <--- Added listType parameter

        QuotationLiftMaterial material;

        if (dto.getId() != null) {
            // Find existing material to update (Placeholder for repository call)
            // **IMPORTANT**: You must implement/inject a service/repository to fetch the existing entity.
            material = quotationLiftMaterialRepository.findById(dto.getId())
                    .orElse(new QuotationLiftMaterial());

            if (material == null) {
                // If the entity wasn't found (e.g., deleted by another process), treat it as new.
                material = new QuotationLiftMaterial();
            }
        } else {
            // Create a new material entity
            material = new QuotationLiftMaterial();
        }

        // --- Data Mapping ---

        // 🛑 CRITICAL FIX: SET THE BIDIRECTIONAL LINK
        // This resolves the "detached entity passed to persist" error.
        material.setLiftDetail(parentEntity);

        // Set the list type (MANUAL or COMMON)
        material.setListType(listType);

        // Core Material Details
        material.setOtherMaterialName(dto.getOtherMaterialName());
        material.setOtherMaterialMainId(dto.getOtherMaterialMainId());
        material.setOtherMaterialMainName(dto.getOtherMaterialMainName());
        material.setOtherMaterialMainActive(dto.getOtherMaterialMainActive());
        material.setOtherMaterialMainRule(dto.getOtherMaterialMainRule());
        material.setOtherMaterialMainIsSystemDefined(dto.getOtherMaterialMainIsSystemDefined());

        // Pricing & Quantity
        material.setQuantity(dto.getQuantity()); // String

        // Safety check for price (it's Double in the entity)
        if (dto.getPrice() != null) {
            material.setPrice(dto.getPrice().doubleValue());
        } else {
            material.setPrice(null);
        }

        // Optional Configuration Fields
        material.setOperatorTypeId(dto.getOperatorTypeId());
        material.setOperatorTypeName(dto.getOperatorTypeName());
        material.setMachineRoomId(dto.getMachineRoomId());
        material.setMachineRoomName(dto.getMachineRoomName());
        material.setCapacityTypeId(dto.getCapacityTypeId());
        material.setCapacityTypeName(dto.getCapacityTypeName());
        material.setPersonCapacityId(dto.getPersonCapacityId());
        material.setPersonCapacityName(dto.getPersonCapacityName());
        material.setWeightId(dto.getWeightId());
        material.setWeightName(dto.getWeightName());

        // Floors/Floor Labels (Handling potential nulls/type conversion if needed)
        material.setFloors(dto.getFloors());
        material.setFloorsLabel(dto.getFloorsLabel());

        return material;
    }

//    private <T> T ref(Class<T> clazz, Number id) {
//        try {
//            T instance = clazz.getDeclaredConstructor().newInstance();
//
//            // Try to find a setter that accepts Integer or Long (or primitive int/long)
//            try {
//                Method setId = clazz.getMethod("setId", Integer.class);
//                setId.invoke(instance, id.intValue());
//                return instance;
//            } catch (NoSuchMethodException ignored) {
//            }
//
//            try {
//                Method setId = clazz.getMethod("setId", int.class);
//                setId.invoke(instance, id.intValue());
//                return instance;
//            } catch (NoSuchMethodException ignored) {
//            }
//
//            try {
//                Method setId = clazz.getMethod("setId", Long.class);
//                setId.invoke(instance, id.longValue());
//                return instance;
//            } catch (NoSuchMethodException ignored) {
//            }
//
//            try {
//                Method setId = clazz.getMethod("setId", long.class);
//                setId.invoke(instance, id.longValue());
//                return instance;
//            } catch (NoSuchMethodException ignored) {
//            }
//
//            // Fallback: try common alternative setter names e.g. setAdditionalFloorId, setCarDoorId, etc.
//            // You can add more attempts here if some entities use different setter names.
//            throw new NoSuchMethodException("No suitable setId method found on " + clazz.getSimpleName());
//
//        } catch (Exception e) {
//            throw new RuntimeException("Failed to create reference for " + clazz.getSimpleName(), e);
//        }
//    }

    private <T> T ref(Class<T> clazz, Number id) {
        if (id == null) return null;
        return entityManager.getReference(clazz, id.longValue());
    }

}
