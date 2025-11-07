package com.aibi.neerp.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    private final TenantDefaultDataInitializer tenantDefaultDataInitializer;

    public DataInitializer(TenantDefaultDataInitializer tenantDefaultDataInitializer) {
        this.tenantDefaultDataInitializer = tenantDefaultDataInitializer;
    }

    @Bean
    public ApplicationRunner initData() {
        return args -> tenantDefaultDataInitializer.initializeDefaults();
    }
}
