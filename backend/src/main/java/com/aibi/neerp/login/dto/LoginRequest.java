package com.aibi.neerp.login.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginRequest {
    // Getters and setters
    private String email;
    private String password;
    private String domain;
}
