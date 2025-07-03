package com.watana.backend.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component // Marks this class as a Spring component for detection
public class FirebaseAuthenticationFilter extends OncePerRequestFilter {

    private final FirebaseAuth firebaseAuth;

    @Autowired
    public FirebaseAuthenticationFilter(FirebaseAuth firebaseAuth) {
        this.firebaseAuth = firebaseAuth;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Get the Authorization header
        String authorizationHeader = request.getHeader("Authorization");

        // Check if the Authorization header exists and starts with "Bearer "
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String idToken = authorizationHeader.substring(7); // Extract the ID Token (skip "Bearer ")

            try {
                // Verify the Firebase ID Token
                FirebaseToken decodedToken = firebaseAuth.verifyIdToken(idToken);
                String uid = decodedToken.getUid(); // Get the user's UID

                // Create a UserDetails object for the authenticated user
                // You can customize roles and user information here
                UserDetails userDetails = User.builder()
                        .username(uid)
                        // Firebase tokens do not have passwords. Use an empty or null string.
                        .password("")
                        .authorities(Collections.singletonList(() -> "ROLE_USER")) // Assign a basic role, e.g., "ROLE_USER"
                        .build();

                // Create an authentication object and set it in the SecurityContext
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);

                System.out.println("User authenticated with Firebase UID: " + uid);

            } catch (FirebaseAuthException e) {
                // The token is invalid or has expired
                System.err.println("Firebase authentication error: " + e.getMessage());
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired Firebase token.");
                return; // Stop processing the filter chain if the token is invalid
            }
        }

        // Continue with the Spring Security filter chain
        filterChain.doFilter(request, response);
    }
}
