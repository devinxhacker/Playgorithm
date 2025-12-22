package com.super30.Playgorithm.dto;

import com.super30.Playgorithm.model.Notification.NotificationType;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Message is required")
    private String message;
    
    // If true, send to all users. If false, use userIds list
    private Boolean sendToAll = true;
    
    // Optional: specific user IDs to send to
    private java.util.List<String> userIds;
}
