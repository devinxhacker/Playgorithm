package com.super30.Playgorithm.service;

import com.super30.Playgorithm.dto.MessageRequest;
import com.super30.Playgorithm.dto.MessageResponse;
import com.super30.Playgorithm.model.Message;
import com.super30.Playgorithm.model.User;
import com.super30.Playgorithm.repository.MessageRepository;
import com.super30.Playgorithm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    // Content moderation - list of inappropriate words/patterns
    private static final List<String> INAPPROPRIATE_WORDS = Arrays.asList(
            "sex", "porn", "xxx", "nude", "naked", "dick", "pussy", "fuck", 
            "shit", "damn", "bitch", "bastard", "ass", "asshole", "whore", 
            "slut", "rape", "kill", "die", "suicide", "idiot", "stupid", "dumb"
    );

    // Patterns for detecting inappropriate content
    private static final List<Pattern> INAPPROPRIATE_PATTERNS = Arrays.asList(
            Pattern.compile("(?i)\\b(sex|porn|xxx|nude|naked)\\b"),
            Pattern.compile("(?i)\\b(f+u+c+k+|sh+i+t+|d+a+m+n+)\\b"),
            Pattern.compile("(?i)\\b(b+i+t+c+h+|w+h+o+r+e+|s+l+u+t+)\\b"),
            Pattern.compile("(?i)\\b(rape|kill|die|suicide)\\b"),
            Pattern.compile("(?i)\\b(dick|pussy|cock|ass|asshole)\\b")
    );

    public MessageResponse createMessage(String username, MessageRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Message message = new Message();
        message.setUserId(user.getId());
        message.setUsername(user.getUsername());
        message.setUserAvatar(user.getAvatarUrl());
        message.setContent(request.getContent());
        message.setImageUrl(request.getImageUrl());
        
        // Handle reply
        if (request.getReplyToMessageId() != null && !request.getReplyToMessageId().isEmpty()) {
            Message replyToMessage = messageRepository.findById(request.getReplyToMessageId())
                    .orElse(null);
            if (replyToMessage != null) {
                message.setReplyToMessageId(replyToMessage.getId());
                message.setReplyToUsername(replyToMessage.getUsername());
                message.setReplyToContent(replyToMessage.getContent());
            }
        }

        // Determine message type
        if (request.getImageUrl() != null && !request.getImageUrl().isEmpty()) {
            message.setType(Message.MessageType.TEXT_WITH_IMAGE);
        } else {
            message.setType(Message.MessageType.TEXT);
        }

        // Content moderation
        ContentModerationResult moderationResult = moderateContent(request.getContent());
        if (moderationResult.isFlagged()) {
            log.warn("Message rejected for user {}: {}", username, moderationResult.getReason());
            throw new IllegalArgumentException("Your message contains inappropriate content and cannot be posted. Please review our community guidelines and avoid using offensive language or inappropriate content.");
        }

        // Save message
        Message savedMessage = messageRepository.save(message);
        
        // Broadcast to all connected clients via WebSocket
        MessageResponse response = MessageResponse.fromMessage(savedMessage);
        messagingTemplate.convertAndSend("/topic/messages", response);

        return response;
    }

    public Page<MessageResponse> getMessages(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Message> messages = messageRepository.findByDeletedFalseOrderByCreatedAtDesc(pageable);
        return messages.map(MessageResponse::fromMessage);
    }

    public List<MessageResponse> getRecentMessages(int limit) {
        List<Message> messages = messageRepository.findTop50ByDeletedFalseOrderByCreatedAtDesc();
        List<MessageResponse> messageResponses = messages.stream()
                .filter(msg -> !msg.isFlagged()) // Don't show flagged messages
                .map(MessageResponse::fromMessage)
                .collect(Collectors.toList());
        
        // Reverse to get oldest first (chronological order for chat)
        java.util.Collections.reverse(messageResponses);
        
        // Limit after reversing
        return messageResponses.stream()
                .limit(limit)
                .collect(Collectors.toList());
    }

    public void deleteMessage(String messageId, String username) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Only allow user to delete their own message or admins can delete any
        if (!message.getUserId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this message");
        }

        message.setDeleted(true);
        messageRepository.save(message);

        // Broadcast deletion
        messagingTemplate.convertAndSend("/topic/messages/delete", messageId);
    }

    public List<MessageResponse> getFlaggedMessages() {
        Pageable pageable = PageRequest.of(0, 50);
        List<Message> messages = messageRepository.findFlaggedMessages(pageable);
        return messages.stream()
                .map(MessageResponse::fromMessage)
                .collect(Collectors.toList());
    }

    public void approveFlaggedMessage(String messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        
        message.setFlagged(false);
        message.setFlagReason(null);
        messageRepository.save(message);

        // Broadcast the approved message
        MessageResponse response = MessageResponse.fromMessage(message);
        messagingTemplate.convertAndSend("/topic/messages", response);
    }

    /**
     * Content moderation method to check for inappropriate content
     */
    private ContentModerationResult moderateContent(String content) {
        if (content == null || content.trim().isEmpty()) {
            return new ContentModerationResult(false, null);
        }

        String lowerContent = content.toLowerCase();

        // Check for inappropriate words
        for (String word : INAPPROPRIATE_WORDS) {
            if (lowerContent.contains(word)) {
                return new ContentModerationResult(true, "Contains inappropriate language");
            }
        }

        // Check for inappropriate patterns
        for (Pattern pattern : INAPPROPRIATE_PATTERNS) {
            if (pattern.matcher(content).find()) {
                return new ContentModerationResult(true, "Contains inappropriate content");
            }
        }

        // Check for excessive capitalization (potential spam)
        long uppercaseCount = content.chars().filter(Character::isUpperCase).count();
        if (content.length() > 10 && uppercaseCount > content.length() * 0.7) {
            return new ContentModerationResult(true, "Excessive capitalization (potential spam)");
        }

        // Check for excessive repetition
        if (Pattern.compile("(.)\\1{5,}").matcher(content).find()) {
            return new ContentModerationResult(true, "Excessive character repetition");
        }

        return new ContentModerationResult(false, null);
    }

    /**
     * Inner class for content moderation result
     */
    private static class ContentModerationResult {
        private final boolean flagged;
        private final String reason;

        public ContentModerationResult(boolean flagged, String reason) {
            this.flagged = flagged;
            this.reason = reason;
        }

        public boolean isFlagged() {
            return flagged;
        }

        public String getReason() {
            return reason;
        }
    }
    
    /**
     * Add or remove a reaction from a message
     */
    public MessageResponse toggleReaction(String messageId, String username, String emoji) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String userId = user.getId();
        
        // Get or create reactions map
        if (message.getReactions() == null) {
            message.setReactions(new java.util.HashMap<>());
        }
        
        // Get or create list of users for this emoji
        java.util.List<String> reactedUsers = message.getReactions()
                .computeIfAbsent(emoji, k -> new java.util.ArrayList<>());
        
        // Toggle reaction
        if (reactedUsers.contains(userId)) {
            reactedUsers.remove(userId);
            // Remove emoji key if no users left
            if (reactedUsers.isEmpty()) {
                message.getReactions().remove(emoji);
            }
        } else {
            reactedUsers.add(userId);
        }
        
        // Save message
        Message savedMessage = messageRepository.save(message);
        
        // Broadcast update via WebSocket
        MessageResponse response = MessageResponse.fromMessage(savedMessage);
        messagingTemplate.convertAndSend("/topic/messages/reaction", response);
        
        return response;
    }
}
