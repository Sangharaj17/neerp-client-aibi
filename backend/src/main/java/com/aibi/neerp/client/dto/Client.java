package com.aibi.neerp.client.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Client {
    private Long id;
    private String clientName;
    private String domain;
    private String dbUrl;
    private String dbUsername;
    private String dbPassword;
    private Boolean isActive;

    @Override
    public String toString() {
        return "Client{" +
                "id=" + id +
                ", clientName='" + clientName + '\'' +
                ", domain='" + domain + '\'' +
                ", dbUrl='" + dbUrl + '\'' +
                ", dbUsername='" + dbUsername + '\'' +
                ", dbPassword='" + dbPassword + '\'' +
                ", isActive=" + isActive +
                '}';
    }
}
