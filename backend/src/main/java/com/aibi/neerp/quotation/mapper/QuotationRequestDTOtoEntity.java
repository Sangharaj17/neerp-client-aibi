package com.aibi.neerp.quotation.mapper;

import com.aibi.neerp.componentpricing.entity.*;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.Enquiry;
import com.aibi.neerp.leadmanagement.entity.NewLeads;
import com.aibi.neerp.quotation.dto.ManualOrCommonMaterialDTO;
import com.aibi.neerp.quotation.dto.QuotationLiftDetailRequestDTO;
import com.aibi.neerp.quotation.dto.SelectedMaterialRequestDTO;
import com.aibi.neerp.quotation.entity.QuotationLiftDetail;
import com.aibi.neerp.quotation.entity.QuotationLiftMaterial;
import com.aibi.neerp.quotation.entity.QuotationMain;
import com.aibi.neerp.quotation.entity.SelectedQuotationMaterial;
import com.aibi.neerp.quotation.repository.QuotationLiftMaterialRepository;
import com.aibi.neerp.quotation.repository.SelectedQuotationMaterialRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
public class QuotationRequestDTOtoEntity {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private QuotationLiftMaterialRepository quotationLiftMaterialRepository;

    @Autowired
    private SelectedQuotationMaterialRepository selectedQuotationMaterialRepository;

    private <T> T ref(Class<T> clazz, Number id) {
        if (id == null) return null;
        return entityManager.getReference(clazz, id.longValue());
    }

    public QuotationLiftDetail mapLiftDetailDTOToEntity(
            QuotationLiftDetailRequestDTO dto,
            QuotationMain main,
            QuotationLiftDetail entity) {

        // ********************Main Quotation details/ Basic Details ****************************
        if (dto.getId() != null)
            entity.setId(dto.getId());

        entity.setLiftQuotationNo(dto.getLiftQuotationNo());
        entity.setQuotationMain(main);

        entity.setParentLift(dto.getParentLiftId() != null ?
                ref(QuotationLiftDetail.class, dto.getParentLiftId()) : null);


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
        material.setUnitPrice(dto.getUnitPrice());
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



}
