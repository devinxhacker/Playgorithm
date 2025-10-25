package com.super30.Playgorithm.repository;

import com.super30.Playgorithm.model.Achievement;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AchievementRepository extends MongoRepository<Achievement, String> {
    List<Achievement> findByCategory(String category);
    List<Achievement> findByIsActiveTrue();
}
