package com.aibi.neerp.config;

import com.aibi.neerp.client.dto.Client;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.*;
import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

import javax.sql.DataSource;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Configuration
public class DataSourceConfig {

    private final Map<Object, Object> dataSources = new ConcurrentHashMap<>();
    private DynamicRoutingDataSource routingDataSource;

    @Value("${spring.datasource.url}")
    private String defaultJdbcUrl;

    @Value("${spring.datasource.username}")
    private String defaultUsername;

    @Value("${spring.datasource.password}")
    private String defaultPassword;

    @Bean
    public AbstractRoutingDataSource dataSourceBean() {
        this.routingDataSource = new DynamicRoutingDataSource();
        this.routingDataSource.setTargetDataSources(dataSources);
        this.routingDataSource.setDefaultTargetDataSource(buildDummyDataSource());
        return this.routingDataSource;
    }

    private DynamicRoutingDataSource getRoutingDataSource() {
        if (this.routingDataSource == null) {
            throw new IllegalStateException("RoutingDataSource not initialized yet");
        }
        return this.routingDataSource;
    }

    public void addDataSource(String tenantId, Client client) {
        Object existing = dataSources.get(tenantId);

        if (existing instanceof HikariDataSource ds && !ds.isClosed()) {
            log.info("🔁 DataSource for tenant {} already exists. Skipping creation.", tenantId);
            return;
        }

        log.info("Creating new DataSource for tenant: {}", tenantId);
        System.out.println("Creating new DataSource for tenant:===> " + tenantId);

        //if (!dataSources.containsKey(tenantId)) {
        HikariDataSource ds = new HikariDataSource();
        System.out.println("new DataSource URl ===>" + client.getDbUrl());
        ds.setMaximumPoolSize(10);
        ds.setJdbcUrl(client.getDbUrl());
        ds.setUsername(client.getDbUsername());
        ds.setPassword(client.getDbPassword());
        ds.setDriverClassName("org.postgresql.Driver");
        dataSources.put(tenantId, ds);

        //DynamicRoutingDataSource routingDataSource = (DynamicRoutingDataSource) dataSource();
        //routingDataSource.setTargetDataSources(dataSources);
        getRoutingDataSource().setTargetDataSources(new ConcurrentHashMap<>(dataSources));
        getRoutingDataSource().afterPropertiesSet(); // Refresh
        //}
    }

    public void removeDataSource(String tenantId) {
        Object ds = dataSources.remove(tenantId);
        if (ds instanceof HikariDataSource hikari) {
            System.out.println("🧹 Closing datasource for tenant: " + tenantId);
            hikari.close();
        }

        // Refresh routing datasource
        //DynamicRoutingDataSource routingDataSource = (DynamicRoutingDataSource) dataSource();
        //routingDataSource.setTargetDataSources(dataSources);
        getRoutingDataSource().setTargetDataSources(new ConcurrentHashMap<>(dataSources));
        getRoutingDataSource().afterPropertiesSet();
    }

    private DataSource buildDummyDataSource() {
        HikariDataSource ds = new HikariDataSource();
        // Read the default datasource from application.properties
        ds.setJdbcUrl(defaultJdbcUrl);
        ds.setUsername(defaultUsername);
        ds.setPassword(defaultPassword);

        ds.setDriverClassName("org.postgresql.Driver");
        return ds;
    }


}