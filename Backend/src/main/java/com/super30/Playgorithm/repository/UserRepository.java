package com.super30.Playgorithm.repository;

import com.super30.Playgorithm.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    boolean existsByRolesContaining(String role);
    long countByIsActiveTrue();
    long countByRolesContaining(String role);
    List<User> findTop5ByOrderByCreatedAtDesc();
    
    // Count users with XP greater than the given value (for ranking)
    long countByTotalXPGreaterThan(Integer totalXP);
    
    // Get all users ordered by XP for leaderboard
    List<User> findAllByOrderByTotalXPDesc();
}
