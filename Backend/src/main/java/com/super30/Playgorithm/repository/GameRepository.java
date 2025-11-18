package com.super30.Playgorithm.repository;

import com.super30.Playgorithm.model.Game;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameRepository extends MongoRepository<Game, String> {
    List<Game> findByCategory(String category);
    List<Game> findByDifficulty(String difficulty);
    List<Game> findByIsActiveTrue();
    List<Game> findByCategoryAndDifficulty(String category, String difficulty);
    long countByIsActiveTrue();
}
