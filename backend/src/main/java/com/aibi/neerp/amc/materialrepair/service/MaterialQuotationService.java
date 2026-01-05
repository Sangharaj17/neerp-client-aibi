package com.aibi.neerp.amc.materialrepair.service;

import com.aibi.neerp.amc.materialrepair.dto.*;
import com.aibi.neerp.amc.materialrepair.entity.*;
import com.aibi.neerp.amc.materialrepair.repository.MaterialQuotationRepository;
import com.aibi.neerp.amc.materialrepair.repository.WorkPeriodRepository;
import com.aibi.neerp.amc.quatation.initial.entity.AmcQuotation;
import com.aibi.neerp.amc.quatation.initial.entity.RevisedAmcQuotation;
import com.aibi.neerp.customer.entity.Customer;
import com.aibi.neerp.customer.entity.Site;
import com.aibi.neerp.exception.ResourceNotFoundException;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;
import com.aibi.neerp.leadmanagement.entity.EnquiryType;
import com.aibi.neerp.leadmanagement.repository.EnquiryTypeRepository;
import com.aibi.neerp.modernization.entity.Modernization;
import com.aibi.neerp.oncall.entity.OnCallQuotation;
import com.aibi.neerp.settings.entity.CompanySetting;
import com.aibi.neerp.settings.repository.CompanySettingRepository;
import com.aibi.neerp.settings.service.CompanySettingService;
import com.aibi.neerp.amc.invoice.dto.AmcInvoicePdfData;
import com.aibi.neerp.amc.invoice.dto.AmcInvoiceRequestDto;
import com.aibi.neerp.amc.invoice.entity.AmcInvoice;
import com.aibi.neerp.amc.invoice.repository.AmcInvoiceRepository;
import com.aibi.neerp.amc.invoice.service.AmcInvoiceService;
import com.aibi.neerp.amc.jobs.initial.entity.AmcJob;
import com.aibi.neerp.amc.jobs.initial.repository.AmcJobRepository;
import com.aibi.neerp.amc.jobs.renewal.entity.AmcRenewalJob;
import com.aibi.neerp.amc.jobs.renewal.repository.AmcRenewalJobRepository;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Year;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MaterialQuotationService {

    private final MaterialQuotationRepository materialQuotationRepository;
    private final AmcJobRepository amcJobRepository;
    private final AmcRenewalJobRepository amcRenewalJobRepository;
    private final WorkPeriodRepository workPeriodRepository;
    private final WorkPeriodService workPeriodService;
    private final CompanySettingService companySettingService;
    private final CompanySettingRepository companySettingRepository;
    
    private final AmcInvoiceRepository invoiceRepository;
    private final AmcInvoiceService amcInvoiceService;
    private final EnquiryTypeRepository enquiryTypeRepository;

    // 🔹 GET ALL with Pagination, Sorting & Search
    public Page<MaterialQuotationResponseDto> getAllMaterialQuotations(
            String search,
            LocalDate dateSearch,
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        String dateSearchStr = dateSearch != null ? dateSearch.toString() : null;

        Page<MaterialQuotation> results = materialQuotationRepository.searchAll(
                search == null ? "" : search,
                dateSearchStr,
                pageable
        );

        return results.map(this::convertToResponseDto);
    }

    // 🔹 SAVE Quotation
    public MaterialQuotationResponseDto saveMaterialQuotation(MaterialQuotationRequestDto dto) {
        MaterialQuotation quotation = new MaterialQuotation();

        // 1️⃣ Set all basic fields
        quotation.setQuatationNo(dto.getQuatationNo()); // temporary, will update later
        quotation.setQuatationDate(dto.getQuatationDate());
        quotation.setNote(dto.getNote());
        quotation.setGst(dto.getGst());
        
        quotation.setSubTotal(dto.getSubTotal());
        quotation.setGstAmt(dto.getGstAmt());
        quotation.setGrandTotal(dto.getGrandTotal());
        
        WorkPeriod workPeriod = null;
        
        if(dto.getWorkPeriodId()!=null) {
        	workPeriod = workPeriodRepository.findById(dto.getWorkPeriodId()).get();
        }
        
        quotation.setWorkPeriodEntity(workPeriod);
        quotation.setIsFinal(dto.getIsFinal() ? 1 : 0);
        quotation.setQuotFinalDate(dto.getQuotFinalDate());

        // 2️⃣ Set relationships
        if (dto.getJobId() != null)
            quotation.setAmcJob(amcJobRepository.findById(dto.getJobId()).orElse(null));

        if (dto.getJobRenewlId() != null)
            quotation.setAmcRenewalJob(amcRenewalJobRepository.findById(dto.getJobRenewlId()).orElse(null));

        // 3️⃣ Map detail list
        if (dto.getDetails() != null) {
            quotation.setDetails(dto.getDetails().stream().map(detailDto -> {
                QuotationDetail detail = new QuotationDetail();
                detail.setMaterialName(detailDto.getMaterialName());
                detail.setHsn(detailDto.getHsn());
                detail.setQuantity(detailDto.getQuantity());
                detail.setRate(detailDto.getRate());
                detail.setAmount(detailDto.getAmount());
                detail.setGuarantee(detailDto.getGuarantee());
                detail.setMaterialQuotation(quotation);
                return detail;
            }).collect(Collectors.toList()));
        }

        // 4️⃣ Save first to generate ID
        MaterialQuotation saved = materialQuotationRepository.save(quotation);

        // 5️⃣ Generate formatted quotation number
        String formattedNo = generateQuotationNo(saved.getModQuotId());

        // 6️⃣ Update quotation number
        saved.setQuatationNo(formattedNo);
        MaterialQuotation updated = materialQuotationRepository.save(saved);
        
        if(dto.getIsFinal()==true) {
        	createMaterialInvoice(updated.getModQuotId());
        	
        }
        // 7️⃣ Return DTO
        return convertToResponseDto(updated);
    }
    
    private String generateQuotationNo(Integer id) {
        String prefix = "REPAIR";
        String year = String.valueOf(LocalDate.now().getYear());
        return prefix + "-" + year + "-" + String.format("%03d", id);
    }



    // 🔹 CONVERT ENTITY → DTO
    private MaterialQuotationResponseDto convertToResponseDto(MaterialQuotation entity) {
        MaterialQuotationResponseDto dto = new MaterialQuotationResponseDto();

        dto.setModQuotId(entity.getModQuotId());
        dto.setQuatationNo(entity.getQuatationNo());
        dto.setQuatationDate(entity.getQuatationDate());
        dto.setNote(entity.getNote());
        dto.setGst(entity.getGst());
        dto.setWorkPeriod(entity.getWorkPeriodEntity().getName());
        dto.setIsFinal(entity.getIsFinal());
        dto.setQuotFinalDate(entity.getQuotFinalDate());
        
        dto.setSubTotal(entity.getSubTotal());
        dto.setGstPercentage(entity.getGst());
        dto.setGstAmount(entity.getGstAmt());   
        dto.setGrandTotal(entity.getGrandTotal());      
        
        dto.setWorkPeriods(workPeriodService.getAllWorkPeriods());       
        
        // NOTE: This assumes companySettingRepository.findAll() returns at least one element.
        CompanySetting companySetting =	companySettingRepository.findAll().get(0);

        double gst = companySetting.getGstRateAmcTotalPercentage();

        String hsnCode = companySetting.getSacCodeMaterialRepairLabor();
        
        dto.setStaticHsnCode(hsnCode);
        ;
        dto.setJobNo(entity.getAmcJob() != null ? entity.getAmcJob().getJobNo() : null);
        
        String customerName = "";
        String siteName = "";
        		
        AmcJob amcJob = entity.getAmcJob();
        AmcRenewalJob amcRenewalJob = entity.getAmcRenewalJob();
        
        if(amcJob!=null) {
        	customerName = amcJob.getCustomer().getCustomerName();
        	siteName = amcJob.getSite().getSiteName();
        	
        }else {
        	
        	customerName = amcRenewalJob.getCustomer().getCustomerName();
        	siteName = amcRenewalJob.getSite().getSiteName();
        	
        }
        
//        dto.setCustomerName(entity.getAmcJob() != null ? entity.getAmcJob().getCustomer().getCustomerName(): null);
//        dto.setSiteName(entity.getAmcJob() != null ? entity.getAmcJob().getSite().getSiteName(): null);

        dto.setCustomerName(customerName);
        dto.setSiteName(siteName);


        dto.setRenewalJobNo(entity.getAmcRenewalJob() != null ? entity.getAmcRenewalJob().getJobNo() : null);

        if (entity.getDetails() != null) {
            dto.setDetails(entity.getDetails().stream().map(d -> {
                QuotationDetailResponseDto qd = new QuotationDetailResponseDto();
                qd.setModQuotDetailId(d.getModQuotDetailId());
                qd.setMaterialName(d.getMaterialName());
                qd.setHsn(d.getHsn());
                qd.setQuantity(d.getQuantity());
                qd.setRate(d.getRate());
                qd.setAmount(d.getAmount());
                qd.setGuarantee(d.getGuarantee());
                return qd;
            }).collect(Collectors.toList()));
        }

        return dto;
    }

    public ResponseEntity<MaterialQuotationRequestGetData> getMaterialQuotationRequestGetData() {
        // The existing business logic is correct:
        MaterialQuotationRequestGetData materialQuotationRequestGetData = 
                new MaterialQuotationRequestGetData();

        List<WorkPeriod> periods = workPeriodService.getAllWorkPeriods();

        // NOTE: This assumes companySettingRepository.findAll() returns at least one element.
        CompanySetting companySetting =	companySettingRepository.findAll().get(0);

        double gst = companySetting.getGstRateAmcTotalPercentage();

        String hsnCode = companySetting.getSacCodeMaterialRepairLabor();

        materialQuotationRequestGetData.setGst(gst);
        materialQuotationRequestGetData.setHsnCode(hsnCode);
        materialQuotationRequestGetData.setWorkPeriods(periods);

        // --- CORRECTION APPLIED HERE ---
        // 1. You need to pass the object (materialQuotationRequestGetData) to the .body() method.
        // 2. The type in ResponseEntity's constructor should not be present with .ok().
        return ResponseEntity.ok(materialQuotationRequestGetData); 
        // This is the common and most concise way to return a 200 OK status with a body.
        
        // An alternative correct way would be:
        // return new ResponseEntity<>(materialQuotationRequestGetData, HttpStatus.OK);
    }

	public MaterialRepairQuatationPdfData getMaterialRepairQuatationPdfData(Integer materialQuatationId) {
        // --- Fetch Invoice ---
		MaterialQuotation materialQuotation = materialQuotationRepository.findById(materialQuatationId)
                .orElseThrow(() -> new RuntimeException("materialQuatationId not found with ID: " + materialQuatationId));

        // --- Company Settings ---
        CompanySetting companySetting = companySettingRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Company settings not configured"));

        // --- Customer & Site handling (prefer renewal if available) ---
        Customer customer = null;
        Site site = null;

        if (materialQuotation.getAmcRenewalJob() != null) {
            customer = materialQuotation.getAmcRenewalJob().getCustomer();
            site = materialQuotation.getAmcRenewalJob().getSite();
        } else if (materialQuotation.getAmcJob() != null) {
            customer = materialQuotation.getAmcJob().getCustomer();
            site = materialQuotation.getAmcJob().getSite();
        }

        if (customer == null || site == null) {
            throw new RuntimeException("Customer or Site not found for Invoice ID: " + materialQuatationId);
        }

        // --- GST Calculations ---
        Double subTotal = materialQuotation.getSubTotal(); // assuming it returns a Double
        BigDecimal baseAmount = new BigDecimal(String.valueOf(subTotal));
        
        Double gstHalf = companySetting.getGstRateAmcTotalPercentage() / 2;

        BigDecimal CGST_Amount = calculateTaxAmount(baseAmount, gstHalf);
        BigDecimal SGST_Amount = calculateTaxAmount(baseAmount, gstHalf);

        // --- Total & Round-Off ---
        BigDecimal totalWithTax = baseAmount.add(CGST_Amount).add(SGST_Amount);
        Map<String, BigDecimal> roundData = calculateRoundOff(totalWithTax);

        BigDecimal roundedGrandTotal = roundData.get("roundedTotal");
        BigDecimal roundOffValue = roundData.get("roundOffValue");

        // --- Amount in Words ---
        String amountInWords = convertAmountToWords(roundedGrandTotal);
        
        

        // --- Build DTO ---
     // --- Build DTO ---
     // --- Build DTO ---
        MaterialRepairQuatationPdfData pdfData = MaterialRepairQuatationPdfData.builder()
                .companyName(companySetting.getCompanyName())
                .officeAddress(companySetting.getOfficeAddressLine1())
                .GSTIN_UIN(companySetting.getCompanyGst())
                .contactNo(companySetting.getOfficeNumber())
                .email(companySetting.getCompanyMail())
                .invoiceNo(materialQuotation.getQuatationNo())
                .dated(materialQuotation.getQuatationDate())
                .purchaseOrderNo("")
                .purchaseOrderNoDated(null)
                .deliveryChallanNo("")
                .deliveryChallanNoDated(null)

                .buyerAddress(site.getSiteAddress())
                .gstin("")
                .buyerContactNo(customer.getContactNumber())

                .siteName(site.getSiteName())
                .siteAddress(site.getSiteAddress())

                // --- Material Details (from DB) ---
                .materialDetails(
                    materialQuotation.getDetails().stream()
                        .map(detail -> MaterialRepairQuatationPdfData.MaterialDetails.builder()
                                .particulars(detail.getMaterialName())
                                .hsnSac(detail.getHsn())
                                .quantity(detail.getQuantity())
                                .rate(detail.getRate())
                                .per("Nos") // adjust if you have 'unit' or 'per' field
                                .amount(detail.getAmount())
                                .build()
                        )
                        .toList()
                )

                .subTotal(baseAmount)
                .cgstStr(getCgstStr(companySetting))
                .sgstStr(getSgstStr(companySetting))
                .cgstAmount(CGST_Amount)
                .sgstAmount(SGST_Amount)
                .roundOffValue(roundOffValue)
                .grandTotal(roundedGrandTotal)
                .amountChargeableInWords(amountInWords)

                .name(companySetting.getBankName())
                .accountNumber(companySetting.getAccountNumber())
                .branch(companySetting.getBranchName())
                .ifscCode(companySetting.getIfscCode())
                .forCompany(companySetting.getCompanyName())
                .build();

        return pdfData;

        
	}
	
	

    
    private String getCgstStr(CompanySetting companySetting) {
        double totalGst = companySetting.getGstRateAmcTotalPercentage();
        return "CGST @ " + (totalGst / 2) + "%";
    }

    private String getSgstStr(CompanySetting companySetting) {
        double totalGst = companySetting.getGstRateAmcTotalPercentage();
        return "SGST @ " + (totalGst / 2) + "%";
    }

    private BigDecimal calculateTaxAmount(BigDecimal baseAmount, Double percentage) {
        if (baseAmount == null || percentage == null) return BigDecimal.ZERO;
        BigDecimal rate = BigDecimal.valueOf(percentage)
                .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
        return baseAmount.multiply(rate).setScale(2, RoundingMode.HALF_UP);
    }

    private Map<String, BigDecimal> calculateRoundOff(BigDecimal totalWithTax) {
        BigDecimal roundedGrandTotal = totalWithTax.setScale(0, RoundingMode.HALF_UP);
        BigDecimal roundOffValue = roundedGrandTotal.subtract(totalWithTax)
                .setScale(2, RoundingMode.HALF_UP);

        Map<String, BigDecimal> result = new HashMap<>();
        result.put("roundedTotal", roundedGrandTotal);
        result.put("roundOffValue", roundOffValue);
        return result;
    }

    private String convertAmountToWords(BigDecimal amount) {
        if (amount == null) return "";
        long rupees = amount.longValue();
        int paise = amount.remainder(BigDecimal.ONE)
                          .multiply(BigDecimal.valueOf(100))
                          .intValue();

        String words = "Rupees " + numberToWords(rupees);
        if (paise > 0) {
            words += " and " + numberToWords(paise) + " Paise";
        }
        return words + " Only";
    }

    private String numberToWords(long number) {
        String[] units = {
            "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
            "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen",
            "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
        };

        String[] tens = {
            "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
        };

        if (number == 0) return "Zero";

        StringBuilder words = new StringBuilder();

        if ((number / 10000000) > 0) {
            words.append(numberToWords(number / 10000000)).append(" Crore ");
            number %= 10000000;
        }
        if ((number / 100000) > 0) {
            words.append(numberToWords(number / 100000)).append(" Lakh ");
            number %= 100000;
        }
        if ((number / 1000) > 0) {
            words.append(numberToWords(number / 1000)).append(" Thousand ");
            number %= 1000;
        }
        if ((number / 100) > 0) {
            words.append(numberToWords(number / 100)).append(" Hundred ");
            number %= 100;
        }

        if (number > 0) {
            if (words.length() > 0) words.append("and ");
            if (number < 20) {
                words.append(units[(int) number]);
            } else {
                words.append(tens[(int) (number / 10)]);
                if ((number % 10) > 0)
                    words.append(" ").append(units[(int) (number % 10)]);
            }
        }

        return words.toString().trim();
    }


    public void createMaterialRepairInvoice(Integer materialRepairQuotationId) {
    	
    	AmcInvoiceRequestDto amcInvoiceRequestDto = buildAmcInvoiceDto(materialRepairQuotationId);
        
    	amcInvoiceService.saveInvoice(amcInvoiceRequestDto);
    }
    
    public AmcInvoiceRequestDto buildAmcInvoiceDto(Integer materialRepairQuotationId) {
    	
    	AmcInvoiceRequestDto amcInvoiceRequestDto = 
    			new AmcInvoiceRequestDto();
    	
    	MaterialQuotation materialQuotation = materialQuotationRepository.findById(materialRepairQuotationId).get();
    	
    	
    	EnquiryType enquiryType = null;
    			
        AmcJob amcJob = materialQuotation.getAmcJob();
    	
    	AmcRenewalJob amcRenewalJob = materialQuotation.getAmcRenewalJob();
    	
    	CombinedEnquiry combinedEnquiry = null;
    	
    	if(amcJob == null) {
    		amcJob = amcRenewalJob.getPreJobId();

    	}
    	
    	if(amcJob!=null) {
    		
    		AmcQuotation amcQuotation = amcJob.getAmcQuotation();
    		RevisedAmcQuotation revisedAmcQuotation = amcJob.getRevisedAmcQuotation();
    				
    		if(amcQuotation!=null)    			
    			combinedEnquiry = amcQuotation.getCombinedEnquiry();
    		else 
    			combinedEnquiry = revisedAmcQuotation.getCombinedEnquiry();
  				
    	}
    	
    	enquiryType = combinedEnquiry.getEnquiryType();
    	
    	amcInvoiceRequestDto.setTotalAmt(BigDecimal.valueOf(materialQuotation.getGrandTotal()));
    	amcInvoiceRequestDto.setEnquiryType(enquiryType);
    	amcInvoiceRequestDto.setMaterialQuotation(materialQuotation);
    	amcInvoiceRequestDto.setIsCleared(0);
    	
    	LocalDate invoiceDate = LocalDate.now();
    	
    	amcInvoiceRequestDto.setInvoiceDate(invoiceDate);
    	
    	Integer nextInvoiceId = invoiceRepository.findMaxInvoiceId() + 1;
        String currentYear = String.valueOf(Year.now().getValue());
        String formattedInvoiceNo = String.format("INV-%s-%04d", currentYear, nextInvoiceId);

       
        amcInvoiceRequestDto.setInvoiceNo(formattedInvoiceNo);
        
        return amcInvoiceRequestDto;

    }

	  @Transactional
    public boolean updateIsFinalStatus(Integer id, Boolean isFinal) {
        Optional<MaterialQuotation> optional = materialQuotationRepository.findById(id);
        if (optional.isPresent()) {
        	MaterialQuotation materialQuotation = optional.get();
        	LocalDate now = LocalDate.now();
        	
        	materialQuotation.setIsFinal(1);
        	materialQuotation.setQuotFinalDate(now);
        	materialQuotationRepository.save(materialQuotation);
            
        	createMaterialInvoice(id);
            
            return true;
        }
        return false;
    }
	
//	  @Data
//	  public class JobDropdownForAddPayment {
//	  	
//	  	 Integer jobId ;
//	       String customerName;
//	       String siteName;
//	       String mailId;
//
//	  }
//	
	
      public List<JobDropdownForAddPayment> getDropdownForAddPayments(){
		  
		  List<MaterialQuotation> materialQuotations = materialQuotationRepository.findAll().stream().filter((q)->{
			  
			  if(q.getIsFinal()==1) {
				  return true;
			  }
			  return false;
		  }).collect(Collectors.toList());
		  
		 List<JobDropdownForAddPayment> dropdownForAddPayments = materialQuotations.stream().map((q)->{
			 
			 JobDropdownForAddPayment dropdownForAddPayment = new JobDropdownForAddPayment();
			 
			 dropdownForAddPayment.setMaterialRepairQid(q.getModQuotId());
			 
			 String customerName = "";
			 String siteName = "";
			 String mailId = "";
			 Integer materialQId = q.getModQuotId();
			 
			 AmcJob amcJob = q.getAmcJob();
			 AmcRenewalJob amcRenewalJob = q.getAmcRenewalJob();
			 
			 Customer customer = null;
			 Site site = null;
			 
			 if(amcJob!=null) {
				 
				 customer = amcJob.getCustomer();
				 site = amcJob.getSite();
				 mailId = amcJob.getLead().getEmailId();
				 
			 }else {
				 customer = amcRenewalJob.getCustomer();
				 site = amcRenewalJob.getSite();
				 
				 mailId = amcRenewalJob.getLead().getEmailId();
				 
			 }
			 
			 customerName = customer.getCustomerName();
			 siteName = site.getSiteName();
			 
			 
			 dropdownForAddPayment.setCustomerName(customerName);
			 dropdownForAddPayment.setSiteName(siteName);
			 dropdownForAddPayment.setMaterialRepairQid(materialQId);
			 dropdownForAddPayment.setMailId(mailId);	 
			 
			 
			 return dropdownForAddPayment;
			 
		 }).collect(Collectors.toList());	
		 
		 return dropdownForAddPayments;

      }

      @Transactional
      public MaterialQuotationResponseDto updateMaterialQuotation(Integer id, MaterialQuotationUpdateRequestDto dto) {
          // 1. Fetch existing entity
          MaterialQuotation existingQuot = materialQuotationRepository.findById(id)
                  .orElseThrow(() -> new ResourceNotFoundException("Quotation not found with id: " + id));

          // 2. Update basic fields
          existingQuot.setQuatationDate(dto.getQuatationDate());
          existingQuot.setNote(dto.getNote());
          existingQuot.setGst(dto.getGst());
          existingQuot.setIsFinal(dto.getIsFinal());
          existingQuot.setQuotFinalDate(dto.getIsFinal() == 1 ? dto.getQuotFinalDate() : null);
          existingQuot.setSubTotal(dto.getSubTotal());
          existingQuot.setGstAmt(dto.getGstAmt());
          existingQuot.setGrandTotal(dto.getGrandTotal());

          // 3. Update Work Period Relationship
          WorkPeriod wp = workPeriodRepository.findById(dto.getWorkPeriodId()).get();          
          
          existingQuot.setWorkPeriodEntity(wp);

          // 4. Update Details (Orphan Removal will handle the deletion of old records)
          existingQuot.getDetails().clear(); // Clear existing list
          
          List<QuotationDetail> newDetails = dto.getDetails().stream().map(d -> {
              QuotationDetail detail = new QuotationDetail();
              detail.setMaterialName(d.getMaterialName());
              detail.setHsn(d.getHsn());
              detail.setQuantity(d.getQuantity());
              detail.setRate(d.getRate());
              detail.setAmount(d.getAmount());
              detail.setGuarantee(d.getGuarantee());
              detail.setMaterialQuotation(existingQuot); // Maintain Back-reference
              return detail;
          }).collect(Collectors.toList());

          existingQuot.getDetails().addAll(newDetails);

          // 5. Save and Return Map to DTO
          MaterialQuotation saved = materialQuotationRepository.save(existingQuot);
          
          if(dto.getIsFinal() == 1 ) {
          	createMaterialInvoice(saved.getModQuotId());
          	
          }
          
          return convertToResponseDto(saved); 
      }

      @Transactional
      public void deleteQuotation(Integer id) {
          // 1. Check if it exists
          MaterialQuotation quotation = materialQuotationRepository.findById(id)
                  .orElseThrow(() -> new ResourceNotFoundException("Quotation not found with id: " + id));

          // 2. Perform deletion
          // Due to CascadeType.ALL on details, this will clean up the child table automatically
          materialQuotationRepository.delete(quotation);
          
          log.info("Successfully deleted Quotation ID: {}", id);
      }
      
      
      public void createMaterialInvoice(Integer materialQuotationId) {
      	
      	AmcInvoiceRequestDto amcInvoiceRequestDto = buildInvoiceDtoForMaterialQuotation(materialQuotationId);
          
      	amcInvoiceService.saveInvoice(amcInvoiceRequestDto);
      }
      
      public AmcInvoiceRequestDto buildInvoiceDtoForMaterialQuotation(Integer materialQuotationId) {
      	
      	AmcInvoiceRequestDto amcInvoiceRequestDto = 
      			new AmcInvoiceRequestDto();
      	
      	MaterialQuotation materialQuotation = materialQuotationRepository.findById(materialQuotationId).get();
      	
      	EnquiryType enquiryType =
      	        enquiryTypeRepository.findByEnquiryTypeName("AMC");
      	
      	amcInvoiceRequestDto.setTotalAmt(
      	        BigDecimal.valueOf(materialQuotation.getGrandTotal())
      	);
      	amcInvoiceRequestDto.setEnquiryType(enquiryType);
      	amcInvoiceRequestDto.setMaterialQuotation(materialQuotation);
      	amcInvoiceRequestDto.setIsCleared(0);
      	
      	LocalDate invoiceDate = LocalDate.now();
      	
      	amcInvoiceRequestDto.setInvoiceDate(invoiceDate);
      	
      	Integer nextInvoiceId = invoiceRepository.findMaxInvoiceId() + 1;
          String currentYear = String.valueOf(Year.now().getValue());
          String formattedInvoiceNo = String.format("INV-%s-%04d", currentYear, nextInvoiceId);

         
          amcInvoiceRequestDto.setInvoiceNo(formattedInvoiceNo);
          
          return amcInvoiceRequestDto;

      }
	
	
    
}

