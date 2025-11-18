package com.aibi.neerp.quotation.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuotationMainResponseDTO {

    private Integer id;
    private String quotationNo;
    private LocalDateTime quotationDate;
    private String edition;
    private Double totalAmount;
    private String status;
    private String remarks;

    // 🔹 Lead & Enquiry
    private Integer leadId;
    private String leadTypeId;
    private LocalDateTime leadDate;
    private Integer combinedEnquiryId;
    private Integer enquiryTypeId;

    // 🔹 Customer & Site
    private String customerName;
    private Integer customerId;
    private String siteName;
    private Integer siteId;

    // 🔹 Created / Approved info
    private Integer createdByEmployeeId;
    private String createdByEmployeeName;
    private LocalDateTime createdAt;
    private Boolean isFinalized;
    private Integer finalizedByEmployeeId;
    private String finalizedByEmployeeName;
    private LocalDateTime finalizedAt;
    private Boolean isDeleted;
    private Integer deletedByEmployeeId;
    private String deletedByEmployeeName;
    private LocalDateTime deletedAt;

    // 🔹 Child details
    private List<QuotationLiftDetailResponseDTO> liftDetails;
//    private List<SelectedMaterialResponseDTO> selectedMaterials;
}

