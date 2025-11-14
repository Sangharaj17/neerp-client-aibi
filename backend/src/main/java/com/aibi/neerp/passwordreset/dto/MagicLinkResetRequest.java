package com.aibi.neerp.passwordreset.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MagicLinkResetRequest {
    private String token;
    private String password;
}

