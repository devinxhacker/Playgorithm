package com.super30.Playgorithm.repository;

import com.super30.Playgorithm.model.Rating;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends MongoRepository<Rating, String> {
    Optional<Rating> findByUserIdAndGameId(String userId, String gameId);
    List<Rating> findByGameId(String gameId);
    List<Rating> findByUserId(String userId);
    Long countByGameId(String gameId);
    void deleteByGameId(String gameId);
}
