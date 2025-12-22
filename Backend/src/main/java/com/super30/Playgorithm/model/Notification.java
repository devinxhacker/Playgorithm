package com.super30.Playgorithm.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;

    @Indexed
    private String userId;  // The user who will receive this notification

    private NotificationType type;

    private String title;

    private String message;

    private String senderUsername;  // Who triggered the notification

    private String senderAvatar;

    // Reference to the related entity (messageId, commentId, etc.)
    private String referenceId;

    // Type of the reference (MESSAGE, COMMENT, GAME, etc.)
    private String referenceType;

    // Additional data for navigation (gameId, etc.)
    private String additionalData;

    @Indexed
    private Boolean isRead = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime readAt;

    public enum NotificationType {
        ANNOUNCEMENT,           // Platform announcements from Playgorithm
        MESSAGE_REPLY,         // Someone replied to your message in community chat
        MESSAGE_REACTION,      // Someone reacted to your message
        COMMENT_REPLY,         // Someone replied to your comment on a game
        COMMENT_REACTION,      // Someone reacted to your comment
        ACHIEVEMENT,           // You unlocked an achievement
        LEVEL_UP,              // You leveled up
        GAME_INVITE,           // Someone invited you to play
        SYSTEM                 // System notifications
    }

    // Builder pattern for easier creation
    public static NotificationBuilder builder() {
        return new NotificationBuilder();
    }

    public static class NotificationBuilder {
        private final Notification notification = new Notification();

        public NotificationBuilder userId(String userId) {
            notification.setUserId(userId);
            return this;
        }

        public NotificationBuilder type(NotificationType type) {
            notification.setType(type);
            return this;
        }

        public NotificationBuilder title(String title) {
            notification.setTitle(title);
            return this;
        }

        public NotificationBuilder message(String message) {
            notification.setMessage(message);
            return this;
        }

        public NotificationBuilder senderUsername(String senderUsername) {
            notification.setSenderUsername(senderUsername);
            return this;
        }

        public NotificationBuilder senderAvatar(String senderAvatar) {
            notification.setSenderAvatar(senderAvatar);
            return this;
        }

        public NotificationBuilder referenceId(String referenceId) {
            notification.setReferenceId(referenceId);
            return this;
        }

        public NotificationBuilder referenceType(String referenceType) {
            notification.setReferenceType(referenceType);
            return this;
        }

        public NotificationBuilder additionalData(String additionalData) {
            notification.setAdditionalData(additionalData);
            return this;
        }

        public Notification build() {
            notification.setCreatedAt(LocalDateTime.now());
            notification.setIsRead(false);
            return notification;
        }
    }
}
