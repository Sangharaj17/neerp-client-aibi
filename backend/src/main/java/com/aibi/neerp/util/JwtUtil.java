package com.aibi.neerp.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Generate a strong random secret key (in real apps, store in environment/config)
    private static final String SECRET = "supersecretkeyforsigningjwttokensandshouldbeatleast256bitlong!";

    private final long EXPIRATION = 1000 * 60 * 60; // 1 hour

    // ✅ Convert string to secure Key object
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    public String generateToken(Long userId, String username, String domain) {
        return Jwts.builder()
                .claim("userId", userId)
                .claim("username", username)
                .claim("domain", domain)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)  // ✅ updated usage
                .compact();
    }

    public Claims validateToken(String token) throws JwtException {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())  // ✅ updated usage
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
