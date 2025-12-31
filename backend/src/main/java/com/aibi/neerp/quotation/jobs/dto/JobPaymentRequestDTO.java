package com.aibi.neerp.quotation.jobs.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSetter;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true) // ✅ ignores invoiceNo, renewalJobId
public class JobPaymentRequestDTO {

    @NotNull(message = "Job ID is required")
    private Integer jobId;

    @NotNull(message = "Invoice ID is required")
    private Integer invoiceId;

    @NotNull(message = "Payment date is required")
    private LocalDate paymentDate;

    @NotNull(message = "Amount paid is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amountPaid;

    @NotBlank(message = "Payment type is required")
    private String paymentType; // CASH / CHEQUE / NEFT / RTGS

    private String chequeNo;
    private String bankName;
    private String branchName;

    private String payFor;

    // Optional override (mostly auto-calculated)
    private Boolean paymentCleared;

    private Integer createdBy;

    @JsonSetter("paymentCleared")
    public void setPaymentCleared(Object value) {
        if (value == null) {
            this.paymentCleared = null;
        } else if (value instanceof Boolean) {
            this.paymentCleared = (Boolean) value;
        } else {
            this.paymentCleared =
                    "yes".equalsIgnoreCase(value.toString());
        }
    }

    /**
     * Normalize paymentType (Cheque → CHEQUE)
     */
    @JsonSetter("paymentType")
    public void setPaymentType(String paymentType) {
        this.paymentType =
                paymentType != null ? paymentType.toUpperCase() : null;
    }
}
