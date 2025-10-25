package com.super30.Playgorithm.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "leaderboard")
@CompoundIndex(name = "game_score_idx", def = "{'gameId': 1, 'score': -1}")
@CompoundIndex(name = "global_xp_idx", def = "{'totalXP': -1}")
public class LeaderboardEntry {
    @Id
    private String id;

    private String userId;

    private String username;

    private String gameId; // null for global leaderboard

    private Integer score;

    private Integer totalXP;

    private Integer rank;

    private Integer timeTaken; // for game-specific leaderboard

    private LocalDateTime achievedAt = LocalDateTime.now();
}
