package com.aibi.neerp.client.service;

import com.aibi.neerp.exception.CustomSubscriptionException;
import com.aibi.neerp.client.dto.Client;
import com.aibi.neerp.client.dto.ClientWithModulesResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class ClientService {
    private final RestTemplate restTemplate = new RestTemplate();

    public Client getClientByDomain(String domain) {
        String url = "https://neerp-admin-aibi-backend.scrollconnect.com//api/clients/domain/" + domain;
        try {
            return restTemplate.getForObject(url, Client.class);
        } catch (Exception e) {
            return null;
        }
    }

    public ClientWithModulesResponse getClientWithModulesByDomain(String domain) {
        String url = "https://neerp-admin-aibi-backend.scrollconnect.com//api/clients/domain/" + domain + "/with-subscription-check";
//        try {
//            return restTemplate.getForObject(url, ClientWithModulesResponse.class);
//        } catch (Exception e) {
//            return null;
//        }
        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map>() {}
            );

            Map<?, ?> body = response.getBody();

            ObjectMapper objectMapper = new ObjectMapper(); // ✅ Add this
            Client client = objectMapper.convertValue(body.get("client"), Client.class);
            List<String> modules = (List<String>) body.get("modules");

            return new ClientWithModulesResponse(client, modules);

        } catch (HttpClientErrorException e) {
            String errorJson = e.getResponseBodyAsString();
            System.out.println("Error from tenant service: " + errorJson);
            throw new CustomSubscriptionException(errorJson, e.getStatusCode().value());
        }

    }

}
