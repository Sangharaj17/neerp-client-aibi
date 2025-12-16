package com.aibi.neerp.leadmanagement.service;

import com.aibi.neerp.leadmanagement.dto.*;
import com.aibi.neerp.leadmanagement.entity.LeadStage;
import com.aibi.neerp.leadmanagement.entity.LeadStatus;
import com.aibi.neerp.leadmanagement.entity.LeadStatusCloseData;
import com.aibi.neerp.leadmanagement.entity.NewLeads;
import com.aibi.neerp.leadmanagement.entity.ProjectStage;
import com.aibi.neerp.leadmanagement.repository.*;
import com.aibi.neerp.common.dto.PaginatedResponse;
import com.aibi.neerp.employeemanagement.dto.EmployeeDto;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.rolebackmanagement.dto.RoleDto;
import com.aibi.neerp.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NewLeadsService {

    @Autowired
    private NewLeadsRepository newLeadsRepository;
    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private LeadSourceRepository leadSourceRepository;
    @Autowired
    private DesignationRepository designationRepository;
    @Autowired
    private LeadStageRepository leadStageRepository;
    @Autowired
    private ContractRepository contractRepository;
    @Autowired
    private AreaRepository areaRepository;
    @Autowired
    private ProjectStageRepository projectStageRepository;
    @Autowired
    private LeadStatusRepository leadStatusRepository;

    public PaginatedResponse<NewLeadsResponseDto> getAllLeads(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("leadDate").descending());

        Page<NewLeads> leadsPage;

        if (keyword == null || keyword.trim().isEmpty()) {
            leadsPage = newLeadsRepository.findAll(pageable);
        } else {
            leadsPage = newLeadsRepository.searchByKeyword(keyword.toLowerCase(), pageable);
        }

        List<NewLeadsResponseDto> data = leadsPage.getContent()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return new PaginatedResponse<>(
                data,
                page,
                size,
                leadsPage.getTotalPages(),
                leadsPage.getTotalElements(),
                leadsPage.isFirst(),
                leadsPage.isLast());
    }

    public NewLeadsResponseDto getLeadById(Integer id) {
        NewLeads lead = newLeadsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));
        return toDto(lead);
    }

    public NewLeadsResponseDto createLead(NewLeadsRequestDto dto) {
        // Sanitize input data
        sanitizeDto(dto);
        validateDto(dto);

        NewLeads lead = new NewLeads();

        lead.setLeadDate(dto.getLeadDate());
        lead.setLeadType(sanitizeText(dto.getLeadType()));
        lead.setLeadCompanyName(sanitizeText(dto.getLeadCompanyName()));
        lead.setSalutations(dto.getSalutations());
        lead.setSalutations2(dto.getSalutations2());
        lead.setCustomerName(sanitizeText(dto.getCustomerName()));
        lead.setCustomerName2(sanitizeText(dto.getCustomerName2()));
        lead.setEmailId(sanitizeEmail(dto.getEmailId()));
        lead.setEmailId2(sanitizeEmail(dto.getEmailId2()));
        lead.setCountryCode(dto.getCountryCode());
        lead.setContactNo(sanitizeMobile(dto.getContactNo()));
        lead.setCustomer1Contact(sanitizeMobile(dto.getCustomer1Contact()));
        lead.setCustomer2Contact(sanitizeMobile(dto.getCustomer2Contact()));
        lead.setLandlineNo(sanitizeLandline(dto.getLandlineNo()));
        lead.setAddress(sanitizeAddress(dto.getAddress()));
        lead.setSiteName(sanitizeText(dto.getSiteName()));
        lead.setSiteAddress(sanitizeAddress(dto.getSiteAddress()));
        lead.setStatus(dto.getStatus());
        lead.setReason(dto.getReason());
        lead.setIsSendQuotation(dto.getIsSendQuotation());
        lead.setQuatationId(dto.getQuatationId());
        lead.setAmcQuatationId(dto.getAmcQuatationId());
        lead.setModQuotId(dto.getModQuotId());
        lead.setOncallQuotId(dto.getOncallQuotId());
        lead.setExpiryDate(dto.getExpiryDate());
        lead.setMakeOfElevator(dto.getMakeOfElevator());
        lead.setNoOfElevator(dto.getNoOfElevator());
        lead.setGstPercentage(dto.getGstPercentage());
        lead.setAmountOrdinary(dto.getAmountOrdinary());
        lead.setGstOrdinary(dto.getGstOrdinary());
        lead.setTotalAmountOrdinary(dto.getTotalAmountOrdinary());
        lead.setAmountComp(dto.getAmountComp());
        lead.setGstComp(dto.getGstComp());
        lead.setTotalAmountComp(dto.getTotalAmountComp());

        lead.setActivityBy(employeeRepository.findById(dto.getActivityById())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found")));

        lead.setLeadSource(leadSourceRepository.findById(dto.getLeadSourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Lead Source not found")));
        lead.setDesignation(designationRepository.findById(dto.getDesignationId())
                .orElseThrow(() -> new ResourceNotFoundException("Designation not found")));

        LeadStatus leadStatus = leadStatusRepository.findByStatusNameIgnoreCase("Active")
                .orElseThrow(() -> new IllegalArgumentException("LeadStatus 'Active' not found"));

        lead.setLeadStatus(leadStatus);

        if (dto.getDesignation2Id() != null) {
            lead.setDesignation2(designationRepository.findById(dto.getDesignation2Id())
                    .orElseThrow(() -> new ResourceNotFoundException("Designation2 not found")));
        }
        if (dto.getLeadStageId() != null) {
            lead.setLeadStage(leadStageRepository.findById(dto.getLeadStageId())
                    .orElseThrow(() -> new ResourceNotFoundException("Lead Stage not found")));
        }
        if (dto.getContractId() != null) {
            lead.setContract(contractRepository.findById(dto.getContractId())
                    .orElseThrow(() -> new ResourceNotFoundException("Contract not found")));
        }
        if (dto.getAreaId() != null) {
            lead.setArea(areaRepository.findById(dto.getAreaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Area not found")));
        }

        return toDto(newLeadsRepository.save(lead));
    }

    // ============== Sanitization Methods ==============

    private void sanitizeDto(NewLeadsRequestDto dto) {
        if (dto.getContactNo() != null)
            dto.setContactNo(sanitizeMobile(dto.getContactNo()));
        if (dto.getCustomerName() != null)
            dto.setCustomerName(sanitizeText(dto.getCustomerName()));
        if (dto.getLeadCompanyName() != null)
            dto.setLeadCompanyName(sanitizeText(dto.getLeadCompanyName()));
        if (dto.getAddress() != null)
            dto.setAddress(sanitizeAddress(dto.getAddress()));
        if (dto.getEmailId() != null)
            dto.setEmailId(sanitizeEmail(dto.getEmailId()));
    }

    private void validateDto(NewLeadsRequestDto dto) {
        if (dto.getContactNo() != null && !dto.getContactNo().isEmpty()) {
            if (!dto.getContactNo().matches("^\\d{10}$")) {
                throw new IllegalArgumentException("Contact number must be exactly 10 digits");
            }
        }
        if (dto.getEmailId() != null && !dto.getEmailId().isEmpty()) {
            if (!isValidEmail(dto.getEmailId())) {
                throw new IllegalArgumentException("Invalid email format");
            }
        }
        if (dto.getEmailId2() != null && !dto.getEmailId2().isEmpty()) {
            if (!isValidEmail(dto.getEmailId2())) {
                throw new IllegalArgumentException("Invalid secondary email format");
            }
        }
    }

    private String sanitizeText(String input) {
        if (input == null)
            return null;
        return input.replaceAll("\\s+", " ").replaceAll("\\.{2,}", ".").trim();
    }

    private String sanitizeAddress(String input) {
        if (input == null)
            return null;
        return input.replaceAll("\\s+", " ").replaceAll("\\.{3,}", ".").replaceAll("^\\.*|\\.*$", "").trim();
    }

    private String sanitizeMobile(String input) {
        if (input == null)
            return null;
        return input.replaceAll("[^0-9]", "");
    }

    private String sanitizeLandline(String input) {
        if (input == null)
            return null;
        return input.replaceAll("[^0-9-]", "").trim();
    }

    private String sanitizeEmail(String input) {
        if (input == null)
            return null;
        return input.trim().toLowerCase();
    }

    private boolean isValidEmail(String email) {
        if (email == null || email.isEmpty())
            return true;
        String regex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.(com|in|net|org|co|io|gov|edu|info|biz|co\\.in|org\\.in|net\\.in|ac\\.in)$";
        return email.matches(regex);
    }

    public NewLeadsResponseDto updateLead(Integer id, NewLeadsRequestDto dto) {
        // Sanitize and validate input
        sanitizeDto(dto);
        validateDto(dto);

        NewLeads lead = newLeadsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));

        lead.setLeadDate(dto.getLeadDate());
        lead.setLeadType(sanitizeText(dto.getLeadType()));
        lead.setLeadCompanyName(sanitizeText(dto.getLeadCompanyName()));
        lead.setSalutations(dto.getSalutations());
        lead.setSalutations2(dto.getSalutations2());
        lead.setCustomerName(sanitizeText(dto.getCustomerName()));
        lead.setCustomerName2(sanitizeText(dto.getCustomerName2()));
        lead.setEmailId(sanitizeEmail(dto.getEmailId()));
        lead.setEmailId2(sanitizeEmail(dto.getEmailId2()));
        lead.setCountryCode(dto.getCountryCode());
        lead.setContactNo(sanitizeMobile(dto.getContactNo()));
        lead.setCustomer1Contact(sanitizeMobile(dto.getCustomer1Contact()));
        lead.setCustomer2Contact(sanitizeMobile(dto.getCustomer2Contact()));
        lead.setLandlineNo(sanitizeLandline(dto.getLandlineNo()));
        lead.setAddress(sanitizeAddress(dto.getAddress()));
        lead.setSiteName(sanitizeText(dto.getSiteName()));
        lead.setSiteAddress(sanitizeAddress(dto.getSiteAddress()));
        lead.setStatus(dto.getStatus());
        lead.setReason(dto.getReason());
        lead.setIsSendQuotation(dto.getIsSendQuotation());
        lead.setQuatationId(dto.getQuatationId());
        lead.setAmcQuatationId(dto.getAmcQuatationId());
        lead.setModQuotId(dto.getModQuotId());
        lead.setOncallQuotId(dto.getOncallQuotId());
        lead.setExpiryDate(dto.getExpiryDate());
        lead.setMakeOfElevator(dto.getMakeOfElevator());
        lead.setNoOfElevator(dto.getNoOfElevator());
        lead.setGstPercentage(dto.getGstPercentage());
        lead.setAmountOrdinary(dto.getAmountOrdinary());
        lead.setGstOrdinary(dto.getGstOrdinary());
        lead.setTotalAmountOrdinary(dto.getTotalAmountOrdinary());
        lead.setAmountComp(dto.getAmountComp());
        lead.setGstComp(dto.getGstComp());
        lead.setTotalAmountComp(dto.getTotalAmountComp());

        // FK handling
        lead.setActivityBy(employeeRepository.findById(dto.getActivityById())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found")));

        lead.setLeadSource(leadSourceRepository.findById(dto.getLeadSourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Lead Source not found")));

        lead.setDesignation(designationRepository.findById(dto.getDesignationId())
                .orElseThrow(() -> new ResourceNotFoundException("Designation not found")));

        if (dto.getDesignation2Id() != null) {
            lead.setDesignation2(designationRepository.findById(dto.getDesignation2Id())
                    .orElseThrow(() -> new ResourceNotFoundException("Designation2 not found")));
        }

        if (dto.getLeadStageId() != null) {
            lead.setLeadStage(leadStageRepository.findById(dto.getLeadStageId())
                    .orElseThrow(() -> new ResourceNotFoundException("Lead Stage not found")));
        }

        if (dto.getContractId() != null) {
            lead.setContract(contractRepository.findById(dto.getContractId())
                    .orElseThrow(() -> new ResourceNotFoundException("Contract not found")));
        }

        if (dto.getAreaId() != null) {
            lead.setArea(areaRepository.findById(dto.getAreaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Area not found")));
        }

        return toDto(newLeadsRepository.save(lead));
    }

    public void deleteLead(Integer id) {
        try {
            newLeadsRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new ResourceNotFoundException("Cannot delete lead as it's used in other records.");
        }
    }

    // ============== DTO Converter ==============

    private NewLeadsResponseDto toDto(NewLeads e) {
        NewLeadsResponseDto dto = new NewLeadsResponseDto();

        dto.setLeadId(e.getLeadId());
        dto.setLeadDate(e.getLeadDate());
        dto.setLeadType(e.getLeadType());
        dto.setLeadCompanyName(e.getLeadCompanyName());
        dto.setSalutations(e.getSalutations());
        dto.setSalutations2(e.getSalutations2());
        dto.setCustomerName(e.getCustomerName());
        dto.setCustomerName2(e.getCustomerName2());
        dto.setEmailId(e.getEmailId());
        dto.setEmailId2(e.getEmailId2());
        dto.setCountryCode(e.getCountryCode());
        dto.setContactNo(e.getContactNo());
        dto.setCustomer1Contact(e.getCustomer1Contact());
        dto.setCustomer2Contact(e.getCustomer2Contact());
        dto.setLandlineNo(e.getLandlineNo());
        dto.setAddress(e.getAddress());
        dto.setSiteName(e.getSiteName());
        dto.setSiteAddress(e.getSiteAddress());
        dto.setStatus(e.getLeadStatus() != null ? e.getLeadStatus().getStatusName() : null);
        dto.setReason(e.getReason());
        dto.setIsSendQuotation(e.getIsSendQuotation());
        dto.setQuatationId(e.getQuatationId());
        dto.setAmcQuatationId(e.getAmcQuatationId());
        dto.setModQuotId(e.getModQuotId());
        dto.setOncallQuotId(e.getOncallQuotId());
        dto.setExpiryDate(e.getExpiryDate());
        dto.setMakeOfElevator(e.getMakeOfElevator());
        dto.setNoOfElevator(e.getNoOfElevator());
        dto.setGstPercentage(e.getGstPercentage());
        dto.setAmountOrdinary(e.getAmountOrdinary());
        dto.setGstOrdinary(e.getGstOrdinary());
        dto.setTotalAmountOrdinary(e.getTotalAmountOrdinary());
        dto.setAmountComp(e.getAmountComp());
        dto.setGstComp(e.getGstComp());
        dto.setTotalAmountComp(e.getTotalAmountComp());

        dto.setProjectStage(e.getProjectStage());

        // Set nested DTOs (with null checks)
        if (e.getActivityBy() != null) {
            EmployeeDto employeeDto = new EmployeeDto();
            employeeDto.setEmployeeId(e.getActivityBy().getEmployeeId());
            employeeDto.setEmployeeName(e.getActivityBy().getEmployeeName());
            employeeDto.setContactNumber(e.getActivityBy().getContactNumber());
            employeeDto.setEmailId(e.getActivityBy().getEmailId());
            employeeDto.setAddress(e.getActivityBy().getAddress());
            employeeDto.setDob(e.getActivityBy().getDob());
            employeeDto.setJoiningDate(e.getActivityBy().getJoiningDate());
            employeeDto.setUsername(e.getActivityBy().getUsername());
            employeeDto.setEmpPhoto(e.getActivityBy().getEmpPhoto());
            employeeDto.setActive(e.getActivityBy().getActive());
            employeeDto.setEmployeeCode(e.getActivityBy().getEmployeeCode());
            employeeDto.setEmployeeSign(e.getActivityBy().getEmployeeSign());
            employeeDto.setCreatedAt(e.getActivityBy().getCreatedAt());

            if (e.getActivityBy().getRole() != null) {
                RoleDto roleDto = new RoleDto(
                        e.getActivityBy().getRole().getRoleId(),
                        e.getActivityBy().getRole().getRole());
                employeeDto.setRole(roleDto);
            }

            dto.setActivityBy(employeeDto);
        }

        if (e.getLeadSource() != null) {
            dto.setLeadSource(new LeadSourceDto(
                    e.getLeadSource().getLeadSourceId(),
                    e.getLeadSource().getSourceName()));
        }

        if (e.getDesignation() != null) {
            dto.setDesignation(new DesignationDto(
                    e.getDesignation().getDesignationId(),
                    e.getDesignation().getDesignationName()));
        }

        if (e.getDesignation2() != null) {
            dto.setDesignation2(new DesignationDto(
                    e.getDesignation2().getDesignationId(),
                    e.getDesignation2().getDesignationName()));
        }

        if (e.getLeadStage() != null) {
            dto.setLeadStage(new LeadStageDto(
                    e.getLeadStage().getStageId(),
                    e.getLeadStage().getStageName()));
        }

        if (e.getContract() != null) {
            dto.setContract(new ContractDto(
                    e.getContract().getId(),
                    e.getContract().getName()));
        }

        if (e.getArea() != null) {
            dto.setArea(new AreaDto(
                    e.getArea().getAreaId(),
                    e.getArea().getAreaName()));
        }

        return dto;
    }

    public NewLeadsResponseDto updateLeadStage(Integer leadId, Integer stageId) {
        NewLeads lead = newLeadsRepository.findById(leadId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + leadId));

        LeadStage leadStage = leadStageRepository.findById(stageId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead Stage not found with id: " + stageId));

        lead.setLeadStage(leadStage);

        return toDto(newLeadsRepository.save(lead));
    }

    public NewLeadsResponseDto updateLeadProjectStage(Integer leadId, Integer projectStageId) {
        // Fetch the lead
        NewLeads lead = newLeadsRepository.findById(leadId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + leadId));

        // Fetch the project stage
        ProjectStage projectStage = projectStageRepository.findById(projectStageId)
                .orElseThrow(() -> new ResourceNotFoundException("Project Stage not found with id: " + projectStageId));

        // Update the project stage in the lead
        lead.setProjectStage(projectStage);

        // Save and return the updated lead as DTO
        return toDto(newLeadsRepository.save(lead));
    }

    public NewLeadsResponseDto updateLeadStatus(Integer leadId, Integer statusId) {
        NewLeads lead = newLeadsRepository.findById(leadId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + leadId));

        LeadStatus status = leadStatusRepository.findById(statusId)
                .orElseThrow(() -> new ResourceNotFoundException("Status not found with id: " + statusId));

        lead.setLeadStatus(status);
        NewLeads savedLead = newLeadsRepository.save(lead);

        return toDto(savedLead);
    }

    public List<NewLeadsResponseDto> getFilteredLeads() {
        List<String> types = Arrays.asList("New Installation", "Modernization");
        List<NewLeads> leads = newLeadsRepository.findByLeadTypeIn(types);
        System.out.println(leads);
        return leads.stream()
                .map(this::convertToDto)
                .toList();
    }

    private NewLeadsResponseDto convertToDto(NewLeads lead) {
        NewLeadsResponseDto dto = new NewLeadsResponseDto();
        dto.setLeadId(lead.getLeadId());
        dto.setLeadCompanyName(lead.getLeadCompanyName());
        dto.setLeadType(lead.getLeadType());
        return dto;
    }

}
