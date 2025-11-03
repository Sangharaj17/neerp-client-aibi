package com.aibi.neerp.config;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
@Order(1)  // Ensures this runs early before other filters (like JWT)
public class TenantFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        try {
            // 🔹 Extract tenant header (default: X-Tenant)
            String tenantId = request.getHeader("X-Tenant");

            if (tenantId != null && !tenantId.isBlank()) {
                TenantContext.setTenantId(tenantId);
                System.out.println("✅ Tenant ID set globally: " + tenantId);
            } else {
                System.out.println("⚠️ No tenant header found — default DB will be used");
            }

            // Continue request
            filterChain.doFilter(request, response);

        } finally {
            // Clear after request to avoid thread reuse problems
            TenantContext.clear();
        }
    }
}

