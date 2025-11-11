package com.aibi.neerp.config;

import com.aibi.neerp.amc.common.entity.ContractType;
import com.aibi.neerp.amc.common.entity.ElevatorMake;
import com.aibi.neerp.amc.common.entity.NumberOfService;
import com.aibi.neerp.amc.common.entity.PaymentTerm;
import com.aibi.neerp.amc.common.repository.ContractTypeRepository;
import com.aibi.neerp.amc.common.repository.ElevatorMakeRepository;
import com.aibi.neerp.amc.common.repository.NumberOfServiceRepository;
import com.aibi.neerp.amc.common.repository.PaymentTermRepository;
import com.aibi.neerp.componentpricing.entity.CapacityType;
import com.aibi.neerp.componentpricing.entity.Unit;
import com.aibi.neerp.componentpricing.repository.CapacityTypeRepository;
import com.aibi.neerp.componentpricing.repository.UnitRepository;
import com.aibi.neerp.leadmanagement.entity.EnquiryType;
import com.aibi.neerp.leadmanagement.repository.EnquiryTypeRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;

@Component
public class TenantDefaultDataInitializer {

    private final UnitRepository unitRepository;
    private final CapacityTypeRepository capacityTypeRepository;
    private final ContractTypeRepository contractTypeRepository;
    private final EnquiryTypeRepository enquiryTypeRepository;
    private final PaymentTermRepository paymentTermRepository;
    private final ElevatorMakeRepository elevatorMakeRepository;
    private final NumberOfServiceRepository numberOfServiceRepository;
    private final DatabaseColumnNamingFixer columnNamingFixer;
    
    @Autowired(required = false)
    private EntityManager entityManager;
    
    public TenantDefaultDataInitializer(UnitRepository unitRepository,
                                        CapacityTypeRepository capacityTypeRepository,
                                        ContractTypeRepository contractTypeRepository,
                                        EnquiryTypeRepository enquiryTypeRepository,
                                        PaymentTermRepository paymentTermRepository,
                                        ElevatorMakeRepository elevatorMakeRepository,
                                        NumberOfServiceRepository numberOfServiceRepository,
                                        DatabaseColumnNamingFixer columnNamingFixer) {
        this.unitRepository = unitRepository;
        this.capacityTypeRepository = capacityTypeRepository;
        this.contractTypeRepository = contractTypeRepository;
        this.enquiryTypeRepository = enquiryTypeRepository;
        this.paymentTermRepository = paymentTermRepository;
        this.elevatorMakeRepository = elevatorMakeRepository;
        this.numberOfServiceRepository = numberOfServiceRepository;
        this.columnNamingFixer = columnNamingFixer;
    }

    @Transactional
    public void initializeDefaults() {
        long startTime = System.currentTimeMillis();
        System.out.println("[DataInit] ===== Starting default data initialization at " + new java.util.Date() + " =====");
        try {
            // Step 0: Validate and fix column naming issues globally
            System.out.println("[DataInit] Step 0/8: Validating and fixing column naming issues...");
            try {
                columnNamingFixer.validateAndFixColumnNames();
                System.out.println("[DataInit] Step 0/8: ✅ Completed");
            } catch (Exception e) {
                System.err.println("[DataInit] Step 0/8: ⚠️ Warning - Column naming validation failed: " + e.getMessage());
                // Don't throw - continue with data initialization
                // The explicit @Column annotations should handle the mismatches
            }
            
            System.out.println("[DataInit] Step 1/8: Inserting CapacityTypes...");
            insertDefaultCapacityTypes();
            System.out.println("[DataInit] Step 1/8: ✅ Completed");
            
            System.out.println("[DataInit] Step 2/8: Inserting Unit...");
            insertDefaultUnit();
            System.out.println("[DataInit] Step 2/8: ✅ Completed");
            
            System.out.println("[DataInit] Step 3/8: Inserting ContractTypes...");
            insertDefaultContractTypes();
            System.out.println("[DataInit] Step 3/8: ✅ Completed");
            
            System.out.println("[DataInit] Step 4/8: Inserting EnquiryTypes...");
            insertDefaultEnquiryTypes();
            System.out.println("[DataInit] Step 4/8: ✅ Completed");
            
            System.out.println("[DataInit] Step 5/8: Inserting PaymentTerms...");
            insertDefaultPaymentTerms();
            System.out.println("[DataInit] Step 5/8: ✅ Completed");
            
            System.out.println("[DataInit] Step 6/8: Inserting ElevatorMakes...");
            insertDefaultElevatorMakes();
            System.out.println("[DataInit] Step 6/8: ✅ Completed");
            
            System.out.println("[DataInit] Step 7/8: Inserting NumberOfServices...");
            insertDefaultNumberOfServices();
            System.out.println("[DataInit] Step 7/8: ✅ Completed");
            
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

}

