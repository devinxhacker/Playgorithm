package com.super30.Playgorithm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameRatingStats {
    private Double averageRating;
    private Long totalRatings;
    private Integer userRating; // Current user's rating, null if not rated
    private RatingDistribution distribution;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RatingDistribution {
        private Long fiveStars;
        private Long fourStars;
        private Long threeStars;
        private Long twoStars;
        private Long oneStar;
    }
}
