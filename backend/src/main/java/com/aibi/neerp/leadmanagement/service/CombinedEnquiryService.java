package com.aibi.neerp.leadmanagement.service;

import com.aibi.neerp.exception.ResourceInUseException;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.leadmanagement.dto.CombinedEnquiryResponseDto;
import com.aibi.neerp.leadmanagement.dto.EnquiryGroupByTypeResponseDto;
import com.aibi.neerp.leadmanagement.dto.EnquiryRequestDto;
import com.aibi.neerp.leadmanagement.dto.EnquiryResponseDto;
import com.aibi.neerp.leadmanagement.dto.EnquiryTypeResponseDto;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.Enquiry;
import com.aibi.neerp.leadmanagement.entity.EnquiryType;
import com.aibi.neerp.leadmanagement.entity.NewLeads;
import com.aibi.neerp.leadmanagement.repository.CombinedEnquiryRepository;
import com.aibi.neerp.leadmanagement.repository.EnquiryRepository;
import com.aibi.neerp.leadmanagement.repository.EnquiryTypeRepository;
import com.aibi.neerp.leadmanagement.repository.NewLeadsRepository;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CombinedEnquiryService {

    @Autowired
    private CombinedEnquiryRepository combinedEnquiryRepository;

    @Autowired
    private NewLeadsRepository newLeadsRepository;
    @Autowired
    private EnquiryTypeRepository enquiryTypeRepository;
    
    @Autowired
    private EnquiryService enquiryService;
    
    @Autowired
    private EnquiryRepository enquiryRepository;

    public CombinedEnquiry getOrCreateCombinedEnquiry(Integer leadId) {
        NewLeads lead = newLeadsRepository.findById(leadId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with ID: " + leadId));

        return combinedEnquiryRepository.findByLead(lead)
                .orElseGet(() -> {
                    CombinedEnquiry newCombined = new CombinedEnquiry();
                    newCombined.setLead(lead);
                    return combinedEnquiryRepository.save(newCombined);
                });
    }
    
//    public java.util.List<EnquiryGroupByTypeResponseDto> groupByTypeResponseDto() {
//    	
//    	java.util.List<EnquiryGroupByTypeResponseDto> enquiryGroupByTypeResponseDtos = 
//    			new ArrayList<>();
//    	
//    	HashMap<String, EnquiryGroupByTypeResponseDto> hashMap = new HashMap<String, EnquiryGroupByTypeResponseDto>();
//        HashSet<String> hashMap2 = new HashSet<String>();
//    	java.util.List<CombinedEnquiry> combinedEnquiries = combinedEnquiryRepository.findAll();
//        
//        for(CombinedEnquiry combinedEnquiry : combinedEnquiries) {
//        	
//        	EnquiryType enquiryType = combinedEnquiry.getEnquiryType();
//        	hashMap2.add(enquiryType.getEnquiryTypeName());
//        	
//        	EnquiryTypeResponseDto enquiryTypeResponseDto = enquiryService.toDto(enquiryType);
//        	String enquiryTypeName = combinedEnquiry.getEnquiryType().getEnquiryTypeName();
//        	
//        	if(hashMap.get(enquiryTypeName)==null) {
//        		
//        		EnquiryGroupByTypeResponseDto byTypeResponseDto = new EnquiryGroupByTypeResponseDto();
//        		byTypeResponseDto.setEnquiryType(enquiryTypeResponseDto);
//        		
//        		java.util.List<CombinedEnquiryResponseDto> combinedEnquiryResponseDtos = 
//        				new ArrayList<CombinedEnquiryResponseDto>();
//        		
//        		CombinedEnquiryResponseDto combinedEnquiryResponseDto = 
//        				enquiryService.toCombinedEnquiryDto(combinedEnquiry);
//        		combinedEnquiryResponseDtos.add(combinedEnquiryResponseDto);
//        		
//        		byTypeResponseDto.setEnquiries(combinedEnquiryResponseDtos);
//        		
//        		hashMap.put(enquiryTypeName, byTypeResponseDto);
//        		
//        	}else {
//        		
//        		EnquiryGroupByTypeResponseDto byTypeResponseDto = hashMap.get(enquiryTypeName);
//        		java.util.List<CombinedEnquiryResponseDto> combinedEnquiryResponseDtos = 
//        				byTypeResponseDto.getEnquiries();
//        		
//        		CombinedEnquiryResponseDto combinedEnquiryResponseDto = 
//        				enquiryService.toCombinedEnquiryDto(combinedEnquiry);
//        		combinedEnquiryResponseDtos.add(combinedEnquiryResponseDto);
//        		
//        	}
//        }
//        
//        for(String str : hashMap2) {
//        	
//        	EnquiryGroupByTypeResponseDto byTypeResponseDto = hashMap.get(str);
//        	enquiryGroupByTypeResponseDtos.add(byTypeResponseDto);
//        	
//        }
//    	
//    	
//    	return enquiryGroupByTypeResponseDtos;
//    	
//    }
    
    public List<EnquiryGroupByTypeResponseDto> groupByTypeResponseDto(Integer leadId) {
        List<CombinedEnquiry> combinedEnquiries = combinedEnquiryRepository.findByLead_LeadId(leadId);

        if (combinedEnquiries.isEmpty()) {
            throw new ResourceNotFoundException("No combined enquiries found");
        }

        Map<String, EnquiryGroupByTypeResponseDto> groupedMap = new HashMap<>();

        for (CombinedEnquiry combinedEnquiry : combinedEnquiries) {
            EnquiryType enquiryType = combinedEnquiry.getEnquiryType();
            String typeName = enquiryType.getEnquiryTypeName();

            EnquiryGroupByTypeResponseDto groupDto = groupedMap.get(typeName);

            if (groupDto == null) {
                groupDto = new EnquiryGroupByTypeResponseDto();
                groupDto.setEnquiryType(enquiryService.toDto(enquiryType));
                groupDto.setEnquiries(new ArrayList<>());
                groupedMap.put(typeName, groupDto);
            }

            CombinedEnquiryResponseDto enquiryDto = enquiryService.toCombinedEnquiryDto(combinedEnquiry);
            groupDto.getEnquiries().add(enquiryDto);
        }

        return new ArrayList<>(groupedMap.values());
    }

    @Transactional
    public void createCombinedEnquiries(Integer leadId, List<EnquiryRequestDto> dtos,
            String projectName, Integer enquiryTypeId , LocalDate enquiryDate) {

			CombinedEnquiry newCombined = new CombinedEnquiry();
			
			newCombined.setCreatedDate(enquiryDate);			
			NewLeads lead = newLeadsRepository.findById(leadId)
			.orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + leadId));
			newCombined.setLead(lead);
			newCombined.setProjectName(projectName);
			
			EnquiryType enquiryType = enquiryTypeRepository.findById(enquiryTypeId)
			.orElseThrow(() -> new ResourceNotFoundException("EnquiryType not found with id: " + enquiryTypeId));
			newCombined.setEnquiryType(enquiryType);
			
			
			newCombined = combinedEnquiryRepository.save(newCombined);
			
			List<Enquiry> enquiries = new ArrayList<>();
			
			System.out.println("enq added successfully");

			
			for (EnquiryRequestDto dto : dtos) {
			Enquiry enquiry = enquiryService.toEntity(dto);
			enquiry.setCombinedEnquiry(newCombined); 
			enquiries.add(enquiry);
			}
			
			
			enquiryRepository.saveAll(enquiries);
			
			newCombined.setEnquiries(enquiries);  
			combinedEnquiryRepository.save(newCombined); 
}

//	public void updateCombinedEnquiries(Integer combinedEnqId, Integer leadId, List<EnquiryRequestDto> enquiryDtos,
//			String projectName, Integer enquiryTypeId) {
//		// TODO Auto-generated method stub
//		
//		LinkedHashMap<Integer, EnquiryRequestDto> modifyEnqIdsInHash = new LinkedHashMap<>();
//		
//		if(enquiryDtos!=null && enquiryDtos.size()>0) {
//			
//			for(EnquiryRequestDto dto : enquiryDtos) {
//				modifyEnqIdsInHash.put(dto.getEnquiryId(),dto);
//			}
//		}
//		
//		CombinedEnquiry combinedEnquiry = combinedEnquiryRepository.findById(combinedEnqId).get();
//		List<Enquiry> existingEnquiries = combinedEnquiry.getEnquiries();
//		
//		// here i am deleteing from db
//		// here i am updating existing db rows
//
//		
//		if(existingEnquiries!=null && existingEnquiries.size()>0) {
//			
//			for(Enquiry enquiry : existingEnquiries) {
//				
//				if(modifyEnqIdsInHash.get(enquiry.getEnquiryId())==null) {
//					
//					// here i am deleteing from db
//					enquiryRepository.delete(enquiry);
//					
//				}else if(modifyEnqIdsInHash.get(enquiry.getEnquiryId())!=null) {
//					
//					// here i am updating existing db rows
//					EnquiryRequestDto enquiryRequestDtoModified = modifyEnqIdsInHash.get(enquiry.getEnquiryId());
//					
//					Enquiry enquiry2 = enquiryService.toEntity(enquiryRequestDtoModified);
//					enquiryRepository.save(enquiry2);
//					
//				}
//				modifyEnqIdsInHash.remove(enquiry.getEnquiryId());
//			}
//		}
//		// here adding new added entryies 
//		
//		if(modifyEnqIdsInHash!=null && modifyEnqIdsInHash.size()>0) {
//			
//			for(Map.Entry<Integer, EnquiryRequestDto> entry : modifyEnqIdsInHash.entrySet()) {
//				
//				EnquiryRequestDto dto = entry.getValue();
//				Enquiry enquiry = enquiryService.toEntity(dto);
//				enquiry.setCombinedEnquiry(combinedEnquiry);
//				
//				enquiryRepository.save(enquiry);
//				
//			}
//		}
//		
//		
//	}
    
    @Transactional
    public void updateCombinedEnquiries(Integer combinedEnqId, Integer leadId, List<EnquiryRequestDto> enquiryDtos,
            String projectName, Integer enquiryTypeId,LocalDate enquiryDate) {
			try {
				// Use LinkedHashMap to maintain insertion order
				LinkedHashMap<Integer, EnquiryRequestDto> modifyEnqIdsInHash = new LinkedHashMap<>();
				
				List<EnquiryRequestDto> newEnqAdded = new ArrayList<>();
				
				if (enquiryDtos != null && !enquiryDtos.isEmpty()) {
					for (EnquiryRequestDto dto : enquiryDtos) {
					 modifyEnqIdsInHash.put(dto.getEnquiryId(), dto);
					 
					 if(dto.getEnquiryId()==null || (dto.getEnquiryId()!=null && dto.getEnquiryId()==0)) {
						 newEnqAdded.add(dto);
					  }
					}
				}
				System.out.println("255");
				System.out.println(modifyEnqIdsInHash);
				
				Optional<CombinedEnquiry> combinedEnquiryOpt = combinedEnquiryRepository.findById(combinedEnqId);
				if (!combinedEnquiryOpt.isPresent()) {
				 throw new RuntimeException("CombinedEnquiry with ID " + combinedEnqId + " not found.");
				}
				
				
				CombinedEnquiry combinedEnquiry = combinedEnquiryOpt.get();
				combinedEnquiry.setCreatedDate(enquiryDate);
				List<Enquiry> existingEnquiries = combinedEnquiry.getEnquiries();
				
				System.out.println(existingEnquiries.size());
				
				List<Integer> deletedIds = new ArrayList<Integer>();
				
				if (existingEnquiries != null && !existingEnquiries.isEmpty()) {
					for (Enquiry enquiry : existingEnquiries) {
						Integer enquiryId = enquiry.getEnquiryId();
						System.out.println(enquiryId+" enq id from existing ");
						EnquiryRequestDto matchedDto = modifyEnqIdsInHash.get(enquiryId);
						
						if (matchedDto == null) {
						// Entry removed in new list → delete from DB
							System.out.println("delete enq id "+enquiryId);
							//combinedEnquiry.getEnquiries().remove(enquiry); // 🔁 This is key

						  // enquiryRepository.deleteById(enquiryId);
							deletedIds.add(enquiryId);
							System.out.println("deleeting successsfully");
						} else {
						// Entry exists → update
							
						Enquiry updatedEnquiry = enquiryService.toEntity(matchedDto);
						System.out.println("278");
						updatedEnquiry.setEnquiryId(enquiryId); // Preserving ID
						updatedEnquiry.setCombinedEnquiry(combinedEnquiry);
						
						enquiryRepository.save(updatedEnquiry);
						}
						
						// Remove processed ID
						//modifyEnqIdsInHash.remove(enquiryId);
					}
				}
				System.out.println("288"+modifyEnqIdsInHash);
				
				if(deletedIds.size()>0) {
					for(Integer id : deletedIds) {
						enquiryRepository.deleteByEnquiryId(id);
					}
				}
				// Add remaining new enquiries (not in DB before)
				for (EnquiryRequestDto dto : newEnqAdded) {
				Enquiry newEnquiry = enquiryService.toEntity(dto);
				newEnquiry.setCombinedEnquiry(combinedEnquiry);
				enquiryRepository.save(newEnquiry);
				}
			
			} catch (Exception e) {
			  throw new RuntimeException("Failed to update combined enquiries: " + e.getMessage(), e);
			}
		}
    
    
    public void deleteCombinedEnquiryById(Integer id) {
        if (!combinedEnquiryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Combined Enquiry with ID " + id + " not found.");
        }

        try {
            combinedEnquiryRepository.deleteById(id);
        } catch (DataIntegrityViolationException ex) {
            throw new ResourceInUseException("Cannot delete Combined Enquiry with ID " + id + " because it's in use.");
        }
    }
	
	
	
	
	
	

    
}
