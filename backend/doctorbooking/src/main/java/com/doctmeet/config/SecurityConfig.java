package com.doctmeet.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http)
            throws Exception {

        http

                // CORS ENABLE
                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                // DISABLE CSRF
                .csrf(csrf -> csrf.disable())

                // DISABLE FORM LOGIN
                .formLogin(form -> form.disable())

                // DISABLE BASIC AUTH
                .httpBasic(basic -> basic.disable())

                // AUTHORIZATION RULES
                .authorizeHttpRequests(auth -> auth


                        // PUBLIC APIs
                        .requestMatchers(
                                "/auth/**",
                                "/doctor-request/**"
                        ).permitAll()

                        // PUBLIC DOCTOR APIs
                        .requestMatchers(
                                HttpMethod.GET,
                                "/doctors",
                                "/doctors/categories"
                        ).permitAll()

                        .requestMatchers(
                                "/appointments/book",
                                "/appointments/available"
                        )
                        .authenticated()

                        // DOCTOR APIs
                        .requestMatchers(
                                "/doctors/my-appointments"
                        ).hasRole("DOCTOR")


                        // ADMIN APIs
                        .requestMatchers("/admin/**")
                        .hasRole("ADMIN")

                        // EVERYTHING ELSE
                        .anyRequest()
                        .authenticated()
                )

                // JWT FILTER
                .addFilterBefore(
                        new JwtFilter(),
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    // CORS CONFIGURATION
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE")
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}