package com.super30.Playgorithm.controller;

import com.super30.Playgorithm.dto.CommentRequest;
import com.super30.Playgorithm.model.Comment;
import com.super30.Playgorithm.model.User;
import com.super30.Playgorithm.service.CommentService;
import com.super30.Playgorithm.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommentController {
    
    private final CommentService commentService;
    private final UserService userService;
    
    @PostMapping("/games/{gameId}")
    public ResponseEntity<Comment> addComment(
            @PathVariable String gameId,
            @Valid @RequestBody CommentRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userService.getUserByUsername(username);
        Comment comment = commentService.addComment(user.getId(), gameId, request);
        return ResponseEntity.ok(comment);
    }
    
    @GetMapping("/games/{gameId}")
    public ResponseEntity<List<Comment>> getTopLevelComments(@PathVariable String gameId) {
        List<Comment> comments = commentService.getTopLevelComments(gameId);
        return ResponseEntity.ok(comments);
    }
    
    @GetMapping("/{commentId}/replies")
    public ResponseEntity<List<Comment>> getReplies(@PathVariable String commentId) {
        List<Comment> replies = commentService.getReplies(commentId);
        return ResponseEntity.ok(replies);
    }
    
    @PutMapping("/{commentId}")
    public ResponseEntity<Comment> updateComment(
            @PathVariable String commentId,
            @Valid @RequestBody CommentRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userService.getUserByUsername(username);
        Comment comment = commentService.updateComment(commentId, user.getId(), request);
        return ResponseEntity.ok(comment);
    }
    
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String commentId,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userService.getUserByUsername(username);
        commentService.deleteComment(commentId, user.getId());
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{commentId}/reactions")
    public ResponseEntity<Comment> toggleReaction(
            @PathVariable String commentId,
            @RequestBody Map<String, String> payload,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userService.getUserByUsername(username);
        String reactionType = payload.get("reactionType");
        Comment comment = commentService.toggleReaction(commentId, user.getId(), reactionType);
        return ResponseEntity.ok(comment);
    }
    
    @GetMapping("/games/{gameId}/count")
    public ResponseEntity<Map<String, Long>> getCommentCount(@PathVariable String gameId) {
        Long count = commentService.getCommentCount(gameId);
        return ResponseEntity.ok(Map.of("count", count));
    }
}
