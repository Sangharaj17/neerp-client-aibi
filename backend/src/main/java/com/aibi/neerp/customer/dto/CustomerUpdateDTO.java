package com.aibi.neerp.customer.dto;

import lombok.Data;

@Data
public class CustomerUpdateDTO {
    private String customerName;
    private String emailId;
    private String contactNumber;
    private String gstNo;
    private String address;
}
