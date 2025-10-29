package com.aibi.neerp.amc.invoice.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class AmcInvoicePdfData {

	private String companyName;
	private String officeAddress;
	private String GSTIN_UIN;
	private String Contact_No;
	private String E_mail;
	private String Invoice_No;
	private LocalDate Dated;
	private String PurchaseOrderNo;
	private LocalDate PurchaseOrderNoDated;
	private String DeliveryChallanNo;
	private LocalDate DeliveryChallanNoDated;
	
	private String BuyerAddress;
	private String GSTIN;
	private String BuyerContactNo;
	
	//Site Name / Ship To
	private String sitename;
	private String siteaddress;
	
	private String Particulars;
	private String HSN_SAC;
	private Integer Quantity;
	private BigDecimal rate;
	private Integer per;
	private BigDecimal Amount;
	private BigDecimal SubTotal;
	private String CGST_Str;
	private String SGST_Str;
	private BigDecimal CGST_Amount;
	private BigDecimal SGST_Amount;
	private BigDecimal RoundOffValue;
	private BigDecimal GrandTotal;
	
	private String AmountChargeableInWords;
	
	// Bank Details :-
	private String Name;
	private String AccountNumber;
	private String Branch;
	private String IFSC_CODE;
	private String FOR;
	
	
	
	
	
	
	

}
