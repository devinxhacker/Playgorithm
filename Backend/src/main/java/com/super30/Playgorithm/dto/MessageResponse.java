package com.super30.Playgorithm.dto;

import com.super30.Playgorithm.model.Message;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    
    private String id;
    private String userId;
    private String username;
    private String userAvatar;
    private String content;
    private String imageUrl;
    private Message.MessageType type;
    private boolean flagged;
    private LocalDateTime createdAt;
    private LocalDateTime editedAt;
    private String replyToMessageId;
    private String replyToUsername;
    private String replyToContent;
    private java.util.Map<String, java.util.List<String>> reactions;
    
    public static MessageResponse fromMessage(Message message) {
        MessageResponse response = new MessageResponse();
        response.setId(message.getId());
        response.setUserId(message.getUserId());
        response.setUsername(message.getUsername());
        response.setUserAvatar(message.getUserAvatar());
        response.setContent(message.getContent());
        response.setImageUrl(message.getImageUrl());
        response.setType(message.getType());
        response.setFlagged(message.isFlagged());
        response.setCreatedAt(message.getCreatedAt());
        response.setEditedAt(message.getEditedAt());
        response.setReplyToMessageId(message.getReplyToMessageId());
        response.setReplyToUsername(message.getReplyToUsername());
        response.setReplyToContent(message.getReplyToContent());
        response.setReactions(message.getReactions());
        return response;
    }
}
