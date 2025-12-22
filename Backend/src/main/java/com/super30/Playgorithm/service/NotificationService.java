package com.super30.Playgorithm.service;

import com.super30.Playgorithm.dto.AnnouncementRequest;
import com.super30.Playgorithm.dto.NotificationResponse;
import com.super30.Playgorithm.model.Notification;
import com.super30.Playgorithm.model.Notification.NotificationType;
import com.super30.Playgorithm.model.User;
import com.super30.Playgorithm.repository.NotificationRepository;
import com.super30.Playgorithm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Create and send a notification to a user
     */
    public NotificationResponse createNotification(Notification notification) {
        // Check for duplicate notifications (same type, reference, and user within 1 minute)
        boolean exists = notificationRepository.existsByUserIdAndReferenceIdAndType(
            notification.getUserId(), 
            notification.getReferenceId(), 
            notification.getType()
        );
        
        if (exists && notification.getReferenceId() != null) {
            log.info("Duplicate notification prevented for user: {}", notification.getUserId());
            return null;
        }

        Notification saved = notificationRepository.save(notification);
        NotificationResponse response = toResponse(saved);
        
        // Send real-time notification via WebSocket
        sendRealTimeNotification(notification.getUserId(), response);
        
        return response;
    }

    /**
     * Create a message reply notification
     */
    public void notifyMessageReply(String messageOwnerId, String replierUsername, String replierAvatar, 
                                    String messageId, String replyPreview) {
        if (messageOwnerId == null || replierUsername == null) return;
        
        // Don't notify if replying to own message
        User owner = userRepository.findById(messageOwnerId).orElse(null);
        if (owner != null && owner.getUsername().equals(replierUsername)) return;

        Notification notification = Notification.builder()
            .userId(messageOwnerId)
            .type(NotificationType.MESSAGE_REPLY)
            .title("New Reply")
            .message(replierUsername + " replied: " + truncate(replyPreview, 50))
            .senderUsername(replierUsername)
            .senderAvatar(replierAvatar)
            .referenceId(messageId)
            .referenceType("MESSAGE")
            .build();

        createNotification(notification);
    }

    /**
     * Create a message reaction notification
     */
    public void notifyMessageReaction(String messageOwnerId, String reactorUsername, String reactorAvatar,
                                       String messageId, String emoji) {
        if (messageOwnerId == null || reactorUsername == null) return;
        
        // Don't notify if reacting to own message
        User owner = userRepository.findById(messageOwnerId).orElse(null);
        if (owner != null && owner.getUsername().equals(reactorUsername)) return;

        Notification notification = Notification.builder()
            .userId(messageOwnerId)
            .type(NotificationType.MESSAGE_REACTION)
            .title("New Reaction")
            .message(reactorUsername + " reacted with " + emoji + " to your message")
            .senderUsername(reactorUsername)
            .senderAvatar(reactorAvatar)
            .referenceId(messageId)
            .referenceType("MESSAGE")
            .additionalData(emoji)
            .build();

        createNotification(notification);
    }

    /**
     * Create a comment reply notification
     */
    public void notifyCommentReply(String commentOwnerId, String replierUsername, String replierAvatar,
                                    String commentId, String gameId, String replyPreview) {
        if (commentOwnerId == null || replierUsername == null) return;
        
        // Don't notify if replying to own comment
        User owner = userRepository.findById(commentOwnerId).orElse(null);
        if (owner != null && owner.getUsername().equals(replierUsername)) return;

        Notification notification = Notification.builder()
            .userId(commentOwnerId)
            .type(NotificationType.COMMENT_REPLY)
            .title("New Reply")
            .message(replierUsername + " replied to your comment: " + truncate(replyPreview, 50))
            .senderUsername(replierUsername)
            .senderAvatar(replierAvatar)
            .referenceId(commentId)
            .referenceType("COMMENT")
            .additionalData(gameId)
            .build();

        createNotification(notification);
    }

    /**
     * Create a comment reaction notification
     */
    public void notifyCommentReaction(String commentOwnerId, String reactorUsername, String reactorAvatar,
                                       String commentId, String gameId, String reactionType) {
        if (commentOwnerId == null || reactorUsername == null) return;
        
        // Don't notify if reacting to own comment
        User owner = userRepository.findById(commentOwnerId).orElse(null);
        if (owner != null && owner.getUsername().equals(reactorUsername)) return;

        String emoji = getEmojiForReaction(reactionType);
        
        Notification notification = Notification.builder()
            .userId(commentOwnerId)
            .type(NotificationType.COMMENT_REACTION)
            .title("New Reaction")
            .message(reactorUsername + " reacted with " + emoji + " to your comment")
            .senderUsername(reactorUsername)
            .senderAvatar(reactorAvatar)
            .referenceId(commentId)
            .referenceType("COMMENT")
            .additionalData(gameId)
            .build();

        createNotification(notification);
    }

    /**
     * Create an announcement notification for all users or specific users
     */
    public void createAnnouncement(AnnouncementRequest request, String senderUsername) {
        List<User> targetUsers;
        
        if (request.getSendToAll() != null && request.getSendToAll()) {
            targetUsers = userRepository.findAll();
        } else if (request.getUserIds() != null && !request.getUserIds().isEmpty()) {
            targetUsers = userRepository.findAllById(request.getUserIds());
        } else {
            targetUsers = userRepository.findAll();
        }

        for (User user : targetUsers) {
            Notification notification = Notification.builder()
                .userId(user.getId())
                .type(NotificationType.ANNOUNCEMENT)
                .title(request.getTitle())
                .message(request.getMessage())
                .senderUsername(senderUsername)
                .referenceType("ANNOUNCEMENT")
                .build();

            createNotification(notification);
        }
        
        log.info("Announcement sent to {} users by {}", targetUsers.size(), senderUsername);
    }

    /**
     * Create achievement notification
     */
    public void notifyAchievement(String userId, String achievementName, String achievementDescription) {
        Notification notification = Notification.builder()
            .userId(userId)
            .type(NotificationType.ACHIEVEMENT)
            .title("🏆 Achievement Unlocked!")
            .message("You unlocked: " + achievementName + " - " + achievementDescription)
            .senderUsername("Playgorithm")
            .referenceType("ACHIEVEMENT")
            .build();

        createNotification(notification);
    }

    /**
     * Create level up notification
     */
    public void notifyLevelUp(String userId, int newLevel) {
        Notification notification = Notification.builder()
            .userId(userId)
            .type(NotificationType.LEVEL_UP)
            .title("🎉 Level Up!")
            .message("Congratulations! You've reached Level " + newLevel + "!")
            .senderUsername("Playgorithm")
            .referenceType("LEVEL_UP")
            .build();

        createNotification(notification);
    }

    /**
     * Get all notifications for a user with pagination
     */
    public Page<NotificationResponse> getUserNotifications(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
            .map(this::toResponse);
    }

    /**
     * Get notifications filtered by type
     */
    public Page<NotificationResponse> getUserNotificationsByType(String userId, NotificationType type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return notificationRepository.findByUserIdAndTypeOrderByCreatedAtDesc(userId, type, pageable)
            .map(this::toResponse);
    }

    /**
     * Get unread notifications for a user
     */
    public List<NotificationResponse> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId)
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    /**
     * Get unread notification count
     */
    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    /**
     * Mark a notification as read
     */
    public NotificationResponse markAsRead(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to notification");
        }

        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        Notification saved = notificationRepository.save(notification);
        
        // Send updated count via WebSocket
        sendUnreadCountUpdate(userId);
        
        return toResponse(saved);
    }

    /**
     * Mark all notifications as read for a user
     */
    public void markAllAsRead(String userId) {
        List<Notification> unreadNotifications = notificationRepository
            .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        
        LocalDateTime now = LocalDateTime.now();
        unreadNotifications.forEach(notification -> {
            notification.setIsRead(true);
            notification.setReadAt(now);
        });
        
        notificationRepository.saveAll(unreadNotifications);
        
        // Send updated count via WebSocket
        sendUnreadCountUpdate(userId);
    }

    /**
     * Delete a notification
     */
    public void deleteNotification(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to notification");
        }

        notificationRepository.delete(notification);
        
        // Send updated count via WebSocket
        sendUnreadCountUpdate(userId);
    }

    /**
     * Clear all notifications for a user
     */
    public void clearAllNotifications(String userId) {
        notificationRepository.deleteByUserId(userId);
        sendUnreadCountUpdate(userId);
    }

    /**
     * Send real-time notification via WebSocket
     */
    private void sendRealTimeNotification(String userId, NotificationResponse notification) {
        try {
            messagingTemplate.convertAndSend("/topic/notifications/" + userId, notification);
            log.debug("Sent real-time notification to user: {}", userId);
        } catch (Exception e) {
            log.error("Failed to send real-time notification: {}", e.getMessage());
        }
    }

    /**
     * Send unread count update via WebSocket
     */
    private void sendUnreadCountUpdate(String userId) {
        try {
            long count = getUnreadCount(userId);
            messagingTemplate.convertAndSend("/topic/notifications/" + userId + "/count", count);
        } catch (Exception e) {
            log.error("Failed to send unread count update: {}", e.getMessage());
        }
    }

    /**
     * Cleanup old notifications (scheduled task - runs daily)
     */
    @Scheduled(cron = "0 0 2 * * ?") // Run at 2 AM every day
    public void cleanupOldNotifications() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        notificationRepository.deleteByCreatedAtBefore(thirtyDaysAgo);
        log.info("Cleaned up notifications older than 30 days");
    }

    /**
     * Convert Notification entity to NotificationResponse DTO
     */
    private NotificationResponse toResponse(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        response.setUserId(notification.getUserId());
        response.setType(notification.getType());
        response.setTitle(notification.getTitle());
        response.setMessage(notification.getMessage());
        response.setSenderUsername(notification.getSenderUsername());
        response.setSenderAvatar(notification.getSenderAvatar());
        response.setReferenceId(notification.getReferenceId());
        response.setReferenceType(notification.getReferenceType());
        response.setAdditionalData(notification.getAdditionalData());
        response.setIsRead(notification.getIsRead());
        response.setCreatedAt(notification.getCreatedAt());
        response.setReadAt(notification.getReadAt());
        response.setTimeAgo(formatTimeAgo(notification.getCreatedAt()));
        return response;
    }

    /**
     * Format time as human-readable "time ago" string
     */
    private String formatTimeAgo(LocalDateTime dateTime) {
        if (dateTime == null) return "";
        
        Duration duration = Duration.between(dateTime, LocalDateTime.now());
        long seconds = duration.getSeconds();
        
        if (seconds < 60) return "Just now";
        if (seconds < 3600) return (seconds / 60) + "m ago";
        if (seconds < 86400) return (seconds / 3600) + "h ago";
        if (seconds < 604800) return (seconds / 86400) + "d ago";
        if (seconds < 2592000) return (seconds / 604800) + "w ago";
        
        return dateTime.toLocalDate().toString();
    }

    /**
     * Truncate string to specified length
     */
    private String truncate(String text, int maxLength) {
        if (text == null) return "";
        if (text.length() <= maxLength) return text;
        return text.substring(0, maxLength - 3) + "...";
    }

    /**
     * Get emoji for reaction type
     */
    private String getEmojiForReaction(String reactionType) {
        switch (reactionType.toLowerCase()) {
            case "like": return "👍";
            case "love": return "❤️";
            case "fire": return "🔥";
            case "laugh": return "😂";
            case "sad": return "😢";
            default: return "👍";
        }
    }
}
