package com.super30.Playgorithm.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "messages")
public class Message {
    @Id
    private String id;

    private String userId;
    
    private String username;
    
    private String userAvatar;
    
    private String content;
    
    private String imageUrl;
    
    private MessageType type = MessageType.TEXT;
    
    private boolean flagged = false;
    
    private String flagReason;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime editedAt;
    
    private boolean deleted = false;
    
    // Reply feature
    private String replyToMessageId;
    
    private String replyToUsername;
    
    private String replyToContent;
    
    // Reactions feature
    private java.util.Map<String, java.util.List<String>> reactions = new java.util.HashMap<>();
    // Map of emoji -> List of userIds who reacted

    public enum MessageType {
        TEXT,
        IMAGE,
        TEXT_WITH_IMAGE
    }
}
