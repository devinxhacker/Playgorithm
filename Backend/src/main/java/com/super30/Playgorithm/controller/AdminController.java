package com.super30.Playgorithm.controller;

import com.super30.Playgorithm.dto.AdminDashboardStats;
import com.super30.Playgorithm.dto.AdminGameRequest;
import com.super30.Playgorithm.dto.AdminUserResponse;
import com.super30.Playgorithm.dto.AdminUserUpdateRequest;
import com.super30.Playgorithm.model.Game;
import com.super30.Playgorithm.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardStats> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<AdminUserResponse> updateUser(
            @PathVariable String userId,
            @RequestBody AdminUserUpdateRequest request
    ) {
        return ResponseEntity.ok(adminService.updateUser(userId, request));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/games")
    public ResponseEntity<List<Game>> getGames() {
        return ResponseEntity.ok(adminService.getAllGames());
    }

    @PostMapping("/games")
    public ResponseEntity<Game> createGame(@Valid @RequestBody AdminGameRequest request) {
        return ResponseEntity.ok(adminService.createGame(request));
    }

    @PutMapping("/games/{gameId}")
    public ResponseEntity<Game> updateGame(
            @PathVariable String gameId,
            @Valid @RequestBody AdminGameRequest request
    ) {
        return ResponseEntity.ok(adminService.updateGame(gameId, request));
    }

    @PatchMapping("/games/{gameId}/status")
    public ResponseEntity<Game> updateGameStatus(
            @PathVariable String gameId,
            @RequestParam boolean isActive
    ) {
        return ResponseEntity.ok(adminService.updateGameStatus(gameId, isActive));
    }

    @DeleteMapping("/games/{gameId}")
    public ResponseEntity<Void> deleteGame(@PathVariable String gameId) {
        adminService.deleteGame(gameId);
        return ResponseEntity.noContent().build();
    }
}
