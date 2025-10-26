package com.super30.Playgorithm.service;

import com.super30.Playgorithm.model.LeaderboardEntry;
import com.super30.Playgorithm.repository.LeaderboardRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaderboardService {

    private final LeaderboardRepository leaderboardRepository;

    public LeaderboardService(LeaderboardRepository leaderboardRepository) {
        this.leaderboardRepository = leaderboardRepository;
    }

    public List<LeaderboardEntry> getGlobalLeaderboard(int limit) {
        return leaderboardRepository.findByGameIdIsNullOrderByTotalXPDesc(PageRequest.of(0, limit));
    }

    public List<LeaderboardEntry> getGameLeaderboard(String gameId, int limit) {
        return leaderboardRepository.findByGameIdOrderByScoreDescTimeTakenAsc(gameId, PageRequest.of(0, limit));
    }

    public void updateLeaderboard(String userId, String username, String gameId, Integer score, Integer timeTaken, Integer totalXP) {
        LeaderboardEntry entry = new LeaderboardEntry();
        entry.setUserId(userId);
        entry.setUsername(username);
        entry.setGameId(gameId);
        entry.setScore(score);
        entry.setTotalXP(totalXP);
        entry.setTimeTaken(timeTaken);

        leaderboardRepository.save(entry);
    }
}
