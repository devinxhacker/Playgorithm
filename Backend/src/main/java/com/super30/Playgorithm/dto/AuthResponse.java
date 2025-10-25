package com.super30.Playgorithm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private String id;
    private String username;
    private String email;
    private String fullName;
    private Integer level;
    private Integer totalXP;

    public AuthResponse(String token, String id, String username, String email, String fullName, Integer level, Integer totalXP) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.level = level;
        this.totalXP = totalXP;
    }
}
