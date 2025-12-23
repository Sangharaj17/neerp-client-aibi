package com.aibi.neerp.amc.quatation.pdf.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aibi.neerp.amc.quatation.pdf.dto.AmcQuotationPdfHeadingsContentsDto;
import com.aibi.neerp.amc.quatation.pdf.dto.AmcQuotationPdfHeadingsDto;
import com.aibi.neerp.amc.quatation.pdf.dto.BankDetails;
import com.aibi.neerp.amc.quatation.pdf.dto.ContractTypeOfPricingData;
import com.aibi.neerp.amc.quatation.pdf.dto.LetterDetails;
import com.aibi.neerp.amc.quatation.pdf.dto.LiftPricingData;
import com.aibi.neerp.amc.jobs.initial.dto.LiftData;
import com.aibi.neerp.amc.jobs.initial.service.AmcJobsService;
import com.aibi.neerp.amc.quatation.initial.entity.AmcCombinedQuotation;
import com.aibi.neerp.amc.quatation.initial.entity.AmcQuotation;
import com.aibi.neerp.amc.quatation.initial.entity.RevisedAmcQuotation;
import com.aibi.neerp.amc.quatation.initial.repository.AmcQuotationRepository;
import com.aibi.neerp.amc.quatation.initial.repository.RevisedAmcQuotationRepository;
import com.aibi.neerp.amc.quatation.pdf.dto.AgreementData;
import com.aibi.neerp.amc.quatation.pdf.dto.AllContractTypeOfPricingData;
import com.aibi.neerp.amc.quatation.pdf.dto.AmcQuotationPdfGetData;
import com.aibi.neerp.amc.quatation.pdf.dto.AmcQuotationPdfHeadingWithContentsDto;
import com.aibi.neerp.amc.quatation.pdf.entity.AmcQuotationPdfHeadings;
import com.aibi.neerp.amc.quatation.pdf.entity.AmcQuotationPdfHeadingsContents;
import com.aibi.neerp.amc.quatation.pdf.repository.AmcQuotationPdfHeadingsContentsRepository;
import com.aibi.neerp.amc.quatation.pdf.repository.AmcQuotationPdfHeadingsRepository;
import com.aibi.neerp.amc.quatation.renewal.entity.AmcRenewalQuotation;
import com.aibi.neerp.amc.quatation.renewal.entity.RevisedRenewalAmcQuotation;
import com.aibi.neerp.amc.quatation.renewal.repository.AmcRenewalQuotationRepository;
import com.aibi.neerp.amc.quatation.renewal.repository.RevisedRenewalAmcQuotationRepository;
import com.aibi.neerp.config.DataSourceConfig;
import com.aibi.neerp.config.TenantContext;
import com.aibi.neerp.config.TenantDefaultDataInitializer;
import com.aibi.neerp.customer.entity.Customer;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.Enquiry;
import com.aibi.neerp.settings.entity.CompanySetting;
import com.aibi.neerp.settings.repository.CompanySettingRepository;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@Slf4j
public class AmcQuotationPdfService {

    private final AmcQuotationPdfHeadingsRepository headingsRepo;
    private final AmcQuotationPdfHeadingsContentsRepository contentsRepo;
    
    private final CompanySettingRepository companySettingRepository;
    private final AmcQuotationRepository amcQuotationRepository;
    private final RevisedAmcQuotationRepository revisedAmcQuotationRepository;
    
    private final AmcRenewalQuotationRepository amcRenewalQuotationRepository;
    private final RevisedRenewalAmcQuotationRepository revisedRenewalAmcQuotationRepository;
    
    private final AmcJobsService amcJobsService;
    
    
     public AmcQuotationPdfService(
            AmcQuotationPdfHeadingsRepository headingsRepo,
            AmcQuotationPdfHeadingsContentsRepository contentsRepo,
            CompanySettingRepository companySettingRepository,
            AmcQuotationRepository amcQuotationRepository,
            RevisedAmcQuotationRepository revisedAmcQuotationRepository,
            AmcRenewalQuotationRepository amcRenewalQuotationRepository,
            RevisedRenewalAmcQuotationRepository revisedRenewalAmcQuotationRepository,
            AmcJobsService amcJobsService
    ) {
        this.headingsRepo = headingsRepo;
        this.contentsRepo = contentsRepo;
        this.companySettingRepository = companySettingRepository;
        this.amcQuotationRepository = amcQuotationRepository;
        this.revisedAmcQuotationRepository = revisedAmcQuotationRepository;
        this.amcRenewalQuotationRepository = amcRenewalQuotationRepository;
        this.revisedRenewalAmcQuotationRepository = revisedRenewalAmcQuotationRepository;
        this.amcJobsService = amcJobsService;
    }


    // --------------------------------------------------------------------------
    // CREATE HEADING
    // --------------------------------------------------------------------------
    public AmcQuotationPdfHeadingsDto createHeading(AmcQuotationPdfHeadingsDto dto) {
        AmcQuotationPdfHeadings heading = new AmcQuotationPdfHeadings();
        heading.setHeadingName(dto.getHeadingName());
        heading = headingsRepo.save(heading);

        dto.setId(heading.getId());
        return dto;
    }

    // --------------------------------------------------------------------------
    // GET ALL HEADINGS
    // --------------------------------------------------------------------------
    public List<AmcQuotationPdfHeadingsDto> getAllHeadings() {
        return headingsRepo.findAll().stream().map(h -> {
            AmcQuotationPdfHeadingsDto dto = new AmcQuotationPdfHeadingsDto();
            dto.setId(h.getId());
            dto.setHeadingName(h.getHeadingName());
            return dto;
        }).collect(Collectors.toList());
    }

    // --------------------------------------------------------------------------
    // DELETE HEADING
    // --------------------------------------------------------------------------
    public void deleteHeading(Integer id) {
        headingsRepo.deleteById(id);
    }

    // --------------------------------------------------------------------------
    // CREATE CONTENT
    // --------------------------------------------------------------------------
    public AmcQuotationPdfHeadingsContentsDto createContent(AmcQuotationPdfHeadingsContentsDto dto) {

        AmcQuotationPdfHeadings heading = headingsRepo.findById(dto.getHeadingId())
                .orElseThrow(() -> new RuntimeException("Heading not found"));

        AmcQuotationPdfHeadingsContents content = new AmcQuotationPdfHeadingsContents();
        content.setContentData(dto.getContentData());
        content.setPicture(dto.getPicture());
        content.setAmcQuotationPdfHeadings(heading);

        content = contentsRepo.save(content);

        dto.setId(content.getId());
        return dto;
    }

    // --------------------------------------------------------------------------
    // GET CONTENTS BY HEADING
    // --------------------------------------------------------------------------
    public List<AmcQuotationPdfHeadingsContentsDto> getContentsByHeadingId(Integer headingId) {
        return contentsRepo.findAll().stream()
                .filter(c -> c.getAmcQuotationPdfHeadings().getId().equals(headingId))
                .map(c -> {
                    AmcQuotationPdfHeadingsContentsDto dto = new AmcQuotationPdfHeadingsContentsDto();
                    dto.setId(c.getId());
                    dto.setContentData(c.getContentData());
                    dto.setPicture(c.getPicture());
                    dto.setHeadingId(c.getAmcQuotationPdfHeadings().getId());
                    return dto;
                }).collect(Collectors.toList());
    }

    // --------------------------------------------------------------------------
    // DELETE CONTENT
    // --------------------------------------------------------------------------
    public void deleteContent(Integer id) {
        contentsRepo.deleteById(id);
    }

    // --------------------------------------------------------------------------
    // UPDATE HEADING
    // --------------------------------------------------------------------------
    public AmcQuotationPdfHeadingsDto updateHeading(Integer id, AmcQuotationPdfHeadingsDto dto) {
        AmcQuotationPdfHeadings heading = headingsRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Heading not found"));

        heading.setHeadingName(dto.getHeadingName());
        headingsRepo.save(heading);

        dto.setId(heading.getId());
        return dto;
    }

    // --------------------------------------------------------------------------
    // UPDATE CONTENT
    // --------------------------------------------------------------------------
    public AmcQuotationPdfHeadingsContentsDto updateContent(Integer id, AmcQuotationPdfHeadingsContentsDto dto) {
        AmcQuotationPdfHeadingsContents content = contentsRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Content not found"));

        content.setContentData(dto.getContentData());
        content.setPicture(dto.getPicture());

        if (dto.getHeadingId() != null) {
            AmcQuotationPdfHeadings heading = headingsRepo.findById(dto.getHeadingId())
                    .orElseThrow(() -> new RuntimeException("Heading not found"));
            content.setAmcQuotationPdfHeadings(heading);
        }

        contentsRepo.save(content);
        dto.setId(content.getId());

        return dto;
    }
    
    public void updateMultipleHeadingsAndContents(List<AmcQuotationPdfHeadingWithContentsDto> list) {

        // 1️⃣ DELETE removed contents
        deleteRemovedContents(list);

        // 2️⃣ UPDATE existing contents
        updateExistingContents(list);

        // 3️⃣ ADD new contents
        addNewContents(list);
    }
    
    private void deleteRemovedContents(List<AmcQuotationPdfHeadingWithContentsDto> list) {

        for (AmcQuotationPdfHeadingWithContentsDto hdto : list) {

            List<AmcQuotationPdfHeadingsContents> existingContents =
                    contentsRepo.findByAmcQuotationPdfHeadingsId(hdto.getId());

            Set<Integer> uiIds = hdto.getContents() == null
                    ? Collections.emptySet()
                    : hdto.getContents().stream()
                    .filter(c -> c.getId() != null)
                    .map(AmcQuotationPdfHeadingsContentsDto::getId)
                    .collect(Collectors.toSet());

            for (AmcQuotationPdfHeadingsContents oldContent : existingContents) {
                if (!uiIds.contains(oldContent.getId())) {
                    contentsRepo.delete(oldContent);   // DELETE only here
                }
            }
        }
    }

    private void updateExistingContents(List<AmcQuotationPdfHeadingWithContentsDto> list) {

        for (AmcQuotationPdfHeadingWithContentsDto hdto : list) {

            AmcQuotationPdfHeadings heading = headingsRepo.findById(hdto.getId())
                    .orElseThrow(() -> new RuntimeException("Heading not found: " + hdto.getId()));

            // update heading
            heading.setHeadingName(hdto.getHeadingName());
            headingsRepo.save(heading);

            if (hdto.getContents() == null) continue;

            List<AmcQuotationPdfHeadingsContents> existingContents =
                    contentsRepo.findByAmcQuotationPdfHeadingsId(hdto.getId());

            Map<Integer, AmcQuotationPdfHeadingsContents> existingMap =
                    existingContents.stream()
                            .collect(Collectors.toMap(AmcQuotationPdfHeadingsContents::getId, c -> c));

            for (AmcQuotationPdfHeadingsContentsDto cdto : hdto.getContents()) {

                if (cdto.getId() != null) { // only UPDATE

                    AmcQuotationPdfHeadingsContents existing = existingMap.get(cdto.getId());
                    if (existing == null) continue;

                    existing.setContentData(cdto.getContentData());

                    if (cdto.getPicture() != null && !cdto.getPicture().isBlank()) {
                        existing.setPicture(normalizePicture(cdto.getPicture()));
                    }

                    contentsRepo.save(existing);
                }
            }
        }
    }
    
    private void addNewContents(List<AmcQuotationPdfHeadingWithContentsDto> list) {

        for (AmcQuotationPdfHeadingWithContentsDto hdto : list) {

            AmcQuotationPdfHeadings heading = headingsRepo.findById(hdto.getId())
                    .orElseThrow(() -> new RuntimeException("Heading not found: " + hdto.getId()));

            if (hdto.getContents() == null) continue;

            for (AmcQuotationPdfHeadingsContentsDto cdto : hdto.getContents()) {

                if (cdto.getId() == null) {  // only NEW contents

                    AmcQuotationPdfHeadingsContents newContent = new AmcQuotationPdfHeadingsContents();
                    newContent.setContentData(cdto.getContentData());

                    if (cdto.getPicture() != null && !cdto.getPicture().isBlank()) {
                        newContent.setPicture(normalizePicture(cdto.getPicture()));
                    }

                    newContent.setAmcQuotationPdfHeadings(heading);

                    contentsRepo.save(newContent);  // INSERT only here
                }
            }
        }
    }




    // --------------------------------------------------------------------------
    // BATCH UPDATE (MULTIPLE HEADINGS + MULTIPLE CONTENTS)
    // --------------------------------------------------------------------------
//    @Transactional
//    public void updateMultipleHeadingsAndContents(List<AmcQuotationPdfHeadingWithContentsDto> list) {
//
//        for (AmcQuotationPdfHeadingWithContentsDto hdto : list) {
//
//            // -------------------------------
//            // 1️⃣ Update Heading
//            // -------------------------------
//            AmcQuotationPdfHeadings heading = headingsRepo.findById(hdto.getId())
//                    .orElseThrow(() -> new RuntimeException("Heading not found: " + hdto.getId()));
//
//            heading.setHeadingName(hdto.getHeadingName());
//            headingsRepo.save(heading);
//
//            // -------------------------------
//            // 2️⃣ Load Existing Contents
//            // -------------------------------
//            List<AmcQuotationPdfHeadingsContents> existingContents =
//                    contentsRepo.findByAmcQuotationPdfHeadingsId(heading.getId());
//
//            Map<Integer, AmcQuotationPdfHeadingsContents> existingMap =
//                    existingContents.stream()
//                            .collect(Collectors.toMap(AmcQuotationPdfHeadingsContents::getId, c -> c));
//
//            Set<Integer> updatedIds = new HashSet<>();
//
//            // -------------------------------
//            // 3️⃣ Handle New + Updated Contents
//            // -------------------------------
//            if (hdto.getContents() != null) {
//
//                for (AmcQuotationPdfHeadingsContentsDto cdto : hdto.getContents()) {
//
//                    if (cdto.getId() == null) {
//                        // ⭐ NEW CONTENT
//                        AmcQuotationPdfHeadingsContents newContent = new AmcQuotationPdfHeadingsContents();
//
//                        newContent.setContentData(cdto.getContentData());
//
//                        // picture handling
//                        if (cdto.getPicture() != null && !cdto.getPicture().isBlank()) {
//                            newContent.setPicture(normalizePicture(cdto.getPicture()));
//                        }
//
//                        newContent.setAmcQuotationPdfHeadings(heading);
//                        contentsRepo.save(newContent);
//
//                    } else {
//                        // ⭐ UPDATE CONTENT
//                        AmcQuotationPdfHeadingsContents existing =
//                                existingMap.get(cdto.getId());
//
//                        if (existing == null) {
//                            throw new RuntimeException("Content not found: " + cdto.getId());
//                        }
//
//                        existing.setContentData(cdto.getContentData());
//
//                        // picture handling (UPDATE)
//                        if (cdto.getPicture() != null && !cdto.getPicture().isBlank()) {
//                            existing.setPicture(normalizePicture(cdto.getPicture())); // replace
//                        } else {
//                            // keep existing picture (do nothing)
//                        }
//
//                        existing.setAmcQuotationPdfHeadings(heading);
//                        contentsRepo.save(existing);
//
//                        updatedIds.add(cdto.getId());
//                    }
//                }
//            }
//
//            // -------------------------------
//            // 4️⃣ DELETE Removed Contents
//            // -------------------------------
//            for (AmcQuotationPdfHeadingsContents oldContent : existingContents) {
//                if (!updatedIds.contains(oldContent.getId())) {
//                    contentsRepo.delete(oldContent);
//                }
//            }
//        }
//    }
    
    private String normalizePicture(String pic) {

        if (pic == null || pic.isBlank()) return null;

        // If already a proper data URL → return as is
        if (pic.startsWith("data:")) {
            return pic.trim();
        }

        // Otherwise assume raw base64 and prefix with PNG mime type
        return "data:image/png;base64," + pic.trim();
    }
    
    
    public List<AmcQuotationPdfHeadingWithContentsDto> getAllHeadingsWithContents(String forWhat) {
   
        log.info("📌 getAllHeadingsWithContents() called");

        List<AmcQuotationPdfHeadings> headings;

        if (forWhat.equalsIgnoreCase("forSetting")) {
            headings = headingsRepo.findAll();
        } else {
            headings = headingsRepo.findAll()
                    .stream()
                    .filter(h ->
                            "AMC".equalsIgnoreCase(h.getQuotationType()) ||
                            "Common".equalsIgnoreCase(h.getQuotationType())
                    )
                    .collect(Collectors.toList());
        }

        
    
    log.info("Total headings fetched: {}", headings.size());
        
        System.out.println("size of heading are "+headings.size());

        List<AmcQuotationPdfHeadingWithContentsDto> result = new ArrayList<>();

        for (AmcQuotationPdfHeadings heading : headings) {

            log.debug("Processing heading -> ID: {}, Name: {}", heading.getId(), heading.getHeadingName());

            AmcQuotationPdfHeadingWithContentsDto dto =
                    new AmcQuotationPdfHeadingWithContentsDto();

            dto.setId(heading.getId());
            dto.setHeadingName(heading.getHeadingName());
            dto.setQuotationType(heading.getQuotationType());
            
            // Fetch contents for this heading
            List<AmcQuotationPdfHeadingsContents> contents =
                    contentsRepo.findByAmcQuotationPdfHeadingsId(heading.getId());

            log.debug("Contents fetched for heading ID {}: {}", heading.getId(), contents.size());

            List<AmcQuotationPdfHeadingsContentsDto> contentDtoList = contents.stream()
                    .map(c -> {
                        log.trace("Mapping content -> ID: {}", c.getId());
                        return new AmcQuotationPdfHeadingsContentsDto(
                                c.getId(),
                                c.getContentData(),
                                c.getPicture(),
                                heading.getId()
                        );
                    })
                    .collect(Collectors.toList());

            dto.setContents(contentDtoList);

            result.add(dto);
        }

        System.out.println("✔ getAllHeadingsWithContents() completed. Total DTOs: {}"+ result.size());
        log.info("✔ getAllHeadingsWithContents() completed. Total DTOs: {}", result.size());

        return result;
    }

    
    private String getForCustomerSealAndSignatureLogo(
            List<AmcQuotationPdfHeadingWithContentsDto> list) {

        if (list == null || list.isEmpty()) {
            return "";
        }

        for (AmcQuotationPdfHeadingWithContentsDto dto : list) {
            if (dto == null || dto.getHeadingName() == null) {
                continue;
            }

            if (dto.getHeadingName().equalsIgnoreCase("FOR CUSTOMERS SEAL & SIGNATURE")) {

                // Safe null & empty check for contents
                if (dto.getContents() != null 
                        && !dto.getContents().isEmpty() 
                        && dto.getContents().get(0).getPicture() != null) {

                    return dto.getContents().get(0).getPicture();
                }

                return ""; // heading found but no picture available
            }
        }

        // heading not found
        return "";
    }
    
    public List<AmcQuotationPdfHeadingWithContentsDto> amcQuotationPdfHeadingWithContentsDtos(){
    	
    	List<AmcQuotationPdfHeadingWithContentsDto> amcQuotationPdfHeadingWithContentsDtos = 
    			getAllHeadingsWithContents("forSetting");
    	
    	return amcQuotationPdfHeadingWithContentsDtos;
    	
    }

    
    public AmcQuotationPdfGetData amcQuotationPdfGetData(Integer amcQuatationId,
														    Integer revisedQuatationId,
														    Integer renewalQuaId,
														    Integer revisedRenewalId) {
    	
    	
    	
    	AmcQuotationPdfGetData amcQuotationPdfGetData = 
    			new AmcQuotationPdfGetData();
    	
    	List<AmcQuotationPdfHeadingWithContentsDto> amcQuotationPdfHeadingWithContentsDtos = 
    			getAllHeadingsWithContents("forPdf");
    	
    	amcQuotationPdfGetData.setAmcQuotationPdfHeadingWithContentsDtos(amcQuotationPdfHeadingWithContentsDtos);
    	
    	
    	
    	AmcQuotation amcQuotation = null;
    	RevisedAmcQuotation revisedAmcQuotation =  null;
    	
    	AmcRenewalQuotation amcRenewalQuotation = null;
    	RevisedRenewalAmcQuotation revisedRenewalAmcQuotation = null;
    	
    	CombinedEnquiry combinedEnquiry = null;
    	
    	// global pdf data
    	String refNo = "";
    	 LocalDate quotationDate = null;
    	 String company_name = "";
    	 String company_person_name = "";
    	 String makeOfElevators = "";
    	 List<LiftData> liftSpecifications = null;
    	
    	// this details for to letter details
    	 String to;
    	 String address = null;
         String pinCode;
    	 String attentionPerson;
    	 String phone;
    	
    	  // this details for agreement data
    	String sitename = "";
    	String typeOfContract = "";
    	String priceOfContract = "";
    	String contractPeriod = "";
    	String paymentTerm = "";
    	String nameOfPerson = "";
    	String mobileNo = "";
    	
    	String forCustomerSealAndSignatureLogo = getForCustomerSealAndSignatureLogo(amcQuotationPdfHeadingWithContentsDtos);
    	
    	String contractTypes [] = null;
    	
    	if(amcQuatationId!=null) {
    		amcQuotation = amcQuotationRepository.findById(amcQuatationId).get();
    		makeOfElevators = amcQuotation.getMakeOfElevator().getName();

    		combinedEnquiry = amcQuotation.getCombinedEnquiry();
    		
    		liftSpecifications = amcJobsService.buildLiftData(combinedEnquiry);
    		
    		sitename = combinedEnquiry.getSiteName();
    		String startDate = amcQuotation.getFromDate().toString();
    		String endDate = amcQuotation.getToDate().toString();
    		
    		contractPeriod = startDate+" to "+endDate;
    		paymentTerm = amcQuotation.getPaymentTerm().getTermName();
    		nameOfPerson = amcQuotation.getLead().getCustomerName();
    		mobileNo = amcQuotation.getLead().getContactNo();
    		
    		address = amcQuotation.getLead().getSiteAddress();
			
    		quotationDate = amcQuotation.getQuatationDate();
    		
    		refNo = quotationDate.toString()+"/"+amcQuotation.getAmcQuatationId();

    				
    		typeOfContract = amcQuotation.getTypeContract();
    		
    		System.out.println(typeOfContract+" typeOfContract is this");
    		
    		
    		String[] allContractTypes = typeOfContract.split(",");
    		contractTypes = allContractTypes;
    		
    		StringBuilder priceBuilder = new StringBuilder();
    		

    		for (int i = 0; i < allContractTypes.length; i++) {

    		    String contractTypeName = allContractTypes[i].trim();
    		    double price = 0;

    		    if (contractTypeName.equalsIgnoreCase("Non-Comprehensive")) {
    		        price = amcQuotation.getIsFinalOrdinary().doubleValue();
    		    } else if (contractTypeName.equalsIgnoreCase("Comprehensive")) {
    		        price = amcQuotation.getIsFinalComp().doubleValue();
    		    } else {
    		        price = amcQuotation.getIsFinalSemiComp().doubleValue();
    		    }

    		    // Append with comma separation
    		    if (priceBuilder.length() > 0) {
    		        priceBuilder.append(", ");
    		    }
    		    priceBuilder.append(price);
    		}

    		 priceOfContract = priceBuilder.toString();

    		
    	}else if(revisedQuatationId!=null) {
    		revisedAmcQuotation = revisedAmcQuotationRepository.findById(revisedQuatationId).get();
    		
    		makeOfElevators = revisedAmcQuotation.getMakeOfElevator().getName();

    		
    		combinedEnquiry = revisedAmcQuotation.getCombinedEnquiry(); 
    		liftSpecifications = amcJobsService.buildLiftData(combinedEnquiry);

    		sitename = combinedEnquiry.getSiteName();
    		String startDate = revisedAmcQuotation.getFromDate().toString();
    		String endDate = revisedAmcQuotation.getToDate().toString();
    		
    		contractPeriod = startDate+" to "+endDate;
    		paymentTerm = revisedAmcQuotation.getPaymentTerm().getTermName();
    		nameOfPerson = revisedAmcQuotation.getLead().getCustomerName();
    		mobileNo = revisedAmcQuotation.getLead().getContactNo();
    		
    		address = revisedAmcQuotation.getLead().getSiteAddress();


    		quotationDate = revisedAmcQuotation.getQuatationDate();
    		refNo = quotationDate.toString()+"/"+revisedQuatationId+"/revised";

    		
    		typeOfContract = revisedAmcQuotation.getTypeContract();
    		
    		String[] allContractTypes = typeOfContract.split(",");
    		
    		contractTypes = allContractTypes;

    		StringBuilder priceBuilder = new StringBuilder();

    		for (int i = 0; i < allContractTypes.length; i++) {

    		    String contractTypeName = allContractTypes[i].trim();
    		    double price = 0;

    		    if (contractTypeName.equalsIgnoreCase("Non-Comprehensive")) {
    		        price = revisedAmcQuotation.getIsFinalOrdinary().doubleValue();
    		    } else if (contractTypeName.equalsIgnoreCase("Comprehensive")) {
    		        price = revisedAmcQuotation.getIsFinalComp().doubleValue();
    		    } else {
    		        price = revisedAmcQuotation.getIsFinalSemiComp().doubleValue();
    		    }

    		    if (priceBuilder.length() > 0) {
    		        priceBuilder.append(", ");
    		    }
    		    priceBuilder.append(price);
    		}

    		 priceOfContract = priceBuilder.toString();

    		
    	}else if(renewalQuaId!=null) {
    		amcRenewalQuotation = amcRenewalQuotationRepository.findById(renewalQuaId).get();
    		
    		makeOfElevators = amcRenewalQuotation.getMakeOfElevator().getName();


    		combinedEnquiry = amcRenewalQuotation.getCombinedEnquiry();
    		liftSpecifications = amcJobsService.buildLiftData(combinedEnquiry);

    		sitename = combinedEnquiry.getSiteName();
    		String startDate = amcRenewalQuotation.getFromDate().toString();
    		String endDate = amcRenewalQuotation.getToDate().toString();
    		
    		contractPeriod = startDate+" to "+endDate;
    		paymentTerm = amcRenewalQuotation.getPaymentTerm().getTermName();
    		nameOfPerson = amcRenewalQuotation.getLead().getCustomerName();
    		mobileNo = amcRenewalQuotation.getLead().getContactNo();
    		
    		address = amcRenewalQuotation.getLead().getSiteAddress();


    		quotationDate = amcRenewalQuotation.getQuatationDate();
    		
    		refNo = quotationDate.toString()+"/"+renewalQuaId+"/renewal";

    		
    		typeOfContract = amcRenewalQuotation.getTypeContract();
    		
    		String[] allContractTypes = typeOfContract.split(",");
    		contractTypes = allContractTypes;

    		StringBuilder priceBuilder = new StringBuilder();

    		for (int i = 0; i < allContractTypes.length; i++) {

    		    String contractTypeName = allContractTypes[i].trim();
    		    double price = 0;

    		    if (contractTypeName.equalsIgnoreCase("Non-Comprehensive")) {
    		        price = amcRenewalQuotation.getIsFinalOrdinary().doubleValue();
    		    } else if (contractTypeName.equalsIgnoreCase("Comprehensive")) {
    		        price = amcRenewalQuotation.getIsFinalComp().doubleValue();
    		    } else {
    		        price = amcRenewalQuotation.getIsFinalSemiComp().doubleValue();
    		    }

    		    if (priceBuilder.length() > 0) {
    		        priceBuilder.append(", ");
    		    }
    		    priceBuilder.append(price);
    		}

    		 priceOfContract = priceBuilder.toString();

    		
    		
     	}else if(revisedRenewalId!=null) {
     		revisedRenewalAmcQuotation = revisedRenewalAmcQuotationRepository.findById(revisedRenewalId).get();
     		
    		makeOfElevators = revisedRenewalAmcQuotation.getMakeOfElevator().getName();

     		combinedEnquiry = revisedRenewalAmcQuotation.getCombinedEnquiry();
    		liftSpecifications = amcJobsService.buildLiftData(combinedEnquiry);

    		sitename = combinedEnquiry.getSiteName();
    		String startDate = revisedRenewalAmcQuotation.getFromDate().toString();
    		String endDate = revisedRenewalAmcQuotation.getToDate().toString();
    		
    		contractPeriod = startDate+" to "+endDate;
    		paymentTerm = revisedRenewalAmcQuotation.getPaymentTerm().getTermName();
    		nameOfPerson = revisedRenewalAmcQuotation.getLead().getCustomerName();
    		mobileNo = revisedRenewalAmcQuotation.getLead().getContactNo();
    		
    		address = revisedRenewalAmcQuotation.getLead().getSiteAddress();


    		quotationDate = revisedRenewalAmcQuotation.getQuatationDate();
    		
    		refNo = quotationDate.toString()+"/"+revisedRenewalId+"/revised/renewal";

    		
    		typeOfContract = revisedRenewalAmcQuotation.getTypeContract();
    		
    		String[] allContractTypes = typeOfContract.split(",");
    		contractTypes = allContractTypes;

    		StringBuilder priceBuilder = new StringBuilder();

    		for (int i = 0; i < allContractTypes.length; i++) {

    		    String contractTypeName = allContractTypes[i].trim();
    		    double price = 0;

    		    if (contractTypeName.equalsIgnoreCase("Non-Comprehensive")) {
    		        price = revisedRenewalAmcQuotation.getIsFinalOrdinary().doubleValue();
    		    } else if (contractTypeName.equalsIgnoreCase("Comprehensive")) {
    		        price = revisedRenewalAmcQuotation.getIsFinalComp().doubleValue();
    		    } else {
    		        price = revisedRenewalAmcQuotation.getIsFinalSemiComp().doubleValue();
    		    }

    		    if (priceBuilder.length() > 0) {
    		        priceBuilder.append(", ");
    		    }
    		    priceBuilder.append(price);
    		}

    		 priceOfContract = priceBuilder.toString();

    		
    		
     	}
    	
    	amcQuotationPdfGetData.setMakeOfElavators(makeOfElevators); 
    	amcQuotationPdfGetData.setLiftSpecifications(liftSpecifications);
    	
        
    	to = sitename;
    	attentionPerson = nameOfPerson;
    	phone = mobileNo;
    	
    	LetterDetails letterDetails = new LetterDetails();
    	letterDetails.setAttentionPerson(attentionPerson);
    	letterDetails.setPhone(phone);
    	letterDetails.setAddress(address);
    	letterDetails.setTo(to);    	
    	
    	amcQuotationPdfGetData.setLetterDetails(letterDetails);
    	
       AgreementData agreementData = new AgreementData();
    	
    	agreementData.setContractPeriod(contractPeriod);
    	agreementData.setForCustomerSealAndSignatureLogo(forCustomerSealAndSignatureLogo);
    	agreementData.setMobileNumber(mobileNo);
    	agreementData.setNameOfPerson(nameOfPerson);
    	agreementData.setPaymentTerm(paymentTerm);
    	agreementData.setPriceOfContract(priceOfContract);
    	agreementData.setSitename(sitename);
    	agreementData.setTypeOfContract(typeOfContract);
    	
    	amcQuotationPdfGetData.setAgreementData(agreementData);    	
    
    	CompanySetting companySetting = companySettingRepository.findAll().get(0);
    	
    	BankDetails bankDetails = new BankDetails();
    	
    	bankDetails.setAccountNumber(companySetting.getAccountNumber());
    	bankDetails.setBankName(companySetting.getBankName());
    	bankDetails.setBranchName(companySetting.getBranchName());
    	bankDetails.setGstNumber(companySetting.getCompanyGst());
    	bankDetails.setIfscCode(companySetting.getIfscCode());
    	bankDetails.setAccountName(companySetting.getCompanyName());
    	
    
    	
    	amcQuotationPdfGetData.setBankDetails(bankDetails);  
    	
    	company_name = companySetting.getCompanyName();
    	company_person_name = companySetting.getCompanyOwnerName();
    	
    	amcQuotationPdfGetData.setCompany_name(company_name);
    	amcQuotationPdfGetData.setCompany_person_name(company_person_name);
    			
    	amcQuotationPdfGetData.setRefNo(refNo);
    	amcQuotationPdfGetData.setQuotationDate(quotationDate);
    	
    	AllContractTypeOfPricingData allContractTypeOfPricingData = 
    	getAllContractTypeOfPricingDatas(amcQuotation, revisedAmcQuotation, 
    			amcRenewalQuotation, revisedRenewalAmcQuotation, contractTypes);
    	
    	amcQuotationPdfGetData.setAllContractTypeOfPricingData(allContractTypeOfPricingData);

    	
    	return amcQuotationPdfGetData;
    	
    }
    
    public AllContractTypeOfPricingData getAllContractTypeOfPricingDatas(
    		 AmcQuotation amcQuotation , RevisedAmcQuotation revisedAmcQuotation,
    		 AmcRenewalQuotation amcRenewalQuotation , RevisedRenewalAmcQuotation revisedRenewalAmcQuotation ,
    		 String [] allContractTypes){
    	
    	AllContractTypeOfPricingData allContractTypeOfPricingData = 
    			new AllContractTypeOfPricingData();
    	
    	List<ContractTypeOfPricingData> contractTypeOfPricingDatas = 
    			new ArrayList<ContractTypeOfPricingData>();
    	
    	
    	List<AmcCombinedQuotation> amcCombinedQuotations = null;
    	
    	 // All variables directly inside the method
    	// All variables directly inside the method
    	BigDecimal amountOrdinary = null;
    	BigDecimal gstOrdinary = null;
    	BigDecimal isFinalOrdinary = null;

    	BigDecimal amountSemiComp = null;
    	BigDecimal gstSemi = null;
    	BigDecimal isFinalSemiComp = null;

    	BigDecimal amountComp = null;
    	BigDecimal gstComp = null;
    	BigDecimal isFinalComp = null;

    	BigDecimal gstPercentage = null;

    	if (amcQuotation != null) {

    	    amcCombinedQuotations = amcQuotation.getCombinedQuotations();
    	    
    	    amountOrdinary = amcQuotation.getAmountOrdinary();
    	    gstOrdinary = amcQuotation.getGstOrdinary();
    	    isFinalOrdinary = amcQuotation.getIsFinalOrdinary();

    	    amountSemiComp = amcQuotation.getAmountSemiComp();
    	    gstSemi = amcQuotation.getGstSemi();
    	    isFinalSemiComp = amcQuotation.getIsFinalSemiComp();

    	    amountComp = amcQuotation.getAmountComp();
    	    gstComp = amcQuotation.getGstComp();
    	    isFinalComp = amcQuotation.getIsFinalComp();

    	    gstPercentage = amcQuotation.getGstPercentage();

    	} else if (revisedAmcQuotation != null) {

    	    amcCombinedQuotations = revisedAmcQuotation.getCombinedQuotations();
    	        	    
    	    
    	    amountOrdinary = revisedAmcQuotation.getAmountOrdinary();
    	    gstOrdinary = revisedAmcQuotation.getGstOrdinary();
    	    isFinalOrdinary = revisedAmcQuotation.getIsFinalOrdinary();

    	    amountSemiComp = revisedAmcQuotation.getAmountSemiComp();
    	    gstSemi = revisedAmcQuotation.getGstSemi();
    	    isFinalSemiComp = revisedAmcQuotation.getIsFinalSemiComp();

    	    amountComp = revisedAmcQuotation.getAmountComp();
    	    gstComp = revisedAmcQuotation.getGstComp();
    	    isFinalComp = revisedAmcQuotation.getIsFinalComp();

    	    gstPercentage = revisedAmcQuotation.getGstPercentage();

    	} else if (amcRenewalQuotation != null) {

    	    amcCombinedQuotations = amcRenewalQuotation.getCombinedQuotations();

    	    amountOrdinary = amcRenewalQuotation.getAmountOrdinary();
    	    gstOrdinary = amcRenewalQuotation.getGstOrdinary();
    	    isFinalOrdinary = amcRenewalQuotation.getIsFinalOrdinary();

    	    amountSemiComp = amcRenewalQuotation.getAmountSemiComp();
    	    gstSemi = amcRenewalQuotation.getGstSemi();
    	    isFinalSemiComp = amcRenewalQuotation.getIsFinalSemiComp();

    	    amountComp = amcRenewalQuotation.getAmountComp();
    	    gstComp = amcRenewalQuotation.getGstComp();
    	    isFinalComp = amcRenewalQuotation.getIsFinalComp();

    	    gstPercentage = amcRenewalQuotation.getGstPercentage();

    	} else if (revisedRenewalAmcQuotation != null) {

    	    amcCombinedQuotations = revisedRenewalAmcQuotation.getCombinedQuotations();
    	    
    	    amountOrdinary = revisedRenewalAmcQuotation.getAmountOrdinary();
    	    gstOrdinary = revisedRenewalAmcQuotation.getGstOrdinary();
    	    isFinalOrdinary = revisedRenewalAmcQuotation.getIsFinalOrdinary();

    	    amountSemiComp = revisedRenewalAmcQuotation.getAmountSemiComp();
    	    gstSemi = revisedRenewalAmcQuotation.getGstSemi();
    	    isFinalSemiComp = revisedRenewalAmcQuotation.getIsFinalSemiComp();

    	    amountComp = revisedRenewalAmcQuotation.getAmountComp();
    	    gstComp = revisedRenewalAmcQuotation.getGstComp();
    	    isFinalComp = revisedRenewalAmcQuotation.getIsFinalComp();

    	    gstPercentage = revisedRenewalAmcQuotation.getGstPercentage();
    	}
    	
    	
    	ContractTypeOfPricingData nonComprehensiveTypeContractTypeOfPricingData = new ContractTypeOfPricingData();
    	ContractTypeOfPricingData semiComprehensiveTypeContractTypeOfPricingData = new ContractTypeOfPricingData();
    	ContractTypeOfPricingData comprehensiveTypeContractTypeOfPricingData = new ContractTypeOfPricingData();
    	
    	
    	
    	if(amcCombinedQuotations!=null) {
    		
    		for(String contractType : allContractTypes) {
    			
    			if(contractType.equalsIgnoreCase("Non-Comprehensive")) {
    				
    				nonComprehensiveTypeContractTypeOfPricingData.setContractType("Non-Comprehensive");
    				nonComprehensiveTypeContractTypeOfPricingData.setSubTotalOfAllLifts(amountOrdinary);
    				nonComprehensiveTypeContractTypeOfPricingData.setGstAmountOfLifts(gstOrdinary);
    				nonComprehensiveTypeContractTypeOfPricingData.setTotalPriceWithTax(isFinalOrdinary);
    				nonComprehensiveTypeContractTypeOfPricingData.setGstPercentage(gstPercentage);
    				nonComprehensiveTypeContractTypeOfPricingData.setTotalPriceWithTaxInWords(convertAmountToWords(isFinalOrdinary));
    				
    			    List<LiftPricingData> liftPricingDatas = new ArrayList<LiftPricingData>();
    				   				
    				for(AmcCombinedQuotation amcCombinedQuotation : amcCombinedQuotations) {
    					
    					LiftPricingData liftPricingData = new LiftPricingData();
    					liftPricingData.setNoOfLifts(1);
    					liftPricingData.setPricePerLift(amcCombinedQuotation.getAmountOrdinary());
    					
    					String productDescription = "";
    					Enquiry enquiry = amcCombinedQuotation.getEnquiry();
    					
    					String elevatorType = enquiry.getTypeOfLift().getLiftTypeName();
    					String floorName = enquiry.getFloorsDesignation();
    					
    					productDescription = elevatorType+" "+floorName;
    					
    				    liftPricingData.setProductDescription(productDescription);
    				    liftPricingData.setTotalAmount(amcCombinedQuotation.getAmountOrdinary());
    				    liftPricingData.setTypeOfContract(contractType);
    				    
    				    liftPricingDatas.add(liftPricingData);
    				    
    				}
    				
    				nonComprehensiveTypeContractTypeOfPricingData.setLiftPricingDatas(liftPricingDatas);
    				
    				contractTypeOfPricingDatas.add(nonComprehensiveTypeContractTypeOfPricingData);

    				
    			}else if(contractType.equalsIgnoreCase("Comprehensive")) {
    				
    				comprehensiveTypeContractTypeOfPricingData.setContractType("Comprehensive");
    				comprehensiveTypeContractTypeOfPricingData.setSubTotalOfAllLifts(amountComp);
    				comprehensiveTypeContractTypeOfPricingData.setGstAmountOfLifts(gstComp);
    				comprehensiveTypeContractTypeOfPricingData.setTotalPriceWithTax(isFinalComp);
    				comprehensiveTypeContractTypeOfPricingData.setGstPercentage(gstPercentage);
    				comprehensiveTypeContractTypeOfPricingData.setTotalPriceWithTaxInWords(convertAmountToWords(isFinalComp));
    				
    				 List<LiftPricingData> liftPricingDatas = new ArrayList<LiftPricingData>();
		   				
     				for(AmcCombinedQuotation amcCombinedQuotation : amcCombinedQuotations) {
     					
     					LiftPricingData liftPricingData = new LiftPricingData();
     					liftPricingData.setNoOfLifts(1);
     					liftPricingData.setPricePerLift(amcCombinedQuotation.getAmountComp());
     					
     					String productDescription = "";
     					Enquiry enquiry = amcCombinedQuotation.getEnquiry();
     					
     					String elevatorType = enquiry.getTypeOfLift().getLiftTypeName();
     					String floorName = enquiry.getFloorsDesignation();
     					
     					productDescription = elevatorType+" "+floorName;
     					
     				    liftPricingData.setProductDescription(productDescription);
     				    liftPricingData.setTotalAmount(amcCombinedQuotation.getAmountComp());
     				    liftPricingData.setTypeOfContract(contractType);
     				    
     				    liftPricingDatas.add(liftPricingData);
     				    
     				}
     				
     				comprehensiveTypeContractTypeOfPricingData.setLiftPricingDatas(liftPricingDatas);
    			
    				contractTypeOfPricingDatas.add(comprehensiveTypeContractTypeOfPricingData);

    			}else {
    				
    				semiComprehensiveTypeContractTypeOfPricingData.setContractType("Semi-Comprehensive");
    				semiComprehensiveTypeContractTypeOfPricingData.setSubTotalOfAllLifts(amountSemiComp);
    				semiComprehensiveTypeContractTypeOfPricingData.setGstAmountOfLifts(gstSemi);
    				semiComprehensiveTypeContractTypeOfPricingData.setTotalPriceWithTax(isFinalSemiComp);
    				semiComprehensiveTypeContractTypeOfPricingData.setGstPercentage(gstPercentage);
    				semiComprehensiveTypeContractTypeOfPricingData.setTotalPriceWithTaxInWords(convertAmountToWords(isFinalSemiComp));
    			
    				 List<LiftPricingData> liftPricingDatas = new ArrayList<LiftPricingData>();
		   				
      				for(AmcCombinedQuotation amcCombinedQuotation : amcCombinedQuotations) {
      					
      					LiftPricingData liftPricingData = new LiftPricingData();
      					liftPricingData.setNoOfLifts(1);
      					liftPricingData.setPricePerLift(amcCombinedQuotation.getAmountSemi());
      					
      					String productDescription = "";
      					Enquiry enquiry = amcCombinedQuotation.getEnquiry();
      					
      					String elevatorType = enquiry.getTypeOfLift().getLiftTypeName();
      					String floorName = enquiry.getFloorsDesignation();
      					
      					productDescription = elevatorType+" "+floorName;
      					
      				    liftPricingData.setProductDescription(productDescription);
      				    liftPricingData.setTotalAmount(amcCombinedQuotation.getAmountSemi());
      				    liftPricingData.setTypeOfContract(contractType);
      				    
      				    liftPricingDatas.add(liftPricingData);
      				    
      				}
      				
      				semiComprehensiveTypeContractTypeOfPricingData.setLiftPricingDatas(liftPricingDatas);
    				
      				contractTypeOfPricingDatas.add(semiComprehensiveTypeContractTypeOfPricingData);

    				
    			}
    		}  		
    		
    	}
    	
   
    	
    	allContractTypeOfPricingData.setContractTypeOfPricingDatas(contractTypeOfPricingDatas);
    	
    	return allContractTypeOfPricingData;
    	
    }

    public String convertAmountToWords(BigDecimal amount) {
        if (amount == null) {
            return "";
        }

        long rupees = amount.longValue();
        int paise = amount.remainder(BigDecimal.ONE).movePointRight(2).intValue();

        String rupeesInWords = convertNumberToWords(rupees);

        if (paise > 0) {
            return rupeesInWords + " Rupees and " + convertNumberToWords(paise) + " Paise Only";
        } else {
            return rupeesInWords + " Rupees Only";
        }
    }
    
    private static final String[] units = {
            "", "One", "Two", "Three", "Four", "Five", "Six",
            "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
            "Thirteen", "Fourteen", "Fifteen", "Sixteen",
            "Seventeen", "Eighteen", "Nineteen"
    };

    private static final String[] tens = {
            "", "", "Twenty", "Thirty", "Forty", "Fifty",
            "Sixty", "Seventy", "Eighty", "Ninety"
    };

    private String convertNumberToWords(long number) {
        if (number == 0) {
            return "Zero";
        }

        if (number < 20) {
            return units[(int) number];
        } else if (number < 100) {
            return tens[(int) number / 10] + ((number % 10 != 0) ? " " + units[(int) number % 10] : "");
        } else if (number < 1000) {
            return units[(int) number / 100] + " Hundred" + ((number % 100 != 0) ? " " + convertNumberToWords(number % 100) : "");
        } else if (number < 100000) {
            return convertNumberToWords(number / 1000) + " Thousand" + ((number % 1000 != 0) ? " " + convertNumberToWords(number % 1000) : "");
        } else if (number < 10000000) {
            return convertNumberToWords(number / 100000) + " Lakh" + ((number % 100000 != 0) ? " " + convertNumberToWords(number % 100000) : "");
        } else {
            return convertNumberToWords(number / 10000000) + " Crore" + ((number % 10000000 != 0) ? " " + convertNumberToWords(number % 10000000) : "");
        }
    }





}
