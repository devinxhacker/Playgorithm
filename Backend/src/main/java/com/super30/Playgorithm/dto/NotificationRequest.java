package com.super30.Playgorithm.dto;

import com.super30.Playgorithm.model.Notification.NotificationType;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {
    
    private String userId;  // Target user (for admin announcements)
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Message is required")
    private String message;
    
    private NotificationType type = NotificationType.SYSTEM;
    
    private String referenceId;
    
    private String referenceType;
    
    private String additionalData;
}
