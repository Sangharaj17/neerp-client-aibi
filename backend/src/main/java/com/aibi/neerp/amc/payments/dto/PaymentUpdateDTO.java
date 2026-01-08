package com.aibi.neerp.amc.payments.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class PaymentUpdateDTO {
	
	private Integer paymentId;
    private LocalDate paymentDate;
    private String paymentClearedStatus;
    
    private String paymentType;
    private String chequeNoOrTransactionNo;
    private String bankName;
    private String branchName;

}
