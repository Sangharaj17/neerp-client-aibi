package com.aibi.neerp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class GlobalCorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

//        // Allow all localhost ports and subdomains in development
//        config.addAllowedOriginPattern("http://localhost:[*]");
//       config.addAllowedOriginPattern("http://*.localhost:[*]");
//
//        config.addAllowedOrigin("http://beta.localhost:3000"); // Add this specifically for testing
//
//        config.setAllowCredentials(true); // allow cookies
//        config.addAllowedHeader("*");
//        config.addAllowedMethod("*");
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", config);


        // ✅ Allow all subdomains of localhost on any port
        //config.addAllowedOriginPattern("http://*.localhost:*");
       // config.addAllowedOriginPattern("http://localhost:*");
        //config.addAllowedOriginPattern("http://*.localhost:3000");
        // ✅ Explicitly allow beta.localhost:3000
        //config.addAllowedOrigin("http://beta.localhost:3000");

       // config.addAllowedOriginPattern("http://*.localhost:3000"); // ✅ wildcard for all client domains
        //config.addAllowedOriginPattern("http://localhost:3000");   // ✅ plain localhost

        //config.addAllowedOriginPattern("http://*.localhost:3000");
        //config.addAllowedOriginPattern("http://localhost:*");
        //config.addAllowedOriginPattern("http://localhost:[*]");
        //config.addAllowedOriginPattern("http://*.localhost:[*]"); // For beta.localhost, acme.localhost etc.
        //config.addAllowedOriginPattern("http://localhost:3000"); // Specific for frontend dev server
        //config.addAllowedOrigin("http://beta.localhost:3000"); // Specific for beta.localhost dev server


        //config.addAllowedOriginPattern("http://*.localhost:3000");
        //config.addAllowedOriginPattern("http://localhost:3000");

        //config.addAllowedOrigin("http://localhost:3001");
        config.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:3001",
                "http://localhost:3002",
                "http://localhost:3003"
        ));
        config.setAllowCredentials(true); // ✅ to allow cookies
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
