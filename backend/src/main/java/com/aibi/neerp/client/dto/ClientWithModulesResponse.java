package com.aibi.neerp.client.dto;

import lombok.*;

import java.util.List;

@Setter
@Getter
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientWithModulesResponse {
    private Client client;
    private List<String> modules;

    @Override
    public String toString() {
        return "ClientWithModulesResponse{" +
                "clientName='" + client + '\'' +
                ", modules=" + modules +
                '}';
    }
}
