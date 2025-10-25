package com.super30.Playgorithm.service;

import com.super30.Playgorithm.model.User;
import com.super30.Playgorithm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

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
}
