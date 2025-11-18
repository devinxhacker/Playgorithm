package com.super30.Playgorithm.service;

import com.super30.Playgorithm.dto.AdminSignupRequest;
import com.super30.Playgorithm.dto.AuthResponse;
import com.super30.Playgorithm.dto.LoginRequest;
import com.super30.Playgorithm.dto.SignupRequest;
import com.super30.Playgorithm.model.User;
import com.super30.Playgorithm.repository.UserRepository;
import com.super30.Playgorithm.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Value("${admin.signup.secret:}")
    private String adminSignupSecret;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, 
                      JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        User user = buildNewUser(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                request.getFullName(),
                List.of("ROLE_USER")
        );

        User savedUser = userRepository.save(user);
        UserDetails userDetails = buildUserDetails(savedUser);
        String token = jwtUtil.generateToken(userDetails);

        return buildAuthResponse(savedUser, token);
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticate(request);
        User user = getUserOrThrow(request.getUsername());
        return finalizeLogin(authentication, user);
    }

    public AuthResponse signupAdmin(AdminSignupRequest request) {
        if (!StringUtils.hasText(adminSignupSecret)) {
            throw new RuntimeException("Admin signup is disabled");
        }

        if (!Objects.equals(adminSignupSecret, request.getAdminSecret())) {
            throw new RuntimeException("Invalid admin secret");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        User adminUser = buildNewUser(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                request.getFullName(),
                List.of("ROLE_ADMIN", "ROLE_USER")
        );

        User savedUser = userRepository.save(adminUser);
        UserDetails userDetails = buildUserDetails(savedUser);
        String token = jwtUtil.generateToken(userDetails);
        return buildAuthResponse(savedUser, token);
    }

    public AuthResponse loginAdmin(LoginRequest request) {
        Authentication authentication = authenticate(request);
        User user = getUserOrThrow(request.getUsername());

        if (!hasAdminRole(user)) {
            throw new RuntimeException("User is not authorized as admin");
        }

        return finalizeLogin(authentication, user);
    }

    private Authentication authenticate(LoginRequest request) {
        return authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
    }

    private User getUserOrThrow(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private AuthResponse finalizeLogin(Authentication authentication, User user) {
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);

        return buildAuthResponse(user, token);
    }

    private User buildNewUser(String username, String email, String rawPassword, String fullName, List<String> roles) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setFullName(fullName != null ? fullName : username);
        user.setLevel(1);
        user.setTotalXP(0);
        user.setGamesPlayed(0);
        user.setGamesWon(0);
        user.setWinRate(0.0);
        user.setAchievementIds(new ArrayList<>());
        user.setRoles(new ArrayList<>(roles));
        user.setCreatedAt(LocalDateTime.now());
        user.setIsActive(true);
        return user;
    }

    private UserDetails buildUserDetails(User user) {
        List<String> resolvedRoles = resolveRoles(user);
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(resolvedRoles.toArray(new String[0]))
                .build();
    }

    private List<String> resolveRoles(User user) {
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            user.setRoles(new ArrayList<>(List.of("ROLE_USER")));
            userRepository.save(user);
        }
        return user.getRoles();
    }

    private boolean hasAdminRole(User user) {
        return resolveRoles(user).contains("ROLE_ADMIN");
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .level(user.getLevel())
                .totalXP(user.getTotalXP())
                .roles(new ArrayList<>(resolveRoles(user)))
                .isAdmin(hasAdminRole(user))
                .build();
    }
}
