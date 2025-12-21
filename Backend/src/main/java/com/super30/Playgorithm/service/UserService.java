package com.super30.Playgorithm.service;

import com.super30.Playgorithm.model.User;
import com.super30.Playgorithm.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public void addXP(String userId, Integer xp) {
        User user = getUserById(userId);
        user.setTotalXP(user.getTotalXP() + xp);
        
        // Level up logic: 100 XP per level
        int newLevel = (user.getTotalXP() / 100) + 1;
        user.setLevel(newLevel);
        
        userRepository.save(user);
    }

    public void incrementGamesPlayed(String userId) {
        User user = getUserById(userId);
        user.setGamesPlayed(user.getGamesPlayed() + 1);
        userRepository.save(user);
    }

    public void incrementGamesWon(String userId) {
        User user = getUserById(userId);
        user.setGamesWon(user.getGamesWon() + 1);
        user.setWinRate((double) user.getGamesWon() / user.getGamesPlayed() * 100);
        userRepository.save(user);
    }

    /**
     * Calculate the global rank of a user based on their XP.
     * Rank 1 = highest XP, counts how many users have more XP + 1
     */
    public int getUserGlobalRank(String userId) {
        User user = getUserById(userId);
        // Count users with more XP than this user, add 1 for the rank
        long usersWithMoreXP = userRepository.countByTotalXPGreaterThan(user.getTotalXP());
        return (int) usersWithMoreXP + 1;
    }

    /**
     * Get total number of users for rank context
     */
    public long getTotalUserCount() {
        return userRepository.count();
    }

    /**
     * Get top users by XP for leaderboard
     */
    public List<User> getTopUsersByXP(int limit) {
        return userRepository.findByOrderByTotalXPDesc(PageRequest.of(0, limit));
    }
}
