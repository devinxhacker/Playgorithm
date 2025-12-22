package com.super30.Playgorithm.repository;

import com.super30.Playgorithm.model.Notification;
import com.super30.Playgorithm.model.Notification.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    
    // Find all notifications for a user, ordered by creation date (newest first)
    Page<Notification> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
    
    // Find all unread notifications for a user
    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(String userId);
    
    // Count unread notifications for a user
    long countByUserIdAndIsReadFalse(String userId);
    
    // Find notifications by type for a user
    Page<Notification> findByUserIdAndTypeOrderByCreatedAtDesc(String userId, NotificationType type, Pageable pageable);
    
    // Find unread notifications by type for a user
    List<Notification> findByUserIdAndTypeAndIsReadFalseOrderByCreatedAtDesc(String userId, NotificationType type);
    
    // Find all notifications for a user (limited)
    List<Notification> findTop50ByUserIdOrderByCreatedAtDesc(String userId);
    
    // Delete old notifications (older than specified date)
    void deleteByCreatedAtBefore(LocalDateTime date);
    
    // Find notifications by reference
    List<Notification> findByReferenceIdAndReferenceType(String referenceId, String referenceType);
    
    // Delete notifications for a specific user
    void deleteByUserId(String userId);
    
    // Check if notification exists
    boolean existsByUserIdAndReferenceIdAndType(String userId, String referenceId, NotificationType type);
}
