package com.aibi.neerp.config;

import com.aibi.neerp.amc.common.entity.ContractType;
import com.aibi.neerp.amc.common.entity.ElevatorMake;
import com.aibi.neerp.amc.common.entity.JobActivityType;
import com.aibi.neerp.amc.common.entity.NumberOfService;
import com.aibi.neerp.amc.common.entity.PaymentTerm;
import com.aibi.neerp.amc.common.repository.ContractTypeRepository;
import com.aibi.neerp.amc.common.repository.ElevatorMakeRepository;
import com.aibi.neerp.amc.common.repository.JobActivityTypeRepository;
import com.aibi.neerp.amc.common.repository.NumberOfServiceRepository;
import com.aibi.neerp.amc.common.repository.PaymentTermRepository;
import com.aibi.neerp.componentpricing.entity.AdditionalFloors;
import com.aibi.neerp.componentpricing.entity.CapacityType;
import com.aibi.neerp.componentpricing.entity.Floor;
import com.aibi.neerp.componentpricing.entity.Unit;
import com.aibi.neerp.componentpricing.repository.AdditionalFloorsRepository;
import com.aibi.neerp.componentpricing.repository.CapacityTypeRepository;
import com.aibi.neerp.componentpricing.repository.FloorRepository;
import com.aibi.neerp.componentpricing.repository.UnitRepository;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.leadmanagement.entity.EnquiryType;
import com.aibi.neerp.leadmanagement.entity.LiftQuantity;
import com.aibi.neerp.leadmanagement.repository.EnquiryTypeRepository;
import com.aibi.neerp.leadmanagement.repository.LiftQuantityRepository;
import com.aibi.neerp.rolebackmanagement.entity.Role;
import com.aibi.neerp.rolebackmanagement.repository.RoleRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public ApplicationRunner initData(UnitRepository unitRepo,
                                      CapacityTypeRepository capRepo,
                                      ContractTypeRepository contractRepo,
                                      EnquiryTypeRepository enquiryTypeRepo,
                                      PaymentTermRepository paymentTermRepo,
                                      ElevatorMakeRepository elevatorMakeRepo,
                                      NumberOfServiceRepository numberOfServiceRepo) {
        return args -> {
            insertDefaultCapacityTypes(capRepo);
            insertDefaultUnit(unitRepo);
            insertDefaultContractTypes(contractRepo);
            insertDefaultEnquiryTypes(enquiryTypeRepo);
            insertDefaultPaymentTerms(paymentTermRepo);
            insertDefaultElevatorMakes(elevatorMakeRepo);
            insertDefaultNumberOfServices(numberOfServiceRepo);
        };
    }

    private void insertDefaultCapacityTypes(CapacityTypeRepository capRepo) {
        if (capRepo.count() == 0) {
            CapacityType person = new CapacityType();
            person.setType("Person");
            person.setFieldKey("personCapacityId");
            person.setFormKey("personId");
            capRepo.save(person);

            CapacityType kgs = new CapacityType();
            kgs.setType("Weight");
            kgs.setFieldKey("weightId");
            kgs.setFormKey("weightId");
            capRepo.save(kgs);

            System.out.println("✅ Default capacity types inserted.");
        }
    }

    private void insertDefaultUnit(UnitRepository unitRepo) {
        if (unitRepo.findByUnitNameIgnoreCase("Kg").isEmpty()) {
            Unit unit = new Unit();
            unit.setUnitName("Kg");
            unit.setDescription("Weight unit Kilograms");
            unitRepo.save(unit);

            System.out.println("✅ Default unit 'Kg' inserted.");
        }
    }

    private void insertDefaultContractTypes(ContractTypeRepository contractRepo) {
        String[] contractTypes = {"Non-Comprehensive", "Semi-Comprehensive", "Comprehensive"};
        for (String typeName : contractTypes) {
            if (!contractRepo.existsByName(typeName)) {
                ContractType ct = new ContractType();
                ct.setName(typeName);
                contractRepo.save(ct);
                System.out.println("✅ ContractType inserted: " + typeName);
            }
        }
    }

    private void insertDefaultEnquiryTypes(EnquiryTypeRepository enquiryTypeRepo) {
        String[] enquiryTypes = {"AMC", "New Installation", "Moderization", "On Call"};
        for (String name : enquiryTypes) {
            boolean exists = enquiryTypeRepo.existsByEnquiryTypeName(name);
            if (!exists) {
                EnquiryType et = new EnquiryType();
                et.setEnquiryTypeName(name);
                enquiryTypeRepo.save(et);
                System.out.println("✅ EnquiryType inserted: " + name);
            }
        }
    }

    private void insertDefaultPaymentTerms(PaymentTermRepository paymentTermRepo) {
        String[] paymentTerms = {"Quarterly", "Half Yearly", "Yearly"};

        for (String name : paymentTerms) {
            if (!paymentTermRepo.existsByTermName(name)) {
                PaymentTerm pt = new PaymentTerm();
                pt.setTermName(name);
                pt.setDescription(""); // You can leave description empty or add custom text
                paymentTermRepo.save(pt);
                System.out.println("✅ PaymentTerm inserted: " + name);
            }
        }
    }

    private void insertDefaultElevatorMakes(ElevatorMakeRepository elevatorMakeRepo) {
        String[] makes = {
                "KONE", "Schindler", "Kinetic Hyundai", "Escon", "Otis",
                "Omega", "ThyssenKrupp", "Opel", "Eros", "Smash",
                "Johnson", "Prime", "others"
        };

        for (String name : makes) {
            if (!elevatorMakeRepo.existsByName(name)) {
                ElevatorMake em = new ElevatorMake();
                em.setName(name);
                elevatorMakeRepo.save(em);
                System.out.println("✅ ElevatorMake inserted: " + name);
            }
        }
    }

    private void insertDefaultNumberOfServices(NumberOfServiceRepository numberOfServiceRepo) {
        for (int val = 1; val <= 12; val++) {
            if (!numberOfServiceRepo.existsByValue(val)) {
                NumberOfService ns = new NumberOfService();
                ns.setValue(val);
                numberOfServiceRepo.save(ns);
                System.out.println("✅ NumberOfService inserted: " + val);
            }
        }
    }



    
    
    
}
