package com.super30.Playgorithm.repository;

import com.super30.Playgorithm.model.GameSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameSessionRepository extends MongoRepository<GameSession, String> {
    List<GameSession> findByUserId(String userId);
    List<GameSession> findByGameId(String gameId);
    List<GameSession> findByUserIdAndGameId(String userId, String gameId);
    List<GameSession> findByUserIdAndStatus(String userId, String status);
    Long countByUserIdAndStatus(String userId, String status);
}
