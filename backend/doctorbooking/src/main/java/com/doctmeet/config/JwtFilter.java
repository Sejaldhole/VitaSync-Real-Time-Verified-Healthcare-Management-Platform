package com.doctmeet.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

public class JwtFilter extends OncePerRequestFilter {

    private static final String SECRET =
            "mysecretkeymysecretkeymysecretkey12";

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();

        // PUBLIC APIs
        if (
                path.equals("/auth/login")
                        || path.equals("/auth/register")
                        || path.startsWith("/doctor-request")
                        || path.equals("/doctors")
                        || path.equals("/doctors/categories")
        ) {

            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");

        // TOKEN MISSING
        if (header == null || !header.startsWith("Bearer ")) {

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

            response.getWriter().write("Token missing");

            return;
        }

        String token = header.substring(7);

        try {

            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(
                            Keys.hmacShaKeyFor(SECRET.getBytes())
                    )
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String email = claims.getSubject();

            String role = claims.get("role", String.class);

            // ROLE SET
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            List.of(
                                    new SimpleGrantedAuthority(
                                            "ROLE_" + role
                                    )
                            )
                    );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(auth);

        } catch (Exception e) {

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

            response.getWriter().write("Invalid token");

            return;
        }

        filterChain.doFilter(request, response);
    }
}