package com.aibi.neerp.amc.quatation.pdf.dto;


import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LetterDetails {

    private String to;
    private String address;
    private String pinCode;
    private String attentionPerson;
    private String phone;
}

