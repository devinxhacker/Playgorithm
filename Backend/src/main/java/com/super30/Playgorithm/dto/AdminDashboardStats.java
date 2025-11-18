package com.super30.Playgorithm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardStats {
    private long totalUsers;
    private long activeUsers;
    private long adminUsers;
    private long totalGames;
    private long activeGames;
    private long totalSessions;
    private long totalLeaderboardEntries;
    private List<UserSnapshot> recentUsers;
    private List<GameSnapshot> spotlightGames;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSnapshot {
        private String id;
        private String username;
        private String fullName;
        private String email;
        private List<String> roles;
        private Boolean isActive;
        private LocalDateTime createdAt;
        private LocalDateTime lastLoginAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GameSnapshot {
        private String id;
        private String name;
        private String category;
        private String difficulty;
        private Integer xpReward;
        private Boolean isActive;
    }
}
