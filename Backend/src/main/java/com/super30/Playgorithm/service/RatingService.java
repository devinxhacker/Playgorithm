package com.super30.Playgorithm.service;

import com.super30.Playgorithm.dto.GameRatingStats;
import com.super30.Playgorithm.dto.RatingRequest;
import com.super30.Playgorithm.model.Rating;
import com.super30.Playgorithm.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RatingService {
    
    private final RatingRepository ratingRepository;
    
    public Rating rateGame(String userId, String gameId, RatingRequest request) {
        Optional<Rating> existingRating = ratingRepository.findByUserIdAndGameId(userId, gameId);
        
        if (existingRating.isPresent()) {
            // Update existing rating
            Rating rating = existingRating.get();
            rating.setRating(request.getRating());
            rating.setUpdatedAt(LocalDateTime.now());
            return ratingRepository.save(rating);
        } else {
            // Create new rating
            Rating rating = new Rating();
            rating.setUserId(userId);
            rating.setGameId(gameId);
            rating.setRating(request.getRating());
            rating.setCreatedAt(LocalDateTime.now());
            rating.setUpdatedAt(LocalDateTime.now());
            return ratingRepository.save(rating);
        }
    }
    
    public GameRatingStats getGameRatingStats(String gameId, String userId) {
        List<Rating> ratings = ratingRepository.findByGameId(gameId);
        
        if (ratings.isEmpty()) {
            return GameRatingStats.builder()
                    .averageRating(0.0)
                    .totalRatings(0L)
                    .userRating(null)
                    .distribution(GameRatingStats.RatingDistribution.builder()
                            .fiveStars(0L)
                            .fourStars(0L)
                            .threeStars(0L)
                            .twoStars(0L)
                            .oneStar(0L)
                            .build())
                    .build();
        }
        
        // Calculate average
        double average = ratings.stream()
                .mapToInt(Rating::getRating)
                .average()
                .orElse(0.0);
        
        // Get user's rating
        Integer userRating = ratings.stream()
                .filter(r -> r.getUserId().equals(userId))
                .findFirst()
                .map(Rating::getRating)
                .orElse(null);
        
        // Calculate distribution
        long fiveStars = ratings.stream().filter(r -> r.getRating() == 5).count();
        long fourStars = ratings.stream().filter(r -> r.getRating() == 4).count();
        long threeStars = ratings.stream().filter(r -> r.getRating() == 3).count();
        long twoStars = ratings.stream().filter(r -> r.getRating() == 2).count();
        long oneStar = ratings.stream().filter(r -> r.getRating() == 1).count();
        
        return GameRatingStats.builder()
                .averageRating(Math.round(average * 10.0) / 10.0)
                .totalRatings((long) ratings.size())
                .userRating(userRating)
                .distribution(GameRatingStats.RatingDistribution.builder()
                        .fiveStars(fiveStars)
                        .fourStars(fourStars)
                        .threeStars(threeStars)
                        .twoStars(twoStars)
                        .oneStar(oneStar)
                        .build())
                .build();
    }
    
    public void deleteRating(String userId, String gameId) {
        ratingRepository.findByUserIdAndGameId(userId, gameId)
                .ifPresent(ratingRepository::delete);
    }
}
