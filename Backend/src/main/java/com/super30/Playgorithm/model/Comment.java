package com.super30.Playgorithm.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "comments")
public class Comment {
    @Id
    private String id;
    
    private String gameId;
    private String userId;
    private String username;
    private String userAvatar;
    private String content;
    private String parentCommentId; // null for top-level comments, set for replies
    private List<String> replyIds = new ArrayList<>(); // IDs of direct replies
    
    // Reactions: userId -> reactionType (like, love, fire, etc.)
    private Map<String, String> reactions = new HashMap<>();
    
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
    private Boolean isEdited = false;
}
