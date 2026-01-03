package com.aibi.neerp.leadmanagement.inspectionreport.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aibi.neerp.amc.jobs.initial.dto.LiftData;
import com.aibi.neerp.amc.jobs.initial.service.AmcJobActivityService;
import com.aibi.neerp.amc.jobs.initial.service.AmcJobsService;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.Enquiry;
import com.aibi.neerp.leadmanagement.inspectionreport.dto.InspectionReportAndRepeatLiftsWrapperDto;
import com.aibi.neerp.leadmanagement.inspectionreport.dto.InspectionReportDto;
import com.aibi.neerp.leadmanagement.inspectionreport.dto.InspectionReportForAddLiftsDatas;
import com.aibi.neerp.leadmanagement.inspectionreport.dto.InspectionReportRepeatLiftDto;
import com.aibi.neerp.leadmanagement.inspectionreport.dto.InspectionReportRequestDto;
import com.aibi.neerp.leadmanagement.inspectionreport.dto.InspectionReportViewAndPdfData;
import com.aibi.neerp.leadmanagement.inspectionreport.entity.InspectionCategoryCheckpoint;
import com.aibi.neerp.leadmanagement.inspectionreport.entity.InspectionCheckpointStatus;
import com.aibi.neerp.leadmanagement.inspectionreport.entity.InspectionReport;
import com.aibi.neerp.leadmanagement.inspectionreport.entity.InspectionReportRepeatLift;
import com.aibi.neerp.leadmanagement.inspectionreport.entity.InspectionReports;
import com.aibi.neerp.leadmanagement.inspectionreport.repository.InspectionCategoryCheckpointRepository;
import com.aibi.neerp.leadmanagement.inspectionreport.repository.InspectionCheckpointStatusRepository;
import com.aibi.neerp.leadmanagement.inspectionreport.repository.InspectionReportCategoryRepository;
import com.aibi.neerp.leadmanagement.inspectionreport.repository.InspectionReportRepeatLiftRepository;
import com.aibi.neerp.leadmanagement.inspectionreport.repository.InspectionReportRepository;
import com.aibi.neerp.leadmanagement.inspectionreport.repository.InspectionReportsRepository;
import com.aibi.neerp.leadmanagement.repository.CombinedEnquiryRepository;
import com.aibi.neerp.leadmanagement.repository.EnquiryRepository;

@Service
public class InspectionReportService {
	
    @Autowired
    private InspectionReportRepository inspectionReportRepository;
	 
    @Autowired
    private InspectionCategoryCheckpointRepository inspectionCategoryCheckpointRepository;
	 
    @Autowired
    private InspectionReportCategoryRepository inspectionReportCategoryRepository;
	 
    @Autowired 
    private InspectionCheckpointStatusRepository inspectionCheckpointStatusRepository;
	 
    @Autowired
    private InspectionReportRepeatLiftRepository inspectionReportRepeatLiftRepository;
	 
    @Autowired
    private InspectionReportsRepository inspectionReportsRepository;
	 
    @Autowired 
    private CombinedEnquiryRepository combinedEnquiryRepository;
	 
    @Autowired
    private EnquiryRepository enquiryRepository;
    
    @Autowired
    private AmcJobsService amcJobsService;
	 
    /**
     * Creates or updates an inspection report with repeat lifts
     * 
     * @param inspectionReportId ID of existing report (null for new report)
     * @param combinedEnqId Combined enquiry ID
     * @param inspectionReportRequestDto Request DTO containing report data
     * @return Success status message
     * @throws IllegalArgumentException if required data is missing
     */
    @Transactional
    public String createOrUpdateInspectionReport(Integer inspectionReportId, Integer combinedEnqId,
            InspectionReportRequestDto inspectionReportRequestDto) {
		 
        // Validate input
        if (inspectionReportRequestDto == null || 
            inspectionReportRequestDto.getInspectionReportAndRepeatLiftsWrapperDtos() == null ||
            inspectionReportRequestDto.getInspectionReportAndRepeatLiftsWrapperDtos().isEmpty()) {
            throw new IllegalArgumentException("Inspection report data cannot be null or empty");
        }
		 
        List<InspectionReportAndRepeatLiftsWrapperDto> inspectionReportAndRepeatLiftsWrapperDtos = 
                inspectionReportRequestDto.getInspectionReportAndRepeatLiftsWrapperDtos();
		 
        if (inspectionReportId == null) {
            // CREATE mode: combinedEnqId is required
            if (combinedEnqId == null) {
                throw new IllegalArgumentException("Combined enquiry ID cannot be null for creating new reports");
            }
            return createNewInspectionReport(combinedEnqId, inspectionReportAndRepeatLiftsWrapperDtos);
        } else {
            // EDIT mode: combinedEnqId is not required
            return updateExistingInspectionReport(inspectionReportId, inspectionReportAndRepeatLiftsWrapperDtos);
        }
    }
	 
    /**
     * Creates a new inspection report
     */
    private String createNewInspectionReport(Integer combinedEnqId, 
            List<InspectionReportAndRepeatLiftsWrapperDto> inspectionReportAndRepeatLiftsWrapperDtos) {
        
        // Create new inspection reports entry
        InspectionReports inspectionReports = createInspectionReportsEntry(combinedEnqId);
		 
        // Create repeat lift entries and their checkpoints
        createRepeatLiftsWithCheckpoints(inspectionReports, inspectionReportAndRepeatLiftsWrapperDtos);
		 
        // Update repeat lift references
        updateRepeatLiftReferences(inspectionReports.getId(), inspectionReportAndRepeatLiftsWrapperDtos);
		 
        return "Successfully Inspection Report Added";
    }
	 
    /**
     * Updates an existing inspection report
     */
    private String updateExistingInspectionReport(Integer inspectionReportId,
            List<InspectionReportAndRepeatLiftsWrapperDto> inspectionReportAndRepeatLiftsWrapperDtos) {
        
        InspectionReports inspectionReports = inspectionReportsRepository.findById(inspectionReportId)
                .orElseThrow(() -> new IllegalArgumentException("Inspection report not found with ID: " + inspectionReportId));
		 
        for (InspectionReportAndRepeatLiftsWrapperDto wrapperDto : inspectionReportAndRepeatLiftsWrapperDtos) {
            updateRepeatLiftAndCheckpoints(wrapperDto);
        }
		 
        return "Successfully Inspection Report Updated";
    }
	 
    /**
     * Creates InspectionReports entry with proper edition numbering
     */
    private InspectionReports createInspectionReportsEntry(Integer combinedEnqId) {
        List<InspectionReports> existingReports = 
                inspectionReportsRepository.findByCombinedEnquiry_Id(combinedEnqId);
        
        int reportCount = existingReports.size() + 1;
        String reportEdition = reportCount + " Edition";
		 
        CombinedEnquiry combinedEnquiry = combinedEnquiryRepository.findById(combinedEnqId)
                .orElseThrow(() -> new IllegalArgumentException("Combined enquiry not found with ID: " + combinedEnqId));
		 
        InspectionReports inspectionReports = new InspectionReports();
        inspectionReports.setCombinedEnquiry(combinedEnquiry);
        inspectionReports.setReportEdition(reportEdition);
		 
        return inspectionReportsRepository.save(inspectionReports);
    }
	 
    /**
     * Creates repeat lifts and their checkpoints
     */
    private void createRepeatLiftsWithCheckpoints(InspectionReports inspectionReports,
            List<InspectionReportAndRepeatLiftsWrapperDto> wrapperDtos) {
        
        for (InspectionReportAndRepeatLiftsWrapperDto wrapperDto : wrapperDtos) {
            InspectionReportRepeatLiftDto repeatLiftDto = wrapperDto.getInspectionReportRepeatLiftDto();
            
            if (repeatLiftDto == null || repeatLiftDto.getEnquiryId() == null) {
                continue; // Skip invalid entries
            }
            
            Enquiry enquiry = enquiryRepository.findById(repeatLiftDto.getEnquiryId())
                    .orElseThrow(() -> new IllegalArgumentException("Enquiry not found with ID: " + repeatLiftDto.getEnquiryId()));
			 
            InspectionReportRepeatLift repeatLift = InspectionReportRepeatLift.builder()
                    .enquiry(enquiry)
                    .inspectionReports(inspectionReports)
                    .repeatLift(null)
                    .build();
			 
            InspectionReportRepeatLift savedRepeatLift = inspectionReportRepeatLiftRepository.save(repeatLift);
			 
            // Create checkpoints for this repeat lift
            createCheckpoints(savedRepeatLift, wrapperDto.getInspectionReportDtos());
        }
    }
	 
    /**
     * Creates inspection report checkpoints
     */
    private void createCheckpoints(InspectionReportRepeatLift repeatLift, 
            List<InspectionReportDto> inspectionReportDtos) {
        
        if (inspectionReportDtos == null || inspectionReportDtos.isEmpty()) {
            return;
        }
		 
        for (InspectionReportDto reportDto : inspectionReportDtos) {
            if (reportDto.getCheckpointId() == null || reportDto.getStatusId() == null) {
                continue; // Skip invalid entries
            }
            
            InspectionCategoryCheckpoint checkpoint = inspectionCategoryCheckpointRepository
                    .findById(reportDto.getCheckpointId())
                    .orElseThrow(() -> new IllegalArgumentException("Checkpoint not found with ID: " + reportDto.getCheckpointId()));
			 
            InspectionCheckpointStatus status = inspectionCheckpointStatusRepository
                    .findById(reportDto.getStatusId())
                    .orElseThrow(() -> new IllegalArgumentException("Status not found with ID: " + reportDto.getStatusId()));
			 
            InspectionReport inspectionReport = InspectionReport.builder()
                    .checkpoint(checkpoint)
                    .status(status)
                    .repeatLift(repeatLift)
                    .remark(reportDto.getRemark())
                    .build();
			 
            inspectionReportRepository.save(inspectionReport);
        }
    }
	 
    /**
     * Updates repeat lift references to link lifts together
     */
    private void updateRepeatLiftReferences(Integer inspectionReportsId,
            List<InspectionReportAndRepeatLiftsWrapperDto> wrapperDtos) {
        
        List<InspectionReportRepeatLift> repeatLifts = 
                inspectionReportRepeatLiftRepository.findByInspectionReports_Id(inspectionReportsId);
		 
        // Create lookup maps
        Map<Integer, InspectionReportRepeatLift> enquiryIdToRepeatLiftMap = new HashMap<>();
        for (InspectionReportRepeatLift repeatLift : repeatLifts) {
            enquiryIdToRepeatLiftMap.put(repeatLift.getEnquiry().getEnquiryId(), repeatLift);
        }
		 
        Map<Integer, Integer> enquiryToRepeatEnquiryMap = new HashMap<>();
        for (InspectionReportAndRepeatLiftsWrapperDto wrapperDto : wrapperDtos) {
            InspectionReportRepeatLiftDto repeatLiftDto = wrapperDto.getInspectionReportRepeatLiftDto();
            if (repeatLiftDto != null && repeatLiftDto.getEnquiryId() != null) {
                enquiryToRepeatEnquiryMap.put(repeatLiftDto.getEnquiryId(), repeatLiftDto.getRepeatLiftId());
            }
        }
		 
        // Update repeat lift references
        for (InspectionReportRepeatLift repeatLift : repeatLifts) {
            Integer enquiryId = repeatLift.getEnquiry().getEnquiryId();
            Integer repeatEnquiryId = enquiryToRepeatEnquiryMap.get(enquiryId);
            
            if (repeatEnquiryId != null) {
                InspectionReportRepeatLift referenceRepeatLift = enquiryIdToRepeatLiftMap.get(repeatEnquiryId);
                if (referenceRepeatLift != null) {
                    repeatLift.setRepeatLift(referenceRepeatLift);
                    inspectionReportRepeatLiftRepository.save(repeatLift);
                }
            }
        }
    }
	 
    /**
     * Updates repeat lift and its checkpoints
     */
    private void updateRepeatLiftAndCheckpoints(InspectionReportAndRepeatLiftsWrapperDto wrapperDto) {
        InspectionReportRepeatLiftDto repeatLiftDto = wrapperDto.getInspectionReportRepeatLiftDto();
        
        if (repeatLiftDto == null || repeatLiftDto.getId() == null) {
            return;
        }
        
        InspectionReportRepeatLift repeatLift = inspectionReportRepeatLiftRepository
                .findById(repeatLiftDto.getId())
                .orElseThrow(() -> new IllegalArgumentException("Repeat lift not found with ID: " + repeatLiftDto.getId()));
		 
        // Update repeat lift reference if provided
        if (repeatLiftDto.getRepeatLiftId() != null) {
            InspectionReportRepeatLift referenceRepeatLift = inspectionReportRepeatLiftRepository
                    .findById(repeatLiftDto.getRepeatLiftId())
                    .orElseThrow(() -> new IllegalArgumentException("Reference repeat lift not found with ID: " + repeatLiftDto.getRepeatLiftId()));
            
            repeatLift.setRepeatLift(referenceRepeatLift);
            inspectionReportRepeatLiftRepository.save(repeatLift);
        }
		 
        // Update checkpoints
        updateCheckpoints(wrapperDto.getInspectionReportDtos());
    }
	 
    /**
     * Updates existing checkpoints
     */
    private void updateCheckpoints(List<InspectionReportDto> inspectionReportDtos) {
        if (inspectionReportDtos == null || inspectionReportDtos.isEmpty()) {
            return;
        }
		 
        for (InspectionReportDto reportDto : inspectionReportDtos) {
            if (reportDto.getId() == null || reportDto.getStatusId() == null) {
                continue; // Skip invalid entries
            }
            
            InspectionReport inspectionReport = inspectionReportRepository
                    .findById(reportDto.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Inspection report not found with ID: " + reportDto.getId()));
			 
            InspectionCheckpointStatus status = inspectionCheckpointStatusRepository
                    .findById(reportDto.getStatusId())
                    .orElseThrow(() -> new IllegalArgumentException("Status not found with ID: " + reportDto.getStatusId()));
			 
            inspectionReport.setStatus(status);
            inspectionReport.setRemark(reportDto.getRemark());
			 
            inspectionReportRepository.save(inspectionReport);
        }
    }
    
    
    public List<InspectionReportAndRepeatLiftsWrapperDto> getInspectionReportEditData(Integer inspectionReportsId) {

//        InspectionReports inspectionReports = inspectionReportsRepository
//                .findById(inspectionReportsId)
//                .orElse(null);

        List<InspectionReportAndRepeatLiftsWrapperDto> wrapperList = new ArrayList<>();

        List<InspectionReportRepeatLift> repeatLifts =
                inspectionReportRepeatLiftRepository.findByInspectionReports_Id(inspectionReportsId);

        if (repeatLifts == null || repeatLifts.isEmpty()) {
            return wrapperList;
        }

        for (InspectionReportRepeatLift repeatLift : repeatLifts) {

        
            Integer referId = null;
            		
            if(repeatLift.getRepeatLift()!=null)
            	referId =	repeatLift.getRepeatLift().getId();  // Database ID for edit mode

            // ------------------------------------------------
            // 2. BUILD RepeatLift DTO
            // ------------------------------------------------
            InspectionReportRepeatLiftDto repeatLiftDto = InspectionReportRepeatLiftDto.builder()
                    .id(repeatLift.getId())
                    .inspectionReportsId(
                            repeatLift.getInspectionReports() != null ?
                            repeatLift.getInspectionReports().getId() : null
                    )
                    .repeatLiftId(referId)
                    .enquiryId(
                            repeatLift.getEnquiry() != null ?
                            repeatLift.getEnquiry().getEnquiryId() : null
                    )
                    .build();

            // ------------------------------------------------
            // 3. Fetch InspectionReport for this repeatLiftId
            // ------------------------------------------------
            List<InspectionReport> inspectionReports =
                    inspectionReportRepository.findByRepeatLift_Id(repeatLift.getId());

            List<InspectionReportDto> inspectionReportDtos = inspectionReports.stream()
                    .map(report -> InspectionReportDto.builder()
                            .id(report.getId())
                            .checkpointId(report.getCheckpoint().getId())
                            .statusId(report.getStatus().getId())
                            .remark(report.getRemark())
                            .repeatLiftId(report.getRepeatLift().getId())
                            .build())
                    .collect(Collectors.toList());

            // ------------------------------------------------
            // 4. ADD TO WRAPPER LIST
            // ------------------------------------------------
            InspectionReportAndRepeatLiftsWrapperDto wrapper = new InspectionReportAndRepeatLiftsWrapperDto();
            wrapper.setInspectionReportRepeatLiftDto(repeatLiftDto);
            wrapper.setInspectionReportDtos(inspectionReportDtos);

            wrapperList.add(wrapper);  // <--- You forgot this earlier!
        }

        return wrapperList;
    }

    
   public InspectionReportForAddLiftsDatas getInspectionReportForAddLiftsDatas(Integer combinedEnqid) {
	   
	   InspectionReportForAddLiftsDatas inspectionReportForAddLiftsDatas = 
			   new InspectionReportForAddLiftsDatas();
	   
	   CombinedEnquiry combinedEnquiry = combinedEnquiryRepository.findById(combinedEnqid).get();
	   
	   List<LiftData> liftDatas = amcJobsService.buildLiftData(combinedEnquiry);

	   inspectionReportForAddLiftsDatas.setLiftDatas(liftDatas);
	   
	   return inspectionReportForAddLiftsDatas;
	   
   }
    
    
    
    /**
     * Get list of all inspection reports for a combined enquiry
     * 
     * @param combinedEnquiryId ID of the combined enquiry
     * @return List of maps containing id and reportEdition
     */
    public List<Map<String, Object>> getInspectionReportsList(Integer combinedEnquiryId) {
        List<InspectionReports> reports = inspectionReportsRepository.findByCombinedEnquiry_Id(combinedEnquiryId);
        
        return reports.stream()
            .map(report -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", report.getId());
                map.put("reportEdition", report.getReportEdition());
                return map;
            })
            .collect(Collectors.toList());
    }
    
    
    
    public List<InspectionReportViewAndPdfData> getInspectionReportViewAndPdfDataByReportId(
            Integer reportId) {

        // Validate report exists
        inspectionReportsRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Inspection Report not found"));

        List<InspectionReportViewAndPdfData> responseList = new ArrayList<>();

        List<InspectionReportRepeatLift> repeatLifts =
                inspectionReportRepeatLiftRepository.findByInspectionReports_Id(reportId);

        for (InspectionReportRepeatLift repeatLift : repeatLifts) {

            String liftName = repeatLift.getEnquiry().getLiftName();

            List<InspectionReport> inspectionReports =
                    inspectionReportRepository.findByRepeatLift_Id(repeatLift.getId());

            for (InspectionReport report : inspectionReports) {

                InspectionCategoryCheckpoint categoryCheckpoint =
                        inspectionCategoryCheckpointRepository
                                .findById(report.getCheckpoint().getId())
                                .orElseThrow(() -> new RuntimeException("Checkpoint not found"));

                InspectionReportViewAndPdfData dto =
                        new InspectionReportViewAndPdfData();

                dto.setCategoryName(
                        categoryCheckpoint.getCategory().getCategoryName());
                dto.setCheckPointName(
                        report.getCheckpoint().getCheckpointName());
                dto.setCheckPointStatus(
                        report.getStatus().getStatusName());
                dto.setRemark(report.getRemark());
                dto.setLiftname(liftName);

                responseList.add(dto);
            }
        }

        return responseList;
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}