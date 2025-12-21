package com.super30.Playgorithm.controller;

import com.super30.Playgorithm.model.User;
import com.super30.Playgorithm.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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
