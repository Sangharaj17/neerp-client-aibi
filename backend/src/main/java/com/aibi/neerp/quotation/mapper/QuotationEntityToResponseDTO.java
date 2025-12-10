package com.aibi.neerp.quotation.mapper;

import com.aibi.neerp.componentpricing.entity.AdditionalFloors;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.NewLeads;
import com.aibi.neerp.quotation.dto.QuotationLiftDetailResponseDTO;
import com.aibi.neerp.quotation.dto.QuotationMainResponseDTO;
import com.aibi.neerp.quotation.dto.SelectedMaterialResponseDTO;
import com.aibi.neerp.quotation.entity.QuotationLiftDetail;
import com.aibi.neerp.quotation.entity.QuotationMain;
import com.aibi.neerp.quotation.entity.SelectedQuotationMaterial;
import com.aibi.neerp.quotation.repository.QuotationMainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class QuotationEntityToResponseDTO {

    private final QuotationMainRepository quotationMainRepository;

    public QuotationMainResponseDTO mapQuotationEntityToResponseDTO(QuotationMain entity) {
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
        dto.setParentQuotationId(entity.getParentQuotation() != null ? entity.getParentQuotation().getId() : null);
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

    public QuotationLiftDetailResponseDTO mapLiftDetailEntityToDTO(QuotationLiftDetail entity) {
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

                .parentLiftId(entity.getParentLift() != null ?Math.toIntExact( entity.getParentLift().getId()) : null)

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
    public QuotationMainResponseDTO mapQuotationMainToResponseDTOWithoutLifts(QuotationMain entity) {
        Employee createdBy = entity.getCreatedBy();
        Employee finalizedBy = entity.getFinalizedBy();
        Employee deletedBy = entity.getDeletedBy();
        Employee revisedBy = entity.getRevisedBy();

        // Check if any quotation in the revision group is finalized
        boolean hasAnyRevisionFinalized = false;
        if (entity.getQuotationNo() != null && entity.getLead() != null && entity.getCombinedEnquiry() != null) {
            List<QuotationMain> allQuotationsInGroup = quotationMainRepository
                    .findByQuotationNoIgnoreCaseOrderByEditionAsc(entity.getQuotationNo());
            
            hasAnyRevisionFinalized = allQuotationsInGroup.stream()
                    .anyMatch(q -> Boolean.TRUE.equals(q.getIsFinalized()));
        }

        System.out.println("Mapping QuotationMain ID " + entity.getId() + " without lift details isFinalised:" + entity.getIsFinalized() + ", hasAnyRevisionFinalized:" + hasAnyRevisionFinalized);
        return QuotationMainResponseDTO.builder()
                .id(entity.getId())
                .quotationNo(entity.getQuotationNo())
                .quotationDate(entity.getQuotationDate())
                .edition(entity.getEdition())
                .totalAmount(entity.getTotalAmount())
                .status(entity.getStatus().name())
                .parentQuotationId(entity.getParentQuotation() != null ? entity.getParentQuotation().getId() : null)
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
                .deletedByEmployeeName(deletedBy != null ? deletedBy.getEmployeeName() + " - " + deletedBy.getUsername() : null) // Adjust names as needed
                .deletedAt(entity.getDeletedAt())

                .isSuperseded(entity.getIsSuperseded())
                .supersededByEmployeeId(revisedBy != null ? revisedBy.getEmployeeId() : null)
                .supersededByEmployeeName(revisedBy != null ? revisedBy.getEmployeeName() + " - " + revisedBy.getUsername() : null)
                .supersededAt(entity.getRevisedAt())

                // 🔹 Finalization check for revision group
                .hasAnyRevisionFinalized(hasAnyRevisionFinalized)

                // 💡 IMPORTANT: Do NOT call .getLiftDetails() here, and leave the liftDetails field empty/null
                .liftDetails(List.of()) // Explicitly set to an empty list
                .build();
    }


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
        dto.setUnitPrice(entity.getUnitPrice());
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
}
