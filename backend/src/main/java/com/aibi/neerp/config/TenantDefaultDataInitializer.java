package com.aibi.neerp.config;

import com.aibi.neerp.amc.common.entity.ContractType;
import com.aibi.neerp.amc.common.entity.ElevatorMake;
import com.aibi.neerp.amc.common.entity.NumberOfService;
import com.aibi.neerp.amc.common.entity.PaymentTerm;
import com.aibi.neerp.amc.common.repository.ContractTypeRepository;
import com.aibi.neerp.amc.common.repository.ElevatorMakeRepository;
import com.aibi.neerp.amc.common.repository.NumberOfServiceRepository;
import com.aibi.neerp.amc.common.repository.PaymentTermRepository;
import com.aibi.neerp.componentpricing.dto.FloorRequestDTO;
import com.aibi.neerp.componentpricing.entity.*;
import com.aibi.neerp.componentpricing.repository.*;
import com.aibi.neerp.componentpricing.service.FloorService;
import com.aibi.neerp.leadmanagement.entity.EnquiryType;
import com.aibi.neerp.leadmanagement.repository.EnquiryTypeRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import lombok.extern.slf4j.Slf4j;

import java.util.*;

@Slf4j
@Component
public class TenantDefaultDataInitializer {

    // 🔹 Define once at the top of your class
    private static final Map<Long, String> OPERATOR_TYPES = Map.of(
            1L, "Manual",
            2L, "Automatic"
    );

    private static final List<String> PROTECTED_NAMES = List.of(
            "CommonPrice", "ManualPrice", "Machines", "Others"
    );

    private final UnitRepository unitRepository;
    private final CapacityTypeRepository capacityTypeRepository;
    private final ContractTypeRepository contractTypeRepository;
    private final EnquiryTypeRepository enquiryTypeRepository;
    private final PaymentTermRepository paymentTermRepository;
    private final ElevatorMakeRepository elevatorMakeRepository;
    private final NumberOfServiceRepository numberOfServiceRepository;
    private final FloorRepository floorRepository;
    private final InstallationRuleRepository installationRuleRepository;
    private final OperatorElevatorRepository operatorElevatorRepository;
    private final OtherMaterialMainRepository otherMaterialMainRepository;
    private final OtherMaterialRepository otherMaterialRepository;
    private final TypeOfLiftRepository typeOfLiftRepository;
    private final ComponentRepository componentRepository;
    private final AdditionalFloorsRepository additionalFloorsRepository;
    private final AirTypeRepository airTypeRepository;
    private final FloorService floorService;
    // Removed: private final DatabaseColumnNamingFixer columnNamingFixer;

    @Autowired(required = false)
    private EntityManager entityManager;

    public TenantDefaultDataInitializer(UnitRepository unitRepository,
                                        CapacityTypeRepository capacityTypeRepository,
                                        ContractTypeRepository contractTypeRepository,
                                        EnquiryTypeRepository enquiryTypeRepository,
                                        PaymentTermRepository paymentTermRepository,
                                        ElevatorMakeRepository elevatorMakeRepository,
                                        NumberOfServiceRepository numberOfServiceRepository,
                                        FloorRepository floorRepository,
                                        InstallationRuleRepository installationRuleRepository,
                                        OperatorElevatorRepository operatorElevatorRepository,
                                        OtherMaterialMainRepository otherMaterialMainRepository,
                                        OtherMaterialRepository otherMaterialRepository,
                                        TypeOfLiftRepository typeOfLiftRepository,
                                        ComponentRepository componentRepository,
                                        AdditionalFloorsRepository additionalFloorsRepository,
                                        AirTypeRepository airTypeRepository,
                                        FloorService floorService
            /* Removed: DatabaseColumnNamingFixer columnNamingFixer */) {
        this.unitRepository = unitRepository;
        this.capacityTypeRepository = capacityTypeRepository;
        this.contractTypeRepository = contractTypeRepository;
        this.enquiryTypeRepository = enquiryTypeRepository;
        this.paymentTermRepository = paymentTermRepository;
        this.elevatorMakeRepository = elevatorMakeRepository;
        this.numberOfServiceRepository = numberOfServiceRepository;
        this.floorRepository = floorRepository;
        this.installationRuleRepository = installationRuleRepository;
        this.operatorElevatorRepository = operatorElevatorRepository;
        this.otherMaterialMainRepository = otherMaterialMainRepository;
        this.otherMaterialRepository = otherMaterialRepository;
        this.typeOfLiftRepository = typeOfLiftRepository;
        this.componentRepository = componentRepository;
        this.additionalFloorsRepository = additionalFloorsRepository;
        this.airTypeRepository = airTypeRepository;
        this.floorService = floorService;
        // Removed: this.columnNamingFixer = columnNamingFixer;
    }

    @Transactional
    public void initializeDefaults() {
        long startTime = System.currentTimeMillis();
        System.out.println("[DataInit] ===== Starting default data initialization at " + new java.util.Date() + " =====");
        try {
            // Removed: Step 0: Validate and fix column naming issues globally
            // Removed: Entire block for columnNamingFixer.validateAndFixColumnNames();
            // The step numbers have been adjusted from 1/8 to 7/7

            System.out.println("[DataInit] Step 1/16: Inserting CapacityTypes...");
            insertDefaultCapacityTypes();
            System.out.println("[DataInit] Step 1/16: ✅ Completed");

            System.out.println("[DataInit] Step 2/16: Inserting Unit...");
            insertDefaultUnit();
            System.out.println("[DataInit] Step 2/16: ✅ Completed");

            System.out.println("[DataInit] Step 3/16: Inserting ContractTypes...");
            insertDefaultContractTypes();
            System.out.println("[DataInit] Step 3/16: ✅ Completed");

            System.out.println("[DataInit] Step 4/16: Inserting EnquiryTypes...");
            insertDefaultEnquiryTypes();
            System.out.println("[DataInit] Step 4/16: ✅ Completed");

            System.out.println("[DataInit] Step 5/16: Inserting PaymentTerms...");
            insertDefaultPaymentTerms();
            System.out.println("[DataInit] Step 5/16: ✅ Completed");

            System.out.println("[DataInit] Step 6/16: Inserting ElevatorMakes...");
            insertDefaultElevatorMakes();
            System.out.println("[DataInit] Step 6/16: ✅ Completed");

            System.out.println("[DataInit] Step 7/16: Inserting NumberOfServices...");
            insertDefaultNumberOfServices();
            System.out.println("[DataInit] Step 7/16: ✅ Completed");

            System.out.println("[DataInit] Step 8/16: Inserting Default Floors...");
            insertDefaultFloors();
            System.out.println("[DataInit] Step 8/16: ✅ Completed");

            System.out.println("[DataInit] Step 9/16: Inserting InstallationRules...");
            insertDefaultInstallationRules();
            System.out.println("[DataInit] Step 9/16: ✅ Completed");

            System.out.println("[DataInit] Step 10/16: Inserting Operators...");
            insertDefaultOperators();
            System.out.println("[DataInit] Step 10/16: ✅ Completed");

            System.out.println("[DataInit] Step 11/16: Inserting TypeOfLift...");
            insertDefaultTypeOfLift();
            System.out.println("[DataInit] Step 11/16: ✅ Completed");

            System.out.println("[DataInit] Step 12/16: Inserting Components...");
            insertDefaultComponents();
            System.out.println("[DataInit] Step 12/16: ✅ Completed");

            System.out.println("[DataInit] Step 13/16: Inserting OtherMaterialMain Truffing...");
            insertDefaultOtherMaterialMainTruffing();
            System.out.println("[DataInit] Step 13/16: ✅ Completed");

            System.out.println("[DataInit] Step 14/16: Inserting OtherMaterials...");
            insertDefaultOtherMaterials();
            System.out.println("[DataInit] Step 14/16: ✅ Completed");

            System.out.println("[DataInit] Step 15/16: Inserting AdditionalFloors...");
            insertDefaultAdditionalFloors();
            System.out.println("[DataInit] Step 15/16: ✅ Completed");

            System.out.println("[DataInit] Step 16/16: Inserting AirTypes...");
            insertDefaultAirTypes();
            System.out.println("[DataInit] Step 16/16: ✅ Completed");

            // Explicitly flush to ensure data is saved
            if (entityManager != null) {
                entityManager.flush();
                System.out.println("[DataInit] ✅ Flushed EntityManager to ensure data is persisted");
            }

            long duration = System.currentTimeMillis() - startTime;
            System.out.println("[DataInit] ===== Default data initialization completed successfully in " + duration + "ms =====");

            // Verify data was inserted
            verifyDataInserted();
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            System.err.println("[DataInit] ===== ERROR during data initialization after " + duration + "ms =====");
            System.err.println("[DataInit] Error message: " + e.getMessage());
            System.err.println("[DataInit] Error class: " + e.getClass().getName());
            e.printStackTrace();
            throw e;
        }
    }

    private void insertDefaultCapacityTypes() {
        try {
            long count = capacityTypeRepository.count();
            System.out.println("[DataInit] CapacityType count: " + count);
            if (count == 0) {
                CapacityType person = new CapacityType();
                person.setType("Person");
                person.setFieldKey("personCapacityId");
                person.setFormKey("personId");
                capacityTypeRepository.save(person);
                System.out.println("[DataInit] ✅ Inserted CapacityType: Person");

                CapacityType kgs = new CapacityType();
                kgs.setType("Weight");
                kgs.setFieldKey("weightId");
                kgs.setFormKey("weightId");
                capacityTypeRepository.save(kgs);
                System.out.println("[DataInit] ✅ Inserted CapacityType: Weight");
            } else {
                System.out.println("[DataInit] CapacityType already exists, skipping");
            }
        } catch (Exception e) {
            System.err.println("[DataInit] Error inserting CapacityTypes: " + e.getMessage());
            throw e;
        }
    }

    private void insertDefaultUnit() {
        try {
            var existing = unitRepository.findByUnitNameIgnoreCase("Kg");
            System.out.println("[DataInit] Checking for Unit 'Kg', found: " + existing.size());
            if (existing.isEmpty()) {
                Unit unit = new Unit();
                unit.setUnitName("Kg");
                unit.setDescription("Weight unit Kilograms");
                unitRepository.save(unit);
                System.out.println("[DataInit] ✅ Inserted Unit: Kg");
            } else {
                System.out.println("[DataInit] Unit 'Kg' already exists, skipping");
            }
        } catch (Exception e) {
            System.err.println("[DataInit] Error inserting Unit: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    private void insertDefaultContractTypes() {
        try {
            String[] contractTypes = {"Non-Comprehensive", "Semi-Comprehensive", "Comprehensive"};
            for (String typeName : contractTypes) {
                if (!contractTypeRepository.existsByName(typeName)) {
                    ContractType ct = new ContractType();
                    ct.setName(typeName);
                    contractTypeRepository.save(ct);
                    System.out.println("[DataInit] ✅ Inserted ContractType: " + typeName);
                }
            }
        } catch (Exception e) {
            System.err.println("[DataInit] Error inserting ContractTypes: " + e.getMessage());
            throw e;
        }
    }

    private void insertDefaultEnquiryTypes() {
        try {
            String[] enquiryTypes = {"AMC", "New Installation", "Moderization", "On Call"};
            for (String name : enquiryTypes) {
                if (!enquiryTypeRepository.existsByEnquiryTypeName(name)) {
                    EnquiryType enquiryType = new EnquiryType();
                    enquiryType.setEnquiryTypeName(name);
                    enquiryTypeRepository.save(enquiryType);
                    System.out.println("[DataInit] ✅ Inserted EnquiryType: " + name);
                }
            }
        } catch (Exception e) {
            System.err.println("[DataInit] Error inserting EnquiryTypes: " + e.getMessage());
            throw e;
        }
    }

    private void insertDefaultPaymentTerms() {
        try {
            String[] paymentTerms = {"Quarterly", "Half Yearly", "Yearly"};
            for (String name : paymentTerms) {
                if (!paymentTermRepository.existsByTermName(name)) {
                    PaymentTerm paymentTerm = new PaymentTerm();
                    paymentTerm.setTermName(name);
                    paymentTerm.setDescription("");
                    paymentTermRepository.save(paymentTerm);
                    System.out.println("[DataInit] ✅ Inserted PaymentTerm: " + name);
                }
            }
        } catch (Exception e) {
            System.err.println("[DataInit] Error inserting PaymentTerms: " + e.getMessage());
            throw e;
        }
    }

    private void insertDefaultElevatorMakes() {
        try {
            String[] makes = {
                    "KONE", "Schindler", "Kinetic Hyundai", "Escon", "Otis",
                    "Omega", "ThyssenKrupp", "Opel", "Eros", "Smash",
                    "Johnson", "Prime", "others"
            };
            for (String name : makes) {
                if (!elevatorMakeRepository.existsByName(name)) {
                    ElevatorMake elevatorMake = new ElevatorMake();
                    elevatorMake.setName(name);
                    elevatorMakeRepository.save(elevatorMake);
                    System.out.println("[DataInit] ✅ Inserted ElevatorMake: " + name);
                }
            }
        } catch (Exception e) {
            System.err.println("[DataInit] Error inserting ElevatorMakes: " + e.getMessage());
            throw e;
        }
    }

    private void insertDefaultNumberOfServices() {
        try {
            for (int value = 1; value <= 12; value++) {
                if (!numberOfServiceRepository.existsByValue(value)) {
                    NumberOfService numberOfService = new NumberOfService();
                    numberOfService.setValue(value);
                    numberOfServiceRepository.save(numberOfService);
                    System.out.println("[DataInit] ✅ Inserted NumberOfService: " + value);
                }
            }
        } catch (Exception e) {
            System.err.println("[DataInit] Error inserting NumberOfServices: " + e.getMessage());
            throw e;
        }
    }

    private void verifyDataInserted() {
        try {
            System.out.println("[DataInit] ===== Verifying data insertion =====");
            System.out.println("[DataInit] Tenant Context: " + com.aibi.neerp.config.TenantContext.getTenantId());
            long capacityTypeCount = capacityTypeRepository.count();
            long unitCount = unitRepository.count();
            long contractTypeCount = contractTypeRepository.count();
            long enquiryTypeCount = enquiryTypeRepository.count();
            long paymentTermCount = paymentTermRepository.count();
            long elevatorMakeCount = elevatorMakeRepository.count();
            long numberOfServiceCount = numberOfServiceRepository.count();

            System.out.println("[DataInit] CapacityTypes: " + capacityTypeCount + " (expected: >= 2)");
            System.out.println("[DataInit] Units: " + unitCount + " (expected: >= 1)");
            System.out.println("[DataInit] ContractTypes: " + contractTypeCount + " (expected: >= 3)");
            System.out.println("[DataInit] EnquiryTypes: " + enquiryTypeCount + " (expected: >= 4)");
            System.out.println("[DataInit] PaymentTerms: " + paymentTermCount + " (expected: >= 3)");
            System.out.println("[DataInit] ElevatorMakes: " + elevatorMakeCount + " (expected: >= 12)");
            System.out.println("[DataInit] NumberOfServices: " + numberOfServiceCount + " (expected: >= 12)");

            if (capacityTypeCount == 0 && unitCount == 0 && contractTypeCount == 0) {
                System.err.println("[DataInit] ⚠️ WARNING: No data found! This might indicate:");
                System.err.println("[DataInit]   1. Data was not inserted");
                System.err.println("[DataInit]   2. Wrong database/schema is being queried");
                System.err.println("[DataInit]   3. Transaction was rolled back");
            } else {
                System.out.println("[DataInit] ✅ Data verification passed");
            }
            System.out.println("[DataInit] ===== Verification complete =====");
        } catch (Exception e) {
            System.err.println("[DataInit] ⚠️ Error during verification: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void insertDefaultFloors() {
        try {
            log.info("[DataInit] Inserting default 20 floors with prefix 'G+'...");

            // Prevent duplicate initialization
            if (floorRepository.count() > 0) {
                log.info("[DataInit] Floors already exist. Skipping.");
                return;
            }

            // Prepare request object for generation logic
            FloorRequestDTO requestDTO = new FloorRequestDTO();
            requestDTO.setPrefix("G+");
            requestDTO.setTotalFloors(20);

            // Directly use service method
            floorService.generateAndSaveFloors(requestDTO);

            log.info("[DataInit] ✅ Default 20 floors inserted successfully.");
        } catch (Exception e) {
            log.error("[DataInit] ❌ Error inserting default floors: {}", e.getMessage());
            throw e;
        }
    }


    private void insertDefaultInstallationRules() {
        try {
            if (installationRuleRepository.count() == 0) {
                List<Floor> allFloors = floorRepository.findAll()
                        .stream()
                        .sorted((f1, f2) -> f1.getId().compareTo(f2.getId()))
                        .toList();

                if (allFloors.isEmpty()) {
                    log.warn("[DataInit] ⚠️ No floors found in DB. Skipping default InstallationRules insertion.");
                    return;
                }

                // First 4 floors
                List<Floor> firstFourFloors = allFloors.stream()
                        .limit(4)
                        .toList();

                // Remaining floors
                List<Floor> remainingFloors = allFloors.stream()
                        .skip(4)
                        .toList();

                // --- Rules for first 4 floors ---
                InstallationRule rule1 = new InstallationRule();
                rule1.setLiftType(1);
                rule1.setFloorLimits(firstFourFloors);
                rule1.setBaseAmount(30000.0);
                rule1.setExtraAmount(0.0);
                installationRuleRepository.save(rule1);
                System.out.println("[DataInit] ✅ Inserted InstallationRule for LiftType 1 (first 4 floors)");

                InstallationRule rule2 = new InstallationRule();
                rule2.setLiftType(2);
                rule2.setFloorLimits(firstFourFloors);
                rule2.setBaseAmount(37500.0);
                rule2.setExtraAmount(0.0);
                installationRuleRepository.save(rule2);
                System.out.println("[DataInit] ✅ Inserted InstallationRule for LiftType 2 (first 4 floors)");

                // --- Rules for remaining floors (if any) ---
                if (!remainingFloors.isEmpty()) {
                    InstallationRule rule3 = new InstallationRule();
                    rule3.setLiftType(1);
                    rule3.setFloorLimits(remainingFloors);
                    rule3.setBaseAmount(35000.0);
                    rule3.setExtraAmount(6000.0);
                    installationRuleRepository.save(rule3);
                    System.out.println("[DataInit] ✅ Inserted InstallationRule for LiftType 1 (remaining floors)");

                    InstallationRule rule4 = new InstallationRule();
                    rule4.setLiftType(2);
                    rule4.setFloorLimits(remainingFloors);
                    rule4.setBaseAmount(37500.0);
                    rule4.setExtraAmount(7500.0);
                    installationRuleRepository.save(rule4);
                    System.out.println("[DataInit] ✅ Inserted InstallationRule for LiftType 2 (remaining floors)");
                }

                log.info("[DataInit] ✅ Default InstallationRules inserted for {} floors.", allFloors.size());
            } else {
                System.out.println("[DataInit] InstallationRules already exist, skipping");
            }
        } catch (Exception e) {
            System.err.println("[DataInit] Error inserting InstallationRules: " + e.getMessage());
            throw e;
        }
    }

    private void insertDefaultOperators() {
        try {
            if (operatorElevatorRepository.count() == 0) {
                for (String operatorName : OPERATOR_TYPES.values()) {
                    OperatorElevator operator = new OperatorElevator();
                    operator.setName(operatorName.toUpperCase());
                    operatorElevatorRepository.save(operator);
                    System.out.println("[DataInit] ✅ Inserted OperatorElevator: " + operatorName.toUpperCase());
                }
                System.out.println("[DataInit] ✅ Default OperatorElevators inserted: " + OPERATOR_TYPES.values());
            } else {
                System.out.println("[DataInit] OperatorElevators already exist, skipping");
            }
        } catch (Exception e) {
            System.err.println("[DataInit] Error inserting OperatorElevators: " + e.getMessage());
            throw e;
        }
    }

    private void insertDefaultTypeOfLift() {
        try {
            // Insert default lift types: GEARED, GEAREDLESS, HYDRAULIC
            // These are needed for InstallationRules (which use IDs 1 and 2) and OtherMaterials
            String[] liftTypeNames = {"GEARED", "GEAREDLESS", "HYDRAULIC"};

            for (String liftTypeName : liftTypeNames) {
                if (!typeOfLiftRepository.existsByLiftTypeNameIgnoreCase(liftTypeName)) {
                    TypeOfLift liftType = new TypeOfLift();
                    liftType.setLiftTypeName(liftTypeName);
                    typeOfLiftRepository.save(liftType);
                    System.out.println("[DataInit] ✅ Inserted TypeOfLift: " + liftTypeName);
                }
            }

            long count = typeOfLiftRepository.count();
            if (count > 0) {
                System.out.println("[DataInit] ✅ TypeOfLift initialization complete. Total lift types: " + count);
            } else {
                System.out.println("[DataInit] All default TypeOfLift already exist, skipping");
            }
        } catch (Exception e) {
            System.err.println("[DataInit] Error inserting TypeOfLift: " + e.getMessage());
            throw e;
        }
    }

    private void insertDefaultOtherMaterialMainTruffing() {
        try {
            // Check if "Truffing" main material already exists
            OtherMaterialMain truffingMain = otherMaterialMainRepository.findByMaterialMainTypeIgnoreCase("Truffing")
                    .orElse(null);

            if (truffingMain == null) {
                truffingMain = OtherMaterialMain.builder()
                        .materialMainType("Truffing")
                        .active(true)
                        .ruleExpression("9 + (floor - 1) * 2") // default rule
                        .build();
                otherMaterialMainRepository.save(truffingMain);
                System.out.println("[DataInit] ✅ Default OtherMaterialMain 'Truffing' inserted.");
            } else {
                System.out.println("[DataInit] OtherMaterialMain 'Truffing' already exists, skipping");
            }

            // Check if actual OtherMaterial exists for Truffing
            boolean exists = otherMaterialRepository.existsByOtherMaterialNameIgnoreCase("Truffing");
            if (!exists) {
                OtherMaterial truffing = OtherMaterial.builder()
                        .otherMaterialMain(truffingMain)
                        .otherMaterialName("Truffing")
                        .quantity("1")
                        .price(100) // default price
                        .build();
                otherMaterialRepository.save(truffing);
                System.out.println("[DataInit] ✅ Default OtherMaterial 'Truffing' inserted.");
            } else {
                System.out.println("[DataInit] OtherMaterial 'Truffing' already exists, skipping");
            }
        } catch (Exception e) {
            System.err.println("[DataInit] Error inserting OtherMaterialMain Truffing: " + e.getMessage());
            throw e;
        }
    }

    @Transactional
    private void insertDefaultOtherMaterials() {
        try {
            List<OperatorElevator> allOperators = operatorElevatorRepository.findAll();
            List<TypeOfLift> allLiftTypes = typeOfLiftRepository.findAll();

            if (allOperators.isEmpty() || allLiftTypes.isEmpty()) {
                log.warn("[DataInit] ⚠️ No operators or lift types found. Skipping material initialization.");
                return;
            }

            // Define materials
            Object[][] materials = new Object[][]{
                    // common prices
                    {PROTECTED_NAMES.get(0), "Lock Material", 250, "4", "Set", null, "PENCIL READ"},
                    {PROTECTED_NAMES.get(0), "Pit Box Material", 188, "2", "Set", null, "PIT SWITCH BOX"},
                    {PROTECTED_NAMES.get(0), "Pata Material", 188, "6", "Set", null, "TARMINAL PATA WITH G. CLIP BIG AND HARDWARE"},
                    {PROTECTED_NAMES.get(0), "Switch Material", 375, "6", "Set", null, "TARMINAL SWITCH O/S TYPE"},
                    {PROTECTED_NAMES.get(0), "Wire Tie Material", 125, "1", "Set", null, "WIRE TIE"},
                    {PROTECTED_NAMES.get(0), "Power Wire Material", 875, "1", "Set", null, "POWER WIRE FOR MOTOR 2.5 SQMM 4 CORE (6 MTR)"},
                    {PROTECTED_NAMES.get(0), "Grease Oil Material", 938, "1", "Liter", null, "GEAR OIL 90 NO"},
                    {PROTECTED_NAMES.get(0), "Grease Material", 125, "1", "Packet", null, "GREACE"},
                    {PROTECTED_NAMES.get(0), "Cotton Material", 125, "1", "Kg", null, "COTTON WEASTE 1 KG"},
                    {PROTECTED_NAMES.get(0), "Guide Clip Material", 188, "1", "Set", null, "CWT GUIDE CLIP SMALL WITH HARDWARE"},
                    {PROTECTED_NAMES.get(0), "Earth Wire Material", 125, "1", "Set", null, "EARTH - WIRE.BIG 3 KG GALVENSIE"},
                    {PROTECTED_NAMES.get(0), "Earth Small Material", 406, "1", "Set", null, "EARTH - WIRE SMALL Â 0.5 MM"},
                    {PROTECTED_NAMES.get(0), "Earth Bkt Material", 125, "1", "Set", null, "EARTHING BRACKET"},
                    {PROTECTED_NAMES.get(0), "FLB Pipe Material", 344, "1", "Set", null, "FLEXIBLE PIPE 3/4\""},
                    {PROTECTED_NAMES.get(0), "Rubber Material", 350, "1", "Set", null, "MACHINE RUBBER"},
                    {PROTECTED_NAMES.get(0), "Saddle Material", 125, "1", "Set", null, "SADDLE BOX 3/4\""},
                    {PROTECTED_NAMES.get(0), "Final Limit Material", 1250, "1", "Set", null, "FINAL LIMIT CAMP 10FT"},
                    {PROTECTED_NAMES.get(0), "Cable Hanger Material", 188, "1", "Set", null, "CABLE HENGER YELLOW"},
                    {PROTECTED_NAMES.get(0), "Junction Box Material", 3750, "1", "Set", null, "JUNCTION BOX & CARTOP JUNCTION AND MAINTENANCE BOX"},
                    {PROTECTED_NAMES.get(0), "Magnet SQR Material", 31, "1", "Set", null, "MAGNET SQR SET"},

                    // manual prices for 1(manual)
                    {PROTECTED_NAMES.get(1), "Lock Material", 1063, "1", "Set", 1L, "LANDING LOCK SET WITH HARDWARE ONLY FOR MANUAL LIFT"},
                    {PROTECTED_NAMES.get(1), "Camp Material", 5000, "1", "Set", 1L, "RCR CAMP SET OLYMPUS TYPE ONLY FOR MANUAL LIFT"},
                    {PROTECTED_NAMES.get(1), "Safety", 375, "1", "Set", 1L, "CAR GEAT SAFETY SWITCH ONLY FOR MANUAL LIFT"},
                    {PROTECTED_NAMES.get(1), "Cart", 375, "1", "Set", 1L, "CARGET ANGLE ONLY FOR MANUAL LIFT"},
                    {PROTECTED_NAMES.get(1), "Carts", 375, "1", "Set", 1L, "CARGET T ONLY FOR MANUAL LIFT"},
                    {PROTECTED_NAMES.get(1), "Door Bell", 325, "1", "Set", 1L, "DOOR OPEN BELL FOR MANUAL LIFT"},

                    // manual prices for 2(automatic)
                    {PROTECTED_NAMES.get(1), "Auto Lock Material", 7500, "1", "Set", 2L, "DOOR SAFETUY SENSOR ONLY FOR AUTOMATIC LIFT"},
            };

            // Insert logic
            for (Object[] mat : materials) {
                String mainType = (String) mat[0];
                String materialTypeMain = (String) mat[1];
                Integer price = (Integer) mat[2];
                String quantity = String.valueOf(mat[3]);
                String quantitySuffix = String.valueOf(mat[4]);
                Long operatorTypeId = (Long) mat[5];
                String displayName = (String) mat[6];

                // Get or create material main
                OtherMaterialMain main = getOrCreateMain(mainType, otherMaterialMainRepository);

                if (mainType.equalsIgnoreCase(PROTECTED_NAMES.get(0))) {
                    // Insert without any operator
                    insertMaterial(main, materialTypeMain, price, quantity, quantitySuffix, null, null, displayName, otherMaterialRepository);
                    continue;
                } else {
                    // For operator-specific materials
                    String operatorName = OPERATOR_TYPES.get(operatorTypeId);
                    System.out.println("[DataInit] Mapping operatorTypeId=" + operatorTypeId + " to operatorName=" + operatorName);
                    if (operatorName == null) {
                        log.warn("[DataInit] ⚠️ Skipping material {} due to unknown operatorTypeId={}", materialTypeMain, operatorTypeId);
                        continue;
                    }

                    List<OperatorElevator> targetOperators = allOperators.stream()
                            .filter(op -> op.getName().equalsIgnoreCase(operatorName))
                            .toList();

                    if (targetOperators.isEmpty()) {
                        log.warn("[DataInit] ⚠️ No matching operators found in DB for operatorName={}", operatorName);
                        continue;
                    }

                    // Insert material for matching operator(s)
                    for (OperatorElevator operator : targetOperators) {
                        insertMaterial(main, materialTypeMain, price, quantity, quantitySuffix, operator, null, displayName, otherMaterialRepository);
                    }
                }
            }

            // Create additional material mains if needed
            getOrCreateMain(PROTECTED_NAMES.get(3), otherMaterialMainRepository);
            getOrCreateMain(PROTECTED_NAMES.get(2), otherMaterialMainRepository);

            log.info("[DataInit] ✅ All OtherMaterials successfully initialized with operator mapping and materialTypeMain.");
        } catch (Exception e) {
            System.err.println("[DataInit] Error inserting OtherMaterials: " + e.getMessage());
            throw e;
        }
    }

    private OtherMaterialMain getOrCreateMain(String mainType, OtherMaterialMainRepository repo) {
        return repo.findByMaterialMainTypeIgnoreCase(mainType)
                .orElseGet(() -> {
                    if (!repo.existsByMaterialMainTypeIgnoreCase(mainType)) {
                        OtherMaterialMain newMain = OtherMaterialMain.builder()
                                .materialMainType(mainType)
                                .active(true)
                                .isSystemDefined(true)
                                .build();
                        log.info("[DataInit] 🆕 Created new OtherMaterialMain: {}", mainType);
                        return repo.save(newMain);
                    }
                    return repo.findByMaterialMainTypeIgnoreCase(mainType).get();
                });
    }

    /**
     * Helper to insert a single material safely (checks duplicates)
     */
    private void insertMaterial(
            OtherMaterialMain main,
            String materialName,
            Integer price,
            String quantity,
            String quantitySuffix,
            OperatorElevator operator,
            TypeOfLift lift,  // may be null
            String displayName,
            OtherMaterialRepository repo
    ) {
        boolean exists = repo.existsByOtherMaterialMainAndOtherMaterialNameIgnoreCase(main, materialName);
        if (!exists) {
            repo.save(
                    OtherMaterial.builder()
                            .otherMaterialMain(main)
                            .otherMaterialName(materialName)
                            .otherMaterialDisplayName(displayName)
                            .price(price)
                            .quantity(quantity)
                            .quantityUnit(quantitySuffix)
                            .operatorType(operator)
                            .machineRoom(lift) // will save null safely
                            .build()
            );

            log.info("[DataInit] ✅ Inserted Material: {} under {} for Operator={} & Lift={}",
                    materialName, main.getMaterialMainType(),
                    operator != null ? operator.getName() : "null", lift != null ? lift.getLiftTypeName() : "null");
            System.out.println(
                    "[DataInit] ✅ Inserted Material: " + materialName +
                            " | MainType: " + main.getMaterialMainType() +
                            " | Operator: " + (operator != null ? operator.getName() : "N/A") +
                            " | Lift: " + (lift != null ? lift.getLiftTypeName() : "N/A")
            );
        }
    }

    private void insertDefaultComponents() {
        try {
            String[] componentNames = {
                    "VFD - Main Drive",
                    "Door Operator",
                    "Main Machine Set",
                    "Car Rails",
                    "Counter Weight Rails",
                    "Wire Rope",
                    "Control Panel",
                    "Wiring Harness"
            };

            for (String name : componentNames) {
                if (!componentRepository.existsByName(name)) {
                    com.aibi.neerp.componentpricing.entity.Component component =
                            com.aibi.neerp.componentpricing.entity.Component.builder()
                                    .name(name)
                                    .build();
                    componentRepository.save(component);
                    System.out.println("[DataInit] ✅ Default Component inserted: " + name);
                }
            }
        } catch (Exception e) {
            System.err.println("[DataInit] Error inserting Components: " + e.getMessage());
            throw e;
        }
    }

    private void insertDefaultAdditionalFloors() {
        try {
            Object[][] floors = {
                    {1, "T", "Terrace"},
                    {2, "B1", "Basement 1"},
                    {3, "B2", "Basement 2"},
                    {4, "B3", "Basement 3"},
                    {5, "B4", "Basement 4"}
            };

            for (Object[] floorData : floors) {
                String code = (String) floorData[1];
                if (!additionalFloorsRepository.existsByCode(code)) {
                    AdditionalFloors floor = AdditionalFloors.builder()
                            .code(code)
                            .label((String) floorData[2])
                            .build();
                    additionalFloorsRepository.save(floor);
                    System.out.println("[DataInit] ✅ Default AdditionalFloor inserted: " + code + " - " + floorData[2]);
                }
            }
        } catch (Exception e) {
            System.err.println("[DataInit] Error inserting AdditionalFloors: " + e.getMessage());
            throw e;
        }
    }

    private void insertDefaultAirTypes() {
        try {
            String[] airTypes = {"FAN", "BLOWER"};

            for (String name : airTypes) {
                if (!airTypeRepository.existsByNameIgnoreCase(name)) {
                    AirType airType = new AirType();
                    airType.setName(name);
                    airType.setStatus(true); // Active by default
                    airTypeRepository.save(airType);
                    System.out.println("[DataInit] ✅ AirType inserted: " + name);
                }
            }
        } catch (Exception e) {
            System.err.println("[DataInit] Error inserting AirTypes: " + e.getMessage());
            throw e;
        }
    }

}