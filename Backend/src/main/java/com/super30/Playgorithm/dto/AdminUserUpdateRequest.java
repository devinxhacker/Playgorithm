package com.super30.Playgorithm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserUpdateRequest {
    private String fullName;
    private Boolean isActive;
    private List<String> roles;
}
