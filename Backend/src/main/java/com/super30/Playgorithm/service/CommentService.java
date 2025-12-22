package com.super30.Playgorithm.service;

import com.super30.Playgorithm.dto.CommentRequest;
import com.super30.Playgorithm.model.Comment;
import com.super30.Playgorithm.model.User;
import com.super30.Playgorithm.repository.CommentRepository;
import com.super30.Playgorithm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {
    
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    
    public Comment addComment(String userId, String gameId, CommentRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Comment comment = new Comment();
        comment.setGameId(gameId);
        comment.setUserId(userId);
        comment.setUsername(user.getUsername());
        comment.setUserAvatar(user.getAvatarUrl());
        comment.setContent(request.getContent());
        comment.setParentCommentId(request.getParentCommentId());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());
        
        Comment savedComment = commentRepository.save(comment);
        
        // If this is a reply, update parent's replyIds and send notification
        if (request.getParentCommentId() != null) {
            commentRepository.findById(request.getParentCommentId()).ifPresent(parent -> {
                parent.getReplyIds().add(savedComment.getId());
                commentRepository.save(parent);
                
                // Send notification to parent comment owner
                notificationService.notifyCommentReply(
                    parent.getUserId(),
                    user.getUsername(),
                    user.getAvatarUrl(),
                    parent.getId(),
                    gameId,
                    request.getContent()
                );
            });
        }
        
        return savedComment;
    }
    
    public List<Comment> getTopLevelComments(String gameId) {
        return commentRepository.findByGameIdAndParentCommentIdIsNull(
                gameId, 
                Sort.by(Sort.Direction.DESC, "createdAt")
        );
    }
    
    public List<Comment> getReplies(String parentCommentId) {
        return commentRepository.findByParentCommentId(
                parentCommentId,
                Sort.by(Sort.Direction.ASC, "createdAt")
        );
    }
    
    public Comment updateComment(String commentId, String userId, CommentRequest request) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to edit this comment");
        }
        
        comment.setContent(request.getContent());
        comment.setUpdatedAt(LocalDateTime.now());
        comment.setIsEdited(true);
        
        return commentRepository.save(comment);
    }
    
    public void deleteComment(String commentId, String userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this comment");
        }
        
        // Delete all replies first
        deleteRepliesRecursively(commentId);
        
        // Remove from parent's replyIds if it's a reply
        if (comment.getParentCommentId() != null) {
            commentRepository.findById(comment.getParentCommentId()).ifPresent(parent -> {
                parent.getReplyIds().remove(commentId);
                commentRepository.save(parent);
            });
        }
        
        commentRepository.delete(comment);
    }
    
    private void deleteRepliesRecursively(String commentId) {
        List<Comment> replies = commentRepository.findByParentCommentId(commentId, Sort.unsorted());
        for (Comment reply : replies) {
            deleteRepliesRecursively(reply.getId());
            commentRepository.delete(reply);
        }
    }
    
    public Comment toggleReaction(String commentId, String userId, String reactionType) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        User reactor = userRepository.findById(userId).orElse(null);
        
        if (comment.getReactions().containsKey(userId)) {
            // If same reaction, remove it; if different, update it
            if (comment.getReactions().get(userId).equals(reactionType)) {
                comment.getReactions().remove(userId);
            } else {
                comment.getReactions().put(userId, reactionType);
                // Send notification for new reaction type
                if (reactor != null) {
                    notificationService.notifyCommentReaction(
                        comment.getUserId(),
                        reactor.getUsername(),
                        reactor.getAvatarUrl(),
                        commentId,
                        comment.getGameId(),
                        reactionType
                    );
                }
            }
        } else {
            comment.getReactions().put(userId, reactionType);
            // Send notification for new reaction
            if (reactor != null) {
                notificationService.notifyCommentReaction(
                    comment.getUserId(),
                    reactor.getUsername(),
                    reactor.getAvatarUrl(),
                    commentId,
                    comment.getGameId(),
                    reactionType
                );
            }
        }
        
        return commentRepository.save(comment);
    }
    
    public Long getCommentCount(String gameId) {
        return commentRepository.countByGameId(gameId);
    }
}
