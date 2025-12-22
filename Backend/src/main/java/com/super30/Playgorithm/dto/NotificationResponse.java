package com.super30.Playgorithm.dto;

import com.super30.Playgorithm.model.Notification.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private String id;
    private String userId;
    private NotificationType type;
    private String title;
    private String message;
    private String senderUsername;
    private String senderAvatar;
    private String referenceId;
    private String referenceType;
    private String additionalData;
    private Boolean isRead;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
    private String timeAgo; // Human-readable time format
}
