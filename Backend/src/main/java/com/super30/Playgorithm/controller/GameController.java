package com.super30.Playgorithm.controller;

import com.super30.Playgorithm.model.Game;
import com.super30.Playgorithm.model.GameSession;
import com.super30.Playgorithm.service.GameService;
import com.super30.Playgorithm.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GameController {

    private final GameService gameService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<Game>> getAllGames() {
        return ResponseEntity.ok(gameService.getAllGames());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Game> getGameById(@PathVariable String id) {
        return ResponseEntity.ok(gameService.getGameById(id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Game>> getGamesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(gameService.getGamesByCategory(category));
    }

    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<List<Game>> getGamesByDifficulty(@PathVariable String difficulty) {
        return ResponseEntity.ok(gameService.getGamesByDifficulty(difficulty));
    }

    @PostMapping("/{gameId}/start")
    public ResponseEntity<GameSession> startGame(
            @PathVariable String gameId,
            Authentication authentication
    ) {
        String username = authentication.getName();
        var user = userService.getUserByUsername(username);
        GameSession session = gameService.startGame(user.getId(), gameId);
        return ResponseEntity.ok(session);
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<GameSession>> getUserSessions(Authentication authentication) {
        String username = authentication.getName();
        var user = userService.getUserByUsername(username);
        return ResponseEntity.ok(gameService.getUserSessions(user.getId()));
    }

    @GetMapping("/sessions/{sessionId}")
    public ResponseEntity<GameSession> getSessionById(@PathVariable String sessionId) {
        return ResponseEntity.ok(gameService.getSessionById(sessionId));
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitGame(
            @RequestBody Map<String, Object> submission,
            Authentication authentication
    ) {
        // This is a simplified version - you'd implement actual code execution here
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Code submitted successfully",
                "score", 100,
                "xpEarned", 50
        ));
    }
}
