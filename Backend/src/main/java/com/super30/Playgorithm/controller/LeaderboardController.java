package com.super30.Playgorithm.controller;

import com.super30.Playgorithm.model.LeaderboardEntry;
import com.super30.Playgorithm.service.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@CrossOrigin(origins = "*")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping("/global")
    public ResponseEntity<List<LeaderboardEntry>> getGlobalLeaderboard(
            @RequestParam(defaultValue = "100") int limit
    ) {
        return ResponseEntity.ok(leaderboardService.getGlobalLeaderboard(limit));
    }

    @GetMapping("/game/{gameId}")
    public ResponseEntity<List<LeaderboardEntry>> getGameLeaderboard(
            @PathVariable String gameId,
            @RequestParam(defaultValue = "100") int limit
    ) {
        return ResponseEntity.ok(leaderboardService.getGameLeaderboard(gameId, limit));
    }
}
