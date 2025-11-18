package com.super30.Playgorithm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    @Builder.Default
    private String type = "Bearer";
    private String id;
    private String username;
    private String email;
    private String fullName;
    private Integer level;
    private Integer totalXP;
    private List<String> roles;
    private Boolean isAdmin;

    public AuthResponse(
            String token,
            String id,
            String username,
            String email,
            String fullName,
            Integer level,
            Integer totalXP,
            List<String> roles,
            Boolean isAdmin
    ) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.level = level;
        this.totalXP = totalXP;
        this.roles = roles;
        this.isAdmin = isAdmin;
    }
}
