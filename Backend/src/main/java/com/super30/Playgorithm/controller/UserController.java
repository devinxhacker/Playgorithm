package com.super30.Playgorithm.controller;

import com.super30.Playgorithm.model.User;
import com.super30.Playgorithm.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.getUserByUsername(username);
        // Remove password from response
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/me/rank")
    public ResponseEntity<Map<String, Object>> getCurrentUserRank(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.getUserByUsername(username);
        int rank = userService.getUserGlobalRank(user.getId());
        long totalUsers = userService.getTotalUserCount();
        
        return ResponseEntity.ok(Map.of(
            "rank", rank,
            "totalUsers", totalUsers,
            "percentile", totalUsers > 0 ? Math.round((1 - ((double) rank / totalUsers)) * 100) : 0
        ));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<Map<String, Object>>> getLeaderboard(
            @RequestParam(defaultValue = "50") int limit
    ) {
        List<User> topUsers = userService.getTopUsersByXP(limit);
        
        List<Map<String, Object>> leaderboard = IntStream.range(0, topUsers.size())
            .mapToObj(i -> {
                User u = topUsers.get(i);
                return Map.<String, Object>of(
                    "rank", i + 1,
                    "id", u.getId(),
                    "username", u.getUsername(),
                    "fullName", u.getFullName() != null ? u.getFullName() : u.getUsername(),
                    "avatarUrl", u.getAvatarUrl() != null ? u.getAvatarUrl() : "",
                    "totalXP", u.getTotalXP(),
                    "level", u.getLevel(),
                    "gamesPlayed", u.getGamesPlayed(),
                    "winRate", u.getWinRate()
                );
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(leaderboard);
    }

    @GetMapping("/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateCurrentUser(
            @RequestBody User updatedUser,
            Authentication authentication
    ) {
        String username = authentication.getName();
        User user = userService.getUserByUsername(username);
        
        // Update only allowed fields
        if (updatedUser.getFullName() != null) {
            user.setFullName(updatedUser.getFullName());
        }
        if (updatedUser.getAvatarUrl() != null) {
            user.setAvatarUrl(updatedUser.getAvatarUrl());
        }
        
        User saved = userService.updateUser(user);
        saved.setPassword(null);
        return ResponseEntity.ok(saved);
    }
}
