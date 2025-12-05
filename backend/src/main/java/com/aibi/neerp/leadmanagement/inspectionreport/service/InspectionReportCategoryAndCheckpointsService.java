package com.aibi.neerp.leadmanagement.inspectionreport.service;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aibi.neerp.exception.ResourceInUseException;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.leadmanagement.inspectionreport.dto.*;
import com.aibi.neerp.leadmanagement.inspectionreport.entity.*;
import com.aibi.neerp.leadmanagement.inspectionreport.repository.*;

@Service
public class InspectionReportCategoryAndCheckpointsService {

    @Autowired
    private InspectionReportCategoryRepository categoryRepo;

    @Autowired
    private InspectionCategoryCheckpointRepository checkpointRepo;


    /**
     * Master create/update method
     * Handles:
     *  - New category + its checkpoints
     *  - Update existing category
     *  - Update existing checkpoints
     *  - Add new checkpoints
     *  - Delete removed categories
     *  - Delete removed checkpoints
     *
     * @author
     *     Sachin Shinde
     */
    @Transactional
    public String createOrUpdateInspectionCategoriesAndHisCheckpoints(
            InspectionReportCategoryAndCheckpointsRequestDto wrapperDto) {

        try {

            List<InspectionReportCategoryAndCheckpointsDto> dtos =
                    wrapperDto.getInspectionReportCategoryAndCheckpointsDtos();

            if (dtos == null) {
                return "No data found to process";
            }
            
            // -----------------------------------------
            // DELETE Categories
            // -----------------------------------------
            deleteRemovedCategories(dtos);

            // -----------------------------------------
            // DELETE Checkpoints
            // -----------------------------------------
            for (InspectionReportCategoryAndCheckpointsDto dto : dtos) {
                deleteRemovedCheckpoints(dto);
            }

            // -----------------------------------------
            // INSERT + UPDATE
            // -----------------------------------------
            for (InspectionReportCategoryAndCheckpointsDto dto : dtos) {

                InspectionReportCategoryDto catDto = dto.getInspectionReportCategoryDto();

                if (catDto.getId() == null) {
                    addCategoryAndCheckPoints(dto); // new
                } else {
                    updateInspectionReportCategory(catDto); // update category

                    // update / insert checkpoints
                    if (dto.getInspectionCategoryCheckpointDtos() != null) {
                        for (InspectionCategoryCheckpointDto cpDto : dto.getInspectionCategoryCheckpointDtos()) {

                            if (cpDto.getId() == null) {
                                addCheckpointsForCategory(catDto, cpDto);
                            } else {
                                updateInspectionReportCategoryCheckpoint(cpDto);
                            }
                        }
                    }
                }
            }

         

            return "Successfully Created or Updated";

        } catch (Exception ex) {
            ex.printStackTrace();
            throw new RuntimeException("Failed to process categories & checkpoints: " + ex.getMessage());
        }
    }


    // --------------------------------------------------------------------
    //                      DELETE CATEGORY LOGIC
    // --------------------------------------------------------------------
    private void deleteRemovedCategories(List<InspectionReportCategoryAndCheckpointsDto> dtos) {

        Set<Integer> incomingIds = dtos.stream()
                .map(c -> c.getInspectionReportCategoryDto().getId())
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        List<InspectionReportCategory> existingCats = categoryRepo.findAll();

        for (InspectionReportCategory cat : existingCats) {
            if (!incomingIds.contains(cat.getId())) {
                deleteInspectionReportCategory(cat.getId());
            }
        }
    }


    // --------------------------------------------------------------------
    //                      DELETE CHECKPOINT LOGIC
    // --------------------------------------------------------------------
    private void deleteRemovedCheckpoints(InspectionReportCategoryAndCheckpointsDto dto) {

        Integer categoryId = dto.getInspectionReportCategoryDto().getId();
        if (categoryId == null) return;

        Set<Integer> incomingCPIds = dto.getInspectionCategoryCheckpointDtos().stream()
                .map(InspectionCategoryCheckpointDto::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        List<InspectionCategoryCheckpoint> existingCP =
                checkpointRepo.findByCategoryId(categoryId);

        for (InspectionCategoryCheckpoint cp : existingCP) {
            if (!incomingCPIds.contains(cp.getId())) {
                deleteInspectionReportCategoryCheckpoint(cp.getId());
            }
        }
    }


    // --------------------------------------------------------------------
    //                        ADD CATEGORY + CHECKPOINTS
    // --------------------------------------------------------------------
    public void addCategoryAndCheckPoints(InspectionReportCategoryAndCheckpointsDto dto) {

        InspectionReportCategoryDto categoryDto = dto.getInspectionReportCategoryDto();
        List<InspectionCategoryCheckpointDto> checkpointsDto = dto.getInspectionCategoryCheckpointDtos();

        InspectionReportCategory newCat = InspectionReportCategory.builder()
                .categoryName(categoryDto.getCategoryName())
                .build();

        InspectionReportCategory newCat2 = categoryRepo.save(newCat);

        List<InspectionCategoryCheckpoint> checkpoints = checkpointsDto.stream()
                .map(cp -> InspectionCategoryCheckpoint.builder()
                        .category(newCat2)
                        .checkpointName(cp.getCheckpointName())
                        .build())
                .toList();

        checkpointRepo.saveAll(checkpoints);
    }


    // --------------------------------------------------------------------
    //                      ADD SINGLE CHECKPOINT
    // --------------------------------------------------------------------
    public void addCheckpointsForCategory(InspectionReportCategoryDto catDto,
                                          InspectionCategoryCheckpointDto cpDto) {

        InspectionReportCategory category = categoryRepo.findById(catDto.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with ID: " + catDto.getId()
                ));

        InspectionCategoryCheckpoint cp = InspectionCategoryCheckpoint.builder()
                .category(category)
                .checkpointName(cpDto.getCheckpointName())
                .build();

        checkpointRepo.save(cp);
    }


    // --------------------------------------------------------------------
    //                      UPDATE CATEGORY
    // --------------------------------------------------------------------
    public void updateInspectionReportCategory(InspectionReportCategoryDto dto) {

        InspectionReportCategory cat = categoryRepo.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with ID: " + dto.getId()));

        cat.setCategoryName(dto.getCategoryName());

        categoryRepo.save(cat);
    }


    // --------------------------------------------------------------------
    //                      UPDATE CHECKPOINT
    // --------------------------------------------------------------------
    public void updateInspectionReportCategoryCheckpoint(InspectionCategoryCheckpointDto dto) {

        InspectionCategoryCheckpoint cp = checkpointRepo.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Checkpoint not found with ID: " + dto.getId()));

        cp.setCheckpointName(dto.getCheckpointName());

        checkpointRepo.save(cp);
    }


    // --------------------------------------------------------------------
    //                      DELETE CATEGORY + CHECKPOINTS
    // --------------------------------------------------------------------
    public void deleteInspectionReportCategory(Integer categoryId) {

        try {
            List<InspectionCategoryCheckpoint> cps = checkpointRepo.findByCategoryId(categoryId);
            checkpointRepo.deleteAll(cps);

            categoryRepo.deleteById(categoryId);

        } catch (DataIntegrityViolationException ex) {
            throw new ResourceInUseException(
                    "Cannot delete category ID " + categoryId + " because it is referenced elsewhere.");
        }
    }


    // --------------------------------------------------------------------
    //                      DELETE CHECKPOINT
    // --------------------------------------------------------------------
    public void deleteInspectionReportCategoryCheckpoint(Integer checkpointId) {

        try {
            checkpointRepo.deleteById(checkpointId);

        } catch (DataIntegrityViolationException ex) {
            throw new ResourceInUseException(
                    "Cannot delete checkpoint ID " + checkpointId + " because it is referenced elsewhere.");
        }
    }
    
    
    public List<InspectionReportCategoryAndCheckpointsDto> inspectionReportCategoryAndCheckpointsDtos() {
    	
    	
    	List<InspectionReportCategoryAndCheckpointsDto> andCheckpointsDtos = 
    			new ArrayList<InspectionReportCategoryAndCheckpointsDto>();

    	 
    	 List<InspectionReportCategory> categories = categoryRepo.findAll();
    	 
    	 for(InspectionReportCategory category : categories) {
    		 
    		 InspectionReportCategoryAndCheckpointsDto andCheckpointsDto =
    				 new InspectionReportCategoryAndCheckpointsDto();
    		 
    		 InspectionReportCategoryDto inspectionReportCategoryDto = new InspectionReportCategoryDto().builder()
    				 .categoryName(category.getCategoryName())
    				 .id(category.getId())
    				 .build();
    	    	
        	 List<InspectionCategoryCheckpointDto> inspectionCategoryCheckpointDtos = 
        			 new ArrayList<InspectionCategoryCheckpointDto>();
        	 
        	 List<InspectionCategoryCheckpoint> categoryCheckpoints = checkpointRepo.findByCategory(category);
        	 
        	 for(InspectionCategoryCheckpoint categoryCheckpoint : categoryCheckpoints) {
        		 
        		 InspectionCategoryCheckpointDto inspectionCategoryCheckpointDto = 
        				 new InspectionCategoryCheckpointDto();
        		 
        		 inspectionCategoryCheckpointDto.setCategoryId(category.getId());
        		 inspectionCategoryCheckpointDto.setCategoryName(category.getCategoryName());
        		 inspectionCategoryCheckpointDto.setCheckpointName(categoryCheckpoint.getCheckpointName());
        		 inspectionCategoryCheckpointDto.setId(categoryCheckpoint.getId());
        		 
        		 inspectionCategoryCheckpointDtos.add(inspectionCategoryCheckpointDto);
        	 }
    		 
        	 andCheckpointsDto.setInspectionCategoryCheckpointDtos(inspectionCategoryCheckpointDtos);
        	 andCheckpointsDto.setInspectionReportCategoryDto(inspectionReportCategoryDto);
    		 
    		 andCheckpointsDtos.add(andCheckpointsDto);
    	 }
    	
    	 
    	 return andCheckpointsDtos;
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

}
