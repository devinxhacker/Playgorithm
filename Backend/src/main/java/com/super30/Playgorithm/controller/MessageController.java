package com.super30.Playgorithm.controller;

import com.super30.Playgorithm.dto.MessageRequest;
import com.super30.Playgorithm.dto.MessageResponse;
import com.super30.Playgorithm.dto.ReactionRequest;
import com.super30.Playgorithm.repository.UserRepository;
import com.super30.Playgorithm.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MessageController {

    private final MessageService messageService;
    private final UserRepository userRepository;
    
    // Directory to store uploaded images
    private static final String UPLOAD_DIR = "uploads/messages/";

    @PostMapping
    public ResponseEntity<?> createMessage(
            @Valid @RequestBody MessageRequest request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            MessageResponse response = messageService.createMessage(username, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            // Return 400 Bad Request with error message for inappropriate content
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<Page<MessageResponse>> getMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<MessageResponse> messages = messageService.getMessages(page, size);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<MessageResponse>> getRecentMessages(
            @RequestParam(defaultValue = "50") int limit) {
        List<MessageResponse> messages = messageService.getRecentMessages(limit);
        return ResponseEntity.ok(messages);
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable String messageId,
            Authentication authentication) {
        String username = authentication.getName();
        messageService.deleteMessage(messageId, username);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/flagged")
    public ResponseEntity<List<MessageResponse>> getFlaggedMessages() {
        List<MessageResponse> messages = messageService.getFlaggedMessages();
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/{messageId}/approve")
    public ResponseEntity<Void> approveFlaggedMessage(@PathVariable String messageId) {
        messageService.approveFlaggedMessage(messageId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body("Only image files are allowed");
            }

            // Validate file size (max 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body("File size exceeds 5MB limit");
            }

            // Create upload directory if it doesn't exist
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                    ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
                    : "";
            String filename = UUID.randomUUID().toString() + extension;

            // Save file
            Path filePath = Paths.get(UPLOAD_DIR + filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Return URL
            String imageUrl = "/uploads/messages/" + filename;
            return ResponseEntity.ok(imageUrl);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload image: " + e.getMessage());
        }
    }

    @PostMapping("/{messageId}/react")
    public ResponseEntity<MessageResponse> toggleReaction(
            @PathVariable String messageId,
            @RequestBody ReactionRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        MessageResponse response = messageService.toggleReaction(messageId, username, request.getEmoji());
        return ResponseEntity.ok(response);
    }

    /**
     * Get unread message count for the current user
     */
    @GetMapping("/unread/count")
    public ResponseEntity<java.util.Map<String, Long>> getUnreadCount(Authentication authentication) {
        String username = authentication.getName();
        com.super30.Playgorithm.model.User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        long count = messageService.getUnreadCount(user.getId());
        return ResponseEntity.ok(java.util.Map.of("count", count));
    }

    /**
     * Mark messages as read for the current user
     */
    @PostMapping("/mark-read")
    public ResponseEntity<java.util.Map<String, String>> markAsRead(
            @RequestBody(required = false) java.util.Map<String, String> request,
            Authentication authentication) {
        String username = authentication.getName();
        com.super30.Playgorithm.model.User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String lastMessageId = request != null ? request.get("lastMessageId") : null;
        messageService.markMessagesAsRead(user.getId(), lastMessageId);
        return ResponseEntity.ok(java.util.Map.of("status", "success"));
    }

    /**
     * WebSocket endpoint for real-time messaging
     */
    @MessageMapping("/message")
    @SendTo("/topic/messages")
    public MessageResponse handleWebSocketMessage(@Payload MessageRequest request) {
        // This is handled via WebSocket, but we still save it to database
        // The actual authentication would need to be extracted from WebSocket session
        // For now, this is a placeholder - authentication is handled in HTTP endpoints
        return null;
    }
}
