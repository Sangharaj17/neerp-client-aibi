package com.aibi.neerp.leadmanagement.service;

import com.aibi.neerp.componentpricing.dto.AdditionalFloorDTO;
import com.aibi.neerp.componentpricing.entity.AdditionalFloors;
import com.aibi.neerp.exception.ResourceInUseException;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.leadmanagement.dto.*;
import com.aibi.neerp.leadmanagement.dto.response.EnquiryResponseDTO;
import com.aibi.neerp.leadmanagement.entity.*;
import com.aibi.neerp.leadmanagement.repository.*;

import com.aibi.neerp.materialmanagement.dto.CabinTypeDto;
import com.aibi.neerp.materialmanagement.dto.CapacityTypeDto;
import com.aibi.neerp.materialmanagement.dto.FloorDto;
import com.aibi.neerp.materialmanagement.dto.MachineRoomDto;
import com.aibi.neerp.materialmanagement.dto.OperatorElevatorDto;
import com.aibi.neerp.materialmanagement.dto.PersonCapacityDto;
import com.aibi.neerp.materialmanagement.dto.TypeOfLiftDto;
import com.aibi.neerp.materialmanagement.dto.WeightDto;
import com.aibi.neerp.settings.service.CompanySettingService;
import com.aibi.neerp.componentpricing.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.convert.DtoInstantiatingConverter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
public class EnquiryService {

    @Autowired
    private EnquiryRepository enquiryRepository;
    @Autowired
    private NewLeadsRepository newLeadsRepository;
    @Autowired
    private TypeOfLiftRepository typeOfLiftRepository;
    @Autowired
    private OperatorElevatorRepository operatorElevatorRepository;
    @Autowired
    private CabinTypeRepository cabinTypeRepository;
    @Autowired
    private LiftQuantityRepository liftQuantityRepository;
    @Autowired
    private CapacityTypeRepository capacityTypeRepository;
    @Autowired
    private PersonCapacityRepository personCapacityRepository;
    @Autowired
    private WeightRepository weightRepository;
    @Autowired
    private FloorRepository floorRepository;
    @Autowired
    private FloorDesignationRepository floorDesignationRepository;
    @Autowired
    private MachineRoomRepository machineRoomRepository;
    @Autowired
    private ProjectStageRepository projectStageRepository;
    @Autowired
    private BuildTypeRepository buildTypeRepository;
    @Autowired
    private CombinedEnquiryRepository combinedEnquiryRepository;
    @Autowired
    private EnquiryTypeRepository enquiryTypeRepository;
    @Autowired
    private BuildingTypeRepository buildingTypeRepository;
    @Autowired
    private AdditionalFloorsRepository additionalFloorsRepository;
    @Autowired
    private com.aibi.neerp.quotation.repository.QuotationLiftDetailRepository quotationLiftDetailRepository;
    
    @Autowired
    private CompanySettingService companySettingService;

    public List<EnquiryResponseDto> getAllSingleEnquirys(Integer enquiryTypeId) {
        return enquiryRepository.findByCombinedEnquiryIsNullAndEnquiryType_EnquiryTypeId(enquiryTypeId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }


    //    public List<CombinedEnquiryResponseDto> getAllCombinedEnquiriesByLeadId(Integer leadId) {
//        List<CombinedEnquiry> combinedList = combinedEnquiryRepository.findByLead_LeadId(leadId);
//
//        if (combinedList == null || combinedList.isEmpty()) {
//            throw new ResourceNotFoundException("No combined enquiries found for lead ID: " + leadId);
//        }
//
//        return combinedList.stream()
//                .map(this::toCombinedEnquiryDto)
//                .collect(Collectors.toList());
//    }
    public List<CombinedEnquiryResponseDto> getAllCombinedEnquiriesByLeadId(Integer leadId, Integer enquiryTypeId) {
        List<CombinedEnquiry> combinedList;

        if (enquiryTypeId != null) {
            combinedList = combinedEnquiryRepository.findByLead_LeadIdAndEnquiryType_EnquiryTypeId(leadId, enquiryTypeId);
        } else {
            combinedList = combinedEnquiryRepository.findByLead_LeadId(leadId);
        }

        if (combinedList.isEmpty()) {
            throw new ResourceNotFoundException("No combined enquiries found for lead ID: " + leadId);
        }

        return combinedList.stream()
                .map(this::toCombinedEnquiryDto)
                .collect(Collectors.toList());
    }


    public CombinedEnquiryResponseDto toCombinedEnquiryDto(CombinedEnquiry entity) {
//        List<EnquiryResponseDto> enquiryDtos = entity.getEnquiries().stream()
//                .map(this::toDto) // Replace with your own mapping method
//                .collect(Collectors.toList());

        List<EnquiryResponseDto> enquiryDtos = entity.getEnquiries().stream()
                .sorted(Comparator.comparing(Enquiry::getEnquiryId)) // ✅ Sort by enquiryId
                .map(this::toDto)
                .collect(Collectors.toList());

        CombinedEnquiryResponseDto dto = new CombinedEnquiryResponseDto();
        dto.setId(entity.getId());
        dto.setLeadId(entity.getLead().getLeadId());
        dto.setProjectName(entity.getProjectName());
        dto.setSiteName(entity.getSiteName());;
        dto.setEnquiryDate(entity.getCreatedDate());

        Double amcGst = companySettingService
                .getCompanySetting()
                .getGstRateAmcTotalPercentage();

        dto.setCompanyAmcGstPercentage(
                amcGst != null ? amcGst : 0.0
        );



        // dto.setLeadCompanyName(entity.getLead().getCompanyName());

        NewLeads lead = entity.getLead();

        String salutations = lead.getSalutations();
        String customerName = lead.getCustomerName();
        String customerSite = lead.getSiteName();

        String selectLead = salutations + "." + customerName + " For " + customerSite;

        dto.setCustomerName(customerName);
        dto.setCustomerSite(customerSite);
        dto.setSelectLead(selectLead);

        dto.setEnquiries(enquiryDtos);

        return dto;
    }


    public EnquiryResponseDto getById(Integer id) {
        Enquiry enquiry = enquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry not found with id: " + id));
        return toDto(enquiry);
    }

    public EnquiryResponseDto create(EnquiryRequestDto dto) {
        Enquiry e = new Enquiry();
        e.setEnqDate(dto.getEnqDate());
        e.setLead(newLeadsRepository.findById(dto.getLeadId()).orElseThrow());
        e.setEnquiryType(enquiryTypeRepository.findById(dto.getEnquiryTypeId()).orElseThrow());
        ;
        e.setTypeOfLift(typeOfLiftRepository.findById(dto.getTypeOfLiftId()).orElse(null));
        e.setLiftType(operatorElevatorRepository.findById(dto.getLiftTypeId()).orElse(null));
        e.setCabinType(cabinTypeRepository.findById(dto.getCabinTypeId()).orElse(null));
        e.setNoOfLift(liftQuantityRepository.findById(dto.getNoOfLiftId()).orElse(null));
        e.setCapacityTerm(capacityTypeRepository.findById(dto.getCapacityTermId()).orElse(null));
        e.setPersonCapacity(personCapacityRepository.findById(dto.getPersonCapacityId()).orElse(null));
        e.setWeight(weightRepository.findById(dto.getWeightId()).orElse(null));
        e.setNoOfStops(dto.getNoOfStops());
        e.setNoOfOpenings(dto.getNoOfOpenings());
        e.setNoOfFloors(floorRepository.findById(Long.valueOf(dto.getNoOfFloorsId())).orElse(null));
        e.setParkFloor(dto.getParkFloor());
        e.setFloorsDesignation(dto.getFloorsDesignation());
        e.setReqMachineRoom(machineRoomRepository.findById(dto.getReqMachineRoomId()).orElse(null));
        e.setShaftsWidth(dto.getShaftsWidth());
        e.setShaftsDepth(dto.getShaftsDepth());
        e.setProjectRate(dto.getProjectRate());
        e.setProjectStage(projectStageRepository.findById(dto.getProjectStageId()).orElse(null));
        e.setBuildType(buildTypeRepository.findById(dto.getBuildTypeId()).orElse(null));
        e.setReqMachineWidth(dto.getReqMachineWidth());
        e.setReqMachineDepth(dto.getReqMachineDepth());
        e.setCarInternalWidth(dto.getCarInternalWidth());
        e.setCarInternalDepth(dto.getCarInternalDepth());
        e.setProduct1(dto.getProduct1());
        e.setProduct2(dto.getProduct2());
        e.setProduct3(dto.getProduct3());
        e.setProduct4(dto.getProduct4());
        e.setProduct5(dto.getProduct5());
        e.setMachine1(dto.getMachine1());
        e.setMachine2(dto.getMachine2());
        e.setMachine3(dto.getMachine3());
        e.setMachine4(dto.getMachine4());
        e.setMachine5(dto.getMachine5());
        e.setLanding1(dto.getLanding1());
        e.setLanding2(dto.getLanding2());
        e.setLanding3(dto.getLanding3());
        e.setLanding4(dto.getLanding4());
        e.setLanding5(dto.getLanding5());
        e.setPrice1(dto.getPrice1());
        e.setPrice2(dto.getPrice2());
        e.setPrice3(dto.getPrice3());
        e.setPrice4(dto.getPrice4());
        e.setPrice5(dto.getPrice5());
        e.setPit(dto.getPit());
        if (dto.getCombinedEnquiryId() != null) {
            e.setCombinedEnquiry(combinedEnquiryRepository.findById(dto.getCombinedEnquiryId()).orElse(null));
        }

        // Handle additional floors
        if (dto.getFloorSelections() != null && !dto.getFloorSelections().isEmpty()) {
            Set<AdditionalFloors> floors = dto.getFloorSelections().stream()
                    .map(code -> additionalFloorsRepository.findByCode(code)
                            .orElseThrow(() -> new RuntimeException("Invalid floor code: " + code)))
                    .collect(Collectors.toSet());

            e.setAdditionalFloors(floors);
        }

        return toDto(enquiryRepository.save(e));
    }

    public Enquiry toEntity(EnquiryRequestDto dto) {

        System.out.println("165" + dto.getLeadId());
        Enquiry e = new Enquiry();
        e.setEnqDate(dto.getEnqDate());
        
        e.setLiftName(dto.getLiftName());;

        e.setLead(newLeadsRepository.findById(dto.getLeadId()).orElseThrow());

        System.out.println("171");

        if (dto.getFrom() != null) {
            e.setFrom(dto.getFrom());
        }
        //   if(dto.isChecked()!=null) {

        //  }
        e.setChecked(dto.getChecked());

        if (dto.getBuildingTypeId() != null) {
            BuildingType buildingType = buildingTypeRepository.findById(dto.getBuildingTypeId()).get();

            e.setBuildingType(buildingType);
        }


        // System.out.println(dto.getEnquiryTypeId()+" enq id is ");

        // e.setEnquiryType(enquiryTypeRepository.findById(dto.getEnquiryTypeId()).orElseThrow());

        e.setTypeOfLift(typeOfLiftRepository.findById(dto.getTypeOfLiftId()).orElse(null));
        e.setLiftType(operatorElevatorRepository.findById(dto.getLiftTypeId()).orElse(null));
        e.setCabinType(cabinTypeRepository.findById(dto.getCabinTypeId()).orElse(null));

        // e.setNoOfLift(liftQuantityRepository.findById(dto.getNoOfLiftId()).orElse(null));

        System.out.println("come to line 179");

        e.setCapacityTerm(capacityTypeRepository.findById(dto.getCapacityTermId()).orElse(null));

        if (dto.getPersonCapacityId() != null)
            e.setPersonCapacity(personCapacityRepository.findById(dto.getPersonCapacityId()).orElse(null));

        if (dto.getWeightId() != null)
            e.setWeight(weightRepository.findById(dto.getWeightId()).orElse(null));

        if (dto.getFloorSelections() != null && !dto.getFloorSelections().isEmpty()) {
            Set<AdditionalFloors> floors = dto.getFloorSelections().stream()
                    .map(code -> additionalFloorsRepository.findByCode(code)
                            .orElseThrow(() -> new RuntimeException("Invalid floor code: " + code)))
                    .collect(Collectors.toSet());
            e.setAdditionalFloors(floors);
        }


        e.setNoOfStops(dto.getNoOfStops());
        e.setNoOfOpenings(dto.getNoOfOpenings());

        System.out.println(dto.getNoOfFloorsId() + " floor id");
        e.setNoOfFloors(floorRepository.findById(Long.valueOf(dto.getNoOfFloorsId())).orElse(null));
        e.setParkFloor(dto.getParkFloor());
        e.setFloorsDesignation(dto.getFloorsDesignation());
        e.setReqMachineRoom(machineRoomRepository.findById(dto.getReqMachineRoomId()).orElse(null));
        e.setShaftsWidth(dto.getShaftsWidth());
        e.setShaftsDepth(dto.getShaftsDepth());
        e.setProjectRate(dto.getProjectRate());
        if (dto.getProjectStageId() != null)
            e.setProjectStage(projectStageRepository.findById(dto.getProjectStageId()).orElse(null));

        e.setBuildType(buildTypeRepository.findById(dto.getBuildTypeId()).orElse(null));
        e.setReqMachineWidth(dto.getReqMachineWidth());
        e.setReqMachineDepth(dto.getReqMachineDepth());
        e.setCarInternalWidth(dto.getCarInternalWidth());
        e.setCarInternalDepth(dto.getCarInternalDepth());
        e.setProduct1(dto.getProduct1());
        e.setProduct2(dto.getProduct2());
        e.setProduct3(dto.getProduct3());
        e.setProduct4(dto.getProduct4());
        e.setProduct5(dto.getProduct5());
        e.setMachine1(dto.getMachine1());
        e.setMachine2(dto.getMachine2());
        e.setMachine3(dto.getMachine3());
        e.setMachine4(dto.getMachine4());
        e.setMachine5(dto.getMachine5());
        e.setLanding1(dto.getLanding1());
        e.setLanding2(dto.getLanding2());
        e.setLanding3(dto.getLanding3());
        e.setLanding4(dto.getLanding4());
        e.setLanding5(dto.getLanding5());
        e.setPrice1(dto.getPrice1());
        e.setPrice2(dto.getPrice2());
        e.setPrice3(dto.getPrice3());
        e.setPrice4(dto.getPrice4());
        e.setPrice5(dto.getPrice5());
        e.setPit(dto.getPit());

        return e;
    }

    public EnquiryResponseDto createSubOrNewCombinedEnquiry(Integer combinedEnquiryId, Integer leadId, EnquiryRequestDto dto, String projectName) {
        CombinedEnquiry combinedEnquiry = combinedEnquiryRepository.findById(combinedEnquiryId)
                .orElseGet(() -> {
                    CombinedEnquiry newCombined = new CombinedEnquiry();

                    NewLeads lead = newLeadsRepository.findById(leadId)
                            .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + leadId));
                    newCombined.setLead(lead);
                    newCombined.setProjectName(projectName);

                    EnquiryType enquiryType = enquiryTypeRepository.findById(dto.getEnquiryTypeId())
                            .orElseThrow(() -> new ResourceNotFoundException("EnquiryType not found with id: " + dto.getEnquiryTypeId()));
                    newCombined.setEnquiryType(enquiryType);

                    return combinedEnquiryRepository.save(newCombined);
                });

        dto.setCombinedEnquiryId(combinedEnquiry.getId());
        return create(dto);
    }

//    public void createCombinedEnquiryes(Integer leadId, List<EnquiryRequestDto> dtos , 
//    		String projectName , Integer enquiryTypeId) {
//    	
//    	 CombinedEnquiry newCombined = new CombinedEnquiry();
//         
//         NewLeads lead = newLeadsRepository.findById(leadId)
//             .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + leadId));
//         newCombined.setLead(lead);
//         newCombined.setProjectName(projectName);
//         
//         EnquiryType enquiryType = enquiryTypeRepository.findById(enquiryTypeId)
//                 .orElseThrow(() -> new ResourceNotFoundException("EnquiryType not found with id: " + enquiryTypeId));
//         newCombined.setEnquiryType(enquiryType);
//         
//         List<Enquiry> enquiries = new ArrayList<Enquiry>();
//         
//         for(EnquiryRequestDto dto : dtos) {
//        	  
//        	 Enquiry enquiry = toEntity(dto);
//        	 enquiries.add(enquiry);
//        	 enquiry.setCombinedEnquiry(newCombined);
//          }
//         newCombined.setEnquiries(enquiries);
//         newCombined = combinedEnquiryRepository.save(newCombined);
//    }


    public EnquiryResponseDto updateEnquiry(Integer id, EnquiryRequestDto dto) {
        Enquiry enquiry = enquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry not found with id: " + id));

        enquiry.setEnqDate(dto.getEnqDate());
        enquiry.setLead(newLeadsRepository.findById(dto.getLeadId())
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found")));
        enquiry.setTypeOfLift(typeOfLiftRepository.findById(dto.getTypeOfLiftId())
                .orElseThrow(() -> new ResourceNotFoundException("Type of Lift not found")));
        enquiry.setLiftType(operatorElevatorRepository.findById(dto.getLiftTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Lift Type not found")));
        enquiry.setCabinType(cabinTypeRepository.findById(dto.getCabinTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Cabin Type not found")));
        enquiry.setNoOfLift(liftQuantityRepository.findById(dto.getNoOfLiftId())
                .orElseThrow(() -> new ResourceNotFoundException("Lift Quantity not found")));
        enquiry.setCapacityTerm(capacityTypeRepository.findById(dto.getCapacityTermId())
                .orElseThrow(() -> new ResourceNotFoundException("Capacity Term not found")));
        enquiry.setPersonCapacity(personCapacityRepository.findById(dto.getPersonCapacityId())
                .orElseThrow(() -> new ResourceNotFoundException("Person Capacity not found")));

        if (dto.getWeightId() != null) {
            enquiry.setWeight(weightRepository.findById(dto.getWeightId())
                    .orElseThrow(() -> new ResourceNotFoundException("Weight not found")));
        }

        enquiry.setNoOfStops(dto.getNoOfStops());
        enquiry.setNoOfOpenings(dto.getNoOfOpenings());

        enquiry.setNoOfFloors(floorRepository.findById(Long.valueOf(dto.getNoOfFloorsId()))
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found")));

        enquiry.setParkFloor(dto.getParkFloor());

        enquiry.setFloorsDesignation(dto.getFloorsDesignation());

        enquiry.setReqMachineRoom(machineRoomRepository.findById(dto.getReqMachineRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Machine Room not found")));

        enquiry.setShaftsWidth(dto.getShaftsWidth());
        enquiry.setShaftsDepth(dto.getShaftsDepth());
        enquiry.setProjectRate(dto.getProjectRate());

        enquiry.setProjectStage(projectStageRepository.findById(dto.getProjectStageId())
                .orElseThrow(() -> new ResourceNotFoundException("Project Stage not found")));

        enquiry.setBuildType(buildTypeRepository.findById(dto.getBuildTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Build Type not found")));

        enquiry.setReqMachineWidth(dto.getReqMachineWidth());
        enquiry.setReqMachineDepth(dto.getReqMachineDepth());
        enquiry.setCarInternalWidth(dto.getCarInternalWidth());
        enquiry.setCarInternalDepth(dto.getCarInternalDepth());

        enquiry.setProduct1(dto.getProduct1());
        enquiry.setProduct2(dto.getProduct2());
        enquiry.setProduct3(dto.getProduct3());
        enquiry.setProduct4(dto.getProduct4());
        enquiry.setProduct5(dto.getProduct5());

        enquiry.setMachine1(dto.getMachine1());
        enquiry.setMachine2(dto.getMachine2());
        enquiry.setMachine3(dto.getMachine3());
        enquiry.setMachine4(dto.getMachine4());
        enquiry.setMachine5(dto.getMachine5());

        enquiry.setLanding1(dto.getLanding1());
        enquiry.setLanding2(dto.getLanding2());
        enquiry.setLanding3(dto.getLanding3());
        enquiry.setLanding4(dto.getLanding4());
        enquiry.setLanding5(dto.getLanding5());

        enquiry.setPrice1(dto.getPrice1());
        enquiry.setPrice2(dto.getPrice2());
        enquiry.setPrice3(dto.getPrice3());
        enquiry.setPrice4(dto.getPrice4());
        enquiry.setPrice5(dto.getPrice5());

        enquiry.setPit(dto.getPit());

        return toDto(enquiryRepository.save(enquiry));
    }


//    public void delete(Integer id) {
//        if (!enquiryRepository.existsById(id)) {
//            throw new ResourceNotFoundException("Enquiry not found with id: " + id);
//        }
//        try {
//            enquiryRepository.deleteById(id);
//        } catch (DataIntegrityViolationException e) {
//            throw new ResourceInUseException("Cannot delete enquiry because it's used in other records.");
//        }
//    }

    @Transactional
    public void delete(Integer id) {
        Enquiry enquiry = enquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry not found with id: " + id));

        CombinedEnquiry combined = enquiry.getCombinedEnquiry();

        try {
            enquiryRepository.delete(enquiry);

            // After deletion, check if any other enquiries exist under this combined enquiry
            if (combined != null) {
                long count = enquiryRepository.countByCombinedEnquiry(combined);
                if (count == 0) {
                    combinedEnquiryRepository.delete(combined);
                }
            }

        } catch (DataIntegrityViolationException e) {
            throw new ResourceInUseException("Cannot delete enquiry because it's used in other records.");
        }
    }


    public EnquiryResponseDto toDto(Enquiry e) {
        NewLeads lead = e.getLead();
        NewLeadsResponseDto leadDto = new NewLeadsResponseDto();
        leadDto.setLeadId(lead.getLeadId());
        leadDto.setLeadCompanyName(lead.getLeadCompanyName());
        leadDto.setSiteName(lead.getSiteName());
        leadDto.setLeadType(lead.getLeadType());

        EnquiryResponseDto dto = new EnquiryResponseDto();
        dto.setEnquiryId(e.getEnquiryId());
        dto.setEnqDate(e.getEnqDate());
        dto.setLead(leadDto);

        dto.setBuildingType(e.getBuildingType());

        dto.setChecked(e.getChecked());
        dto.setFrom(e.getFrom());

        if (e.getEnquiryType() != null) {
            EnquiryTypeResponseDto enquiryTypeResponseDto = new EnquiryTypeResponseDto();
            enquiryTypeResponseDto.setEnquiryTypeId(e.getEnquiryType().getEnquiryTypeId());
            enquiryTypeResponseDto.setEnquiryTypeName(e.getEnquiryType().getEnquiryTypeName());
        }
        if (e.getTypeOfLift() != null) {
            TypeOfLiftDto d = new TypeOfLiftDto();
            d.setId(e.getTypeOfLift().getId());
            d.setLiftTypeName(e.getTypeOfLift().getLiftTypeName());
            dto.setTypeOfLift(d);
        }
        if (e.getLiftType() != null) {
            OperatorElevatorDto d = new OperatorElevatorDto();
            d.setId(e.getLiftType().getId());
            d.setName(e.getLiftType().getName());
            dto.setLiftType(d);
        }
        if (e.getCabinType() != null) {
            CabinTypeDto d = new CabinTypeDto();
            d.setId(e.getCabinType().getId());
            d.setCabinType(e.getCabinType().getCabinType());
            dto.setCabinType(d);
        }
        if (e.getNoOfLift() != null) {
            LiftQuantityDto d = new LiftQuantityDto();
            d.setId(e.getNoOfLift().getId());
            d.setQuantity(e.getNoOfLift().getQuantity());
            dto.setNoOfLift(d);
        }
        if (e.getCapacityTerm() != null) {
            CapacityTypeDto d = new CapacityTypeDto();
            d.setId(e.getCapacityTerm().getId());
            d.setCapacityType(e.getCapacityTerm().getType());
            // d.setTableName(e.getCapacityTerm().getTableName());
            dto.setCapacityTerm(d);
        }
        if (e.getPersonCapacity() != null) {
            PersonCapacityDto d = new PersonCapacityDto();
            d.setId(e.getPersonCapacity().getId());
            d.setPersonCount(e.getPersonCapacity().getPersonCount());
            d.setWeight(e.getPersonCapacity().getIndividualWeight());
            d.setText(e.getPersonCapacity().getDisplayName());
            d.setUnit(e.getPersonCapacity().getUnit().getUnitName());
            dto.setPersonCapacity(d);
        }
        if (e.getWeight() != null) {
            WeightDto d = new WeightDto();
            d.setId(e.getWeight().getId());
            d.setWeightValue(e.getWeight().getWeightValue());
            d.setUnit(e.getWeight().getUnit().getUnitName());
            dto.setWeight(d);
        }

        dto.setNoOfStops(e.getNoOfStops());
        dto.setNoOfOpenings(e.getNoOfOpenings());
        dto.setParkFloor(e.getParkFloor());
        dto.setShaftsWidth(e.getShaftsWidth());
        dto.setShaftsDepth(e.getShaftsDepth());
        dto.setProjectRate(e.getProjectRate());
        dto.setReqMachineWidth(e.getReqMachineWidth());
        dto.setReqMachineDepth(e.getReqMachineDepth());
        dto.setCarInternalWidth(e.getCarInternalWidth());
        dto.setCarInternalDepth(e.getCarInternalDepth());

        dto.setProduct1(e.getProduct1());
        dto.setProduct2(e.getProduct2());
        dto.setProduct3(e.getProduct3());
        dto.setProduct4(e.getProduct4());
        dto.setProduct5(e.getProduct5());

        dto.setMachine1(e.getMachine1());
        dto.setMachine2(e.getMachine2());
        dto.setMachine3(e.getMachine3());
        dto.setMachine4(e.getMachine4());
        dto.setMachine5(e.getMachine5());

        dto.setLanding1(e.getLanding1());
        dto.setLanding2(e.getLanding2());
        dto.setLanding3(e.getLanding3());
        dto.setLanding4(e.getLanding4());
        dto.setLanding5(e.getLanding5());

        dto.setPrice1(e.getPrice1());
        dto.setPrice2(e.getPrice2());
        dto.setPrice3(e.getPrice3());
        dto.setPrice4(e.getPrice4());
        dto.setPrice5(e.getPrice5());

        dto.setPit(e.getPit());

        if (e.getNoOfFloors() != null) {
            FloorDto d = new FloorDto();
            d.setId(e.getNoOfFloors().getId());
            d.setName(e.getNoOfFloors().getFloorName());
            dto.setNoOfFloors(d);
        }
        if (e.getFloorsDesignation() != null) {
//            FloorDesignationDto d = new FloorDesignationDto();
//            d.setFloorDesignationId(e.getFloorsDesignation().getFloorDesignationId());
//            d.setName(e.getFloorsDesignation().getName());
            dto.setFloorsDesignation(e.getFloorsDesignation());
        }
        if (e.getReqMachineRoom() != null) {
            MachineRoomDto d = new MachineRoomDto();
            d.setId(e.getReqMachineRoom().getId());
            d.setMachineRoomName(e.getReqMachineRoom().getMachineRoomName());
            dto.setReqMachineRoom(d);
        }
        if (e.getProjectStage() != null) {
            ProjectStageDto d = new ProjectStageDto();
            d.setId(e.getProjectStage().getId());
            d.setStageName(e.getProjectStage().getStageName());
            dto.setProjectStage(d);
        }
        if (e.getBuildType() != null) {
            BuildTypeDto d = new BuildTypeDto();
            d.setId(e.getBuildType().getId());
            d.setName(e.getBuildType().getName());
            dto.setBuildType(d);
        }

        List<AdditionalFloorDTO> floors = e.getAdditionalFloors() == null
                ? new ArrayList<>()
                : e.getAdditionalFloors()
                .stream()
                .map(f -> new AdditionalFloorDTO(f.getId(), f.getCode(), f.getLabel()))
                .toList();

        dto.setFloorSelections(floors);

        System.out.println("Additional Floors for enquiry --------> "+  floors);


        return dto;
    }


    public EnquiryTypeResponseDto toDto(EnquiryType type) {
        EnquiryTypeResponseDto dto = new EnquiryTypeResponseDto();
        dto.setEnquiryTypeId(type.getEnquiryTypeId());
        dto.setEnquiryTypeName(type.getEnquiryTypeName());
        return dto;
    }


//    public EnquiryResponseDTO getEnquiryByLeadAndEnquiry(Integer leadId, Integer enquiryId) {
//        log.info("Fetching enquiry for leadId={} and enquiryId={}", leadId, enquiryId);
//
//        Enquiry enquiry = enquiryRepository.findByLead_LeadIdAndCombinedEnquiryId(leadId, enquiryId)
//                .orElseThrow(() -> new RuntimeException("Enquiry not found for leadId=" + leadId + ", enquiryId=" + enquiryId));
//
//        return mapToDTO(enquiry);
//    }

    public List<EnquiryResponseDto> getEnquiriesByLeadAndEnquiry(Integer leadId, Integer enquiryId) {
        log.info("Fetching enquiry for leadId={} and enquiryId={}", leadId, enquiryId);

        List<Enquiry> enquiries = enquiryRepository.findByLead_LeadIdAndCombinedEnquiryId(leadId, enquiryId);

        if (enquiries.isEmpty()) {
            throw new RuntimeException("Enquiry not found for leadId=" + leadId + ", enquiryId=" + enquiryId);
        }

        return enquiries.stream()
                .map(this::toDto)
                .toList();
    }


//    private EnquiryResponseDTO mapToDTO(Enquiry enquiry) {
//        return EnquiryResponseDTO.builder()
//                .enquiryId(enquiry.getEnquiryId())
//                .enquiryDate(enquiry.getEnqDate() != null ? enquiry.getEnqDate().toString() : null)
//                .leadId(enquiry.getLead() != null ? enquiry.getLead().getLeadId() : null)
//                .leadCompanyName(enquiry.getLead() != null ? enquiry.getLead().getLeadCompanyName() : null)
//                .liftType(enquiry.getLiftType() != null ? enquiry.getLiftType().getName() : null)
//                .cabinType(enquiry.getCabinType() != null ? enquiry.getCabinType().getCabinType() : null)
//                .capacityTerm(enquiry.getCapacityTerm() != null ? enquiry.getCapacityTerm().getType() : null)
//                .noOfStops(enquiry.getNoOfStops())
//                .noOfOpenings(enquiry.getNoOfOpenings())
//                .parkFloor(enquiry.getParkFloor())
//                .shaftsWidth(enquiry.getShaftsWidth())
//                .shaftsDepth(enquiry.getShaftsDepth())
//                .carInternalWidth(enquiry.getCarInternalWidth())
//                .carInternalDepth(enquiry.getCarInternalDepth())
//                .build();
//    }

    public List<EnquiryResponseDto> getMissingLiftsForQuotation(Integer leadId, Integer combinedEnquiryId) {
        // 1️⃣ Get all enquiry lifts for this Lead + Combined Enquiry
        List<Enquiry> allEnquiryLifts = enquiryRepository.findByLead_LeadIdAndCombinedEnquiryId(leadId, combinedEnquiryId);

        if (allEnquiryLifts.isEmpty()) {
            throw new RuntimeException("No enquiries found for leadId=" + leadId + " and combinedEnquiryId=" + combinedEnquiryId);
        }

        System.out.println("allEnquiryLifts: " + allEnquiryLifts);
        System.out.println("🔹 Enquiry IDs in allEnquiryLifts:");
        allEnquiryLifts.forEach(e -> System.out.println("   → Enquiry ID: " + e.getEnquiryId()));

        // 2️⃣ Get all enquiry IDs that already exist in QuotationLiftDetail
        List<Integer> savedEnquiryIds = quotationLiftDetailRepository.findEnquiryIdsByLeadAndCombinedEnquiry(leadId, combinedEnquiryId);

        System.out.println("Saved Enquiry IDs: " + savedEnquiryIds);
        // 3️⃣ Filter out those enquiries that are already saved
        List<Enquiry> missingLifts = allEnquiryLifts.stream()
                .filter(e -> e.getEnquiryId() != null && (savedEnquiryIds == null || !savedEnquiryIds.contains(e.getEnquiryId())))
                .toList();

        System.out.println("Missing Lifts: " + missingLifts);
        System.out.println("🔹 Enquiry IDs in Missing Lifts:");
        missingLifts.forEach(e -> System.out.println("   → Missing Lift Enquiry ID: " + e.getEnquiryId()));


        // 4️⃣ Convert to DTOs
        return missingLifts.stream()
                .map(this::toDto)
                .toList();

    }
}
