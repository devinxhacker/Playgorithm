package com.super30.Playgorithm.controller;

import com.super30.Playgorithm.dto.GameRatingStats;
import com.super30.Playgorithm.dto.RatingRequest;
import com.super30.Playgorithm.model.Rating;
import com.super30.Playgorithm.model.User;
import com.super30.Playgorithm.service.RatingService;
import com.super30.Playgorithm.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RatingController {
    
    private final RatingService ratingService;
    private final UserService userService;
    
    @PostMapping("/games/{gameId}")
    public ResponseEntity<Rating> rateGame(
            @PathVariable String gameId,
            @Valid @RequestBody RatingRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userService.getUserByUsername(username);
        Rating rating = ratingService.rateGame(user.getId(), gameId, request);
        return ResponseEntity.ok(rating);
    }
    
    @GetMapping("/games/{gameId}/stats")
    public ResponseEntity<GameRatingStats> getGameRatingStats(
            @PathVariable String gameId,
            Authentication authentication) {
        String userId = null;
        if (authentication != null) {
            String username = authentication.getName();
            User user = userService.getUserByUsername(username);
            userId = user.getId();
        }
        GameRatingStats stats = ratingService.getGameRatingStats(gameId, userId);
        return ResponseEntity.ok(stats);
    }
    
    @DeleteMapping("/games/{gameId}")
    public ResponseEntity<Void> deleteRating(
            @PathVariable String gameId,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userService.getUserByUsername(username);
        ratingService.deleteRating(user.getId(), gameId);
        return ResponseEntity.noContent().build();
    }
}
