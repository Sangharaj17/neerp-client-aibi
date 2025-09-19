package com.aibi.neerp.config;

public class TenantContext {
    private static final ThreadLocal<String> CURRENT_TENANT = new ThreadLocal<>();

//    public static void setCurrentTenant(String tenant) {
//        CURRENT_TENANT.set(tenant);
//    }
//
//    public static String getCurrentTenant() {
//        return CURRENT_TENANT.get();
//    }

    public static void setTenantId(String tenantId) {
        System.out.println("🔐 Setting tenant ID to: " + tenantId);
        CURRENT_TENANT.set(tenantId);
    }

    public static String getTenantId() {
        return CURRENT_TENANT.get();
    }


    public static void clear() {
        System.out.println("🧹 Clearing TenantContext");
        CURRENT_TENANT.remove();
    }
}
