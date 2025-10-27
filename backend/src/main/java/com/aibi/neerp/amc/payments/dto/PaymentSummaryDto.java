// PaymentSummaryDto.java

package com.aibi.neerp.amc.payments.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentSummaryDto {
    private long totalPaymentsCount;
    private long clearedPaymentsCount;
    private long unclearedPaymentsCount;
    private BigDecimal totalClearedAmount;
    private List<PaymentTypeCount> paymentTypeCounts;
}
