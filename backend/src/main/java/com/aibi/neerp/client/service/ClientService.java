package com.aibi.neerp.client.service;

import com.aibi.neerp.client.dto.Client;
import com.aibi.neerp.client.dto.ClientWithModulesResponse;
import com.aibi.neerp.exception.CustomSubscriptionException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.DeserializationFeature;
import org.springframework.beans.factory.annotation.Value;
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
    
    @Value("${tenant.service.base-url:http://localhost:8081}")
    private String tenantServiceBaseUrl;

    public Client getClientByDomain(String domain) {
        String url = tenantServiceBaseUrl + "/api/clients/domain/" + domain;
        try {
            System.out.println("[TenantSvc] GET " + url);
            ResponseEntity<String> resp = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    String.class
            );
            System.out.println("[TenantSvc] Status: " + resp.getStatusCode());
            System.out.println("[TenantSvc] Headers: " + resp.getHeaders());
            System.out.println("[TenantSvc] Body: " + resp.getBody());

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            // Parse leniently to avoid unknown fields
            com.fasterxml.jackson.databind.JsonNode node = mapper.readTree(resp.getBody());
            Client c = new Client();
            if (node.has("id")) c.setId(node.get("id").asLong());
            if (node.has("clientName")) c.setClientName(node.get("clientName").asText());
            if (node.has("domain")) c.setDomain(node.get("domain").asText());
            if (node.has("dbUrl")) c.setDbUrl(node.get("dbUrl").asText());
            if (node.has("dbUsername")) c.setDbUsername(node.get("dbUsername").asText());
            if (node.has("dbPassword")) c.setDbPassword(node.get("dbPassword").asText());
            if (node.has("isActive")) c.setIsActive(node.get("isActive").asBoolean());
            return c;
        } catch (HttpClientErrorException e) {
            System.out.println("[TenantSvc][HTTP] Status: " + e.getStatusCode());
            System.out.println("[TenantSvc][HTTP] Body: " + e.getResponseBodyAsString());
            e.printStackTrace();
            return null;
        } catch (Exception e) {
            System.out.println("[TenantSvc][ERR] " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    public ClientWithModulesResponse getClientWithModulesByDomain(String domain) {
        String url = tenantServiceBaseUrl + "/api/clients/domain/" + domain + "/with-subscription-check";
        try {
            System.out.println("[TenantSvc] GET " + url);
            ResponseEntity<String> resp = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    String.class
            );
            System.out.println("[TenantSvc] Status: " + resp.getStatusCode());
            System.out.println("[TenantSvc] Headers: " + resp.getHeaders());
            System.out.println("[TenantSvc] Body: " + resp.getBody());

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            Map<?, ?> body = mapper.readValue(resp.getBody(), Map.class);
            Client client = mapper.convertValue(body.get("client"), Client.class);
            List<String> modules = (List<String>) body.get("modules");

            return new ClientWithModulesResponse(client, modules);

        } catch (HttpClientErrorException e) {
            System.out.println("[TenantSvc][HTTP] Status: " + e.getStatusCode());
            System.out.println("[TenantSvc][HTTP] Body: " + e.getResponseBodyAsString());
            String errorJson = e.getResponseBodyAsString();
            throw new CustomSubscriptionException(errorJson, e.getStatusCode().value());
        } catch (Exception e) {
            System.out.println("[TenantSvc][ERR] " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}
