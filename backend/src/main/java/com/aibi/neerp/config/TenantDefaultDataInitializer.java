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

@Component
public class TenantDefaultDataInitializer {

    private final UnitRepository unitRepository;
    private final CapacityTypeRepository capacityTypeRepository;
    private final ContractTypeRepository contractTypeRepository;
    private final EnquiryTypeRepository enquiryTypeRepository;
    private final PaymentTermRepository paymentTermRepository;
    private final ElevatorMakeRepository elevatorMakeRepository;
    private final NumberOfServiceRepository numberOfServiceRepository;
    public TenantDefaultDataInitializer(UnitRepository unitRepository,
                                        CapacityTypeRepository capacityTypeRepository,
                                        ContractTypeRepository contractTypeRepository,
                                        EnquiryTypeRepository enquiryTypeRepository,
                                        PaymentTermRepository paymentTermRepository,
                                        ElevatorMakeRepository elevatorMakeRepository,
                                        NumberOfServiceRepository numberOfServiceRepository) {
        this.unitRepository = unitRepository;
        this.capacityTypeRepository = capacityTypeRepository;
        this.contractTypeRepository = contractTypeRepository;
        this.enquiryTypeRepository = enquiryTypeRepository;
        this.paymentTermRepository = paymentTermRepository;
        this.elevatorMakeRepository = elevatorMakeRepository;
        this.numberOfServiceRepository = numberOfServiceRepository;
    }

    @Transactional
    public void initializeDefaults() {
        System.out.println("[DataInit] Starting default data initialization...");
        try {
            insertDefaultCapacityTypes();
            insertDefaultUnit();
            insertDefaultContractTypes();
            insertDefaultEnquiryTypes();
            insertDefaultPaymentTerms();
            insertDefaultElevatorMakes();
            insertDefaultNumberOfServices();
            System.out.println("[DataInit] Default data initialization completed successfully");
        } catch (Exception e) {
            System.err.println("[DataInit] Error during data initialization: " + e.getMessage());
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

}

