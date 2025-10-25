package com.super30.Playgorithm.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String fullName;

    private String avatarUrl;

    private Integer level = 1;

    private Integer totalXP = 0;

    private Integer gamesPlayed = 0;

    private Integer gamesWon = 0;

    private Double winRate = 0.0;

    private List<String> achievementIds = new ArrayList<>();

    private List<String> roles = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime lastLoginAt;

    private Boolean isActive = true;
}
