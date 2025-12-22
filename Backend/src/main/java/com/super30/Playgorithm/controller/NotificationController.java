package com.super30.Playgorithm.controller;

import com.super30.Playgorithm.dto.AnnouncementRequest;
import com.super30.Playgorithm.dto.NotificationResponse;
import com.super30.Playgorithm.model.Notification.NotificationType;
import com.super30.Playgorithm.model.User;
import com.super30.Playgorithm.repository.UserRepository;
import com.super30.Playgorithm.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    /**
     * Get all notifications for the current user with pagination
     */
    @GetMapping
    public ResponseEntity<Page<NotificationResponse>> getUserNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {
        
        User user = getUserFromAuth(authentication);
        Page<NotificationResponse> notifications = notificationService.getUserNotifications(user.getId(), page, size);
        return ResponseEntity.ok(notifications);
    }

    /**
     * Get notifications filtered by type
     */
    @GetMapping("/filter")
    public ResponseEntity<Page<NotificationResponse>> getNotificationsByType(
            @RequestParam NotificationType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {
        
        User user = getUserFromAuth(authentication);
        Page<NotificationResponse> notifications = notificationService.getUserNotificationsByType(user.getId(), type, page, size);
        return ResponseEntity.ok(notifications);
    }

    /**
     * Get all unread notifications for the current user
     */
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications(Authentication authentication) {
        User user = getUserFromAuth(authentication);
        List<NotificationResponse> notifications = notificationService.getUnreadNotifications(user.getId());
        return ResponseEntity.ok(notifications);
    }

    /**
     * Get unread notification count
     */
    @GetMapping("/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication authentication) {
        User user = getUserFromAuth(authentication);
        long count = notificationService.getUnreadCount(user.getId());
        return ResponseEntity.ok(Map.of("count", count));
    }

    /**
     * Mark a notification as read
     */
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<NotificationResponse> markAsRead(
            @PathVariable String notificationId,
            Authentication authentication) {
        
        User user = getUserFromAuth(authentication);
        NotificationResponse notification = notificationService.markAsRead(notificationId, user.getId());
        return ResponseEntity.ok(notification);
    }

    /**
     * Mark all notifications as read
     */
    @PutMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(Authentication authentication) {
        User user = getUserFromAuth(authentication);
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    /**
     * Delete a notification
     */
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable String notificationId,
            Authentication authentication) {
        
        User user = getUserFromAuth(authentication);
        notificationService.deleteNotification(notificationId, user.getId());
        return ResponseEntity.noContent().build();
    }

    /**
     * Clear all notifications for the current user
     */
    @DeleteMapping("/clear-all")
    public ResponseEntity<Map<String, String>> clearAllNotifications(Authentication authentication) {
        User user = getUserFromAuth(authentication);
        notificationService.clearAllNotifications(user.getId());
        return ResponseEntity.ok(Map.of("message", "All notifications cleared"));
    }

    /**
     * Create an announcement (Admin only)
     */
    @PostMapping("/announcement")
    public ResponseEntity<Map<String, String>> createAnnouncement(
            @Valid @RequestBody AnnouncementRequest request,
            Authentication authentication) {
        
        User user = getUserFromAuth(authentication);
        
        // Check if user is admin
        if (!user.getRoles().contains("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Only admins can create announcements"));
        }
        
        notificationService.createAnnouncement(request, user.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(Map.of("message", "Announcement sent successfully"));
    }

    /**
     * Helper method to get User from Authentication
     */
    private User getUserFromAuth(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
