package com.aibi.neerp.login.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginRequest {
    private String email;
    private String password;
    private String domain;
    private String captchaSessionId;
    private String captchaInput;
}
