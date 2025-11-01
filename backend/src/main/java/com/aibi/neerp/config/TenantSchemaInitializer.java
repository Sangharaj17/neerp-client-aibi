package com.aibi.neerp.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TenantSchemaInitializer {

    private final JdbcTemplate jdbcTemplate;
    private final DataSource dataSource; // DynamicRoutingDataSource

    // Cache to avoid running initializer repeatedly per tenant
    private final Set<String> initializedTenants = ConcurrentHashMap.newKeySet();

    @Autowired
    public TenantSchemaInitializer(JdbcTemplate jdbcTemplate, javax.sql.DataSource dataSource) {
        this.jdbcTemplate = jdbcTemplate;
        this.dataSource = dataSource;
    }

    public boolean isInitialized() {
        try {
            // 1) Robust check: total user tables count
            Integer tableCount = jdbcTemplate.queryForObject(
                    "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type='BASE TABLE'",
                    Integer.class);
            if (tableCount != null && tableCount > 15) {
                return true;
            }

            // 2) Fallback: presence of a post-login domain entity table
            String existsSql = "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema='public' AND table_name = 'tbl_capacity_type')";
            Boolean exists = jdbcTemplate.queryForObject(existsSql, Boolean.class);
            return Boolean.TRUE.equals(exists);
        } catch (Exception e) {
            return false;
        }
    }

    @Transactional
    public void initializeIfRequired(String tenantId) {
        if (tenantId == null || tenantId.isBlank()) return;
        if (initializedTenants.contains(tenantId)) return;
        if (isInitialized()) {
            initializedTenants.add(tenantId);
            return;
        }

        // Bootstrap a temporary EMF with ddl-auto=update for current tenant routing
        System.out.println("[TenantInit] Initializing schema for tenant: " + tenantId);
        LocalContainerEntityManagerFactoryBean emfBean = new LocalContainerEntityManagerFactoryBean();
        emfBean.setDataSource(dataSource);
        emfBean.setPackagesToScan("com.aibi.neerp");
        emfBean.setJpaVendorAdapter(new HibernateJpaVendorAdapter());

        Properties jpaProps = new Properties();
        // Force schema update for the currently routed tenant
        jpaProps.put("hibernate.hbm2ddl.auto", "update");
        jpaProps.put("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
        // Quieter logs
        jpaProps.put("hibernate.show_sql", "false");
        emfBean.setJpaProperties(jpaProps);

        try {
            emfBean.afterPropertiesSet(); // build
            // Touch the metamodel to force initialization
            emfBean.getObject().getMetamodel().getEntities();
            initializedTenants.add(tenantId);
            System.out.println("[TenantInit] Schema initialized/updated for tenant: " + tenantId + " (tables count may increase on next access)");
        } finally {
            try {
                if (emfBean.getObject() != null) {
                    emfBean.getObject().close();
                }
            } catch (Exception ignore) {}
        }
    }
}


