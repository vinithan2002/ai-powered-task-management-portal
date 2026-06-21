package com.TaskManager.TaskManager.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

@Component
public class JWTUtil {
    private final long EXPRIRATION_TIME = 1000*60*60;

    private final String SECRETE  = "sfnfkjneajfnejkwngjkdsjkgdsjnfjkdsskdsdse";
    private final SecretKey key = Keys.hmacShaKeyFor(SECRETE.getBytes());

    public String generateToken(String userName)
    {
        return Jwts.builder()
                .setSubject(userName)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPRIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }


    public String extractUserName(String token)
    {
        return extractClaims(token).getSubject();
    }

    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean validateToken(String username, UserDetails userDetails, String token)
    {
        return username.equals(userDetails.getUsername()) && iSTokenExpired(token);

    }

    private boolean iSTokenExpired(String token) {
        return extractClaims(token).getExpiration().after(new Date());
    }
}
