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
@Document(collection = "ratings")
@CompoundIndex(name = "user_game_idx", def = "{'userId': 1, 'gameId': 1}", unique = true)
public class Rating {
    @Id
    private String id;
    
    private String userId;
    private String gameId;
    private Integer rating; // 1-5 stars
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
