package com.aibi.neerp.config;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

public class DynamicRoutingDataSource extends AbstractRoutingDataSource {
    @Override
    protected Object determineCurrentLookupKey() {
        System.out.println("Routing to tenant Id =====>"+TenantContext.getTenantId());
        return TenantContext.getTenantId();  // Uses domain as tenant identifier
    }
}
