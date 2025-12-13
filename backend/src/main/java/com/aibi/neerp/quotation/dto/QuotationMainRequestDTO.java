package com.aibi.neerp.quotation.dto;

import com.aibi.neerp.quotation.utility.QuotationStatus;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuotationMainRequestDTO {

    private Integer id;

    // 🔹 Basic info
    private String quotationNo;
    private LocalDateTime quotationDate;
    private Integer edition;
    private Double totalQuotationAmount;
    private QuotationStatus status;
    private String parentQuotationNo;
    private Boolean isFinalized;
    private String remarks;

    // 🔹 Lead and enquiry references
    private Integer leadId;
    private String leadTypeId;
    private LocalDateTime leadDate;
    private Integer combinedEnquiryId;
    private Integer enquiryTypeId;

    // 🔹 Customer and site info
    private String customerName;
    private Integer customerId;
    private String siteName;
    private Integer siteId;

    // 🔹 Audit info
    private Integer createdByEmployeeId;
    private Integer finalizedByEmployeeId;
    private Integer deletedByEmployeeId;

    // 🔹 Nested list of lift details (each lift quotation)
    private List<QuotationLiftDetailRequestDTO> liftDetails;

//    private List<SelectedMaterialRequestDTO> selectedMaterials;
}
