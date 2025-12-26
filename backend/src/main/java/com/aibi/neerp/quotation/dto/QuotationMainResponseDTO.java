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
    private Integer edition;
    private Double totalAmount;
    private String status;
    private Integer parentQuotationId;   // For displaying history chain
    private String remarks;
    private Integer jobStatus;

    // 🔹 Lead & Enquiry
    private Integer leadId;
    private String leadTypeId;
    private LocalDateTime leadDate;
    private Integer combinedEnquiryId;
    private Integer enquiryTypeId;

    // 🔹 Customer & Site
    private String customerName;
    private Integer customerId;
    private String customerAdder;
    private String customerStd;
    private String contactNumber;
    private String contactNumber1;
    private String salutations1;

    private String customerName2;
    private String contactNumber2;
    private String salutations2;

    private String siteName;
    private Integer siteId;
    private String siteAdder;

    // 🔹 Created / Approved info
    private String employeeContactNumber;
    private Integer employeeRoleId;
    private String employeeRoleName;

    private Integer createdByEmployeeId;
    private String createdByEmployeeName;
    private LocalDateTime createdAt;

    private String executiveName;

    private Boolean isFinalized;
    private Integer finalizedByEmployeeId;
    private String finalizedByEmployeeName;
    private LocalDateTime finalizedAt;

    private Boolean isDeleted;
    private Integer deletedByEmployeeId;
    private String deletedByEmployeeName;
    private LocalDateTime deletedAt;

    private Boolean isSuperseded;
    private Integer supersededByEmployeeId;
    private String supersededByEmployeeName;
    private LocalDateTime supersededAt;

    // 🔹 Finalization check for revision group
    private Boolean hasAnyRevisionFinalized; // True if this quotation or any of its revisions are finalized

    // 🔹 Child details
    private List<QuotationLiftDetailResponseDTO> liftDetails;
//    private List<SelectedMaterialResponseDTO> selectedMaterials;
}

