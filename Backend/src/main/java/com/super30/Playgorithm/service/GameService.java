package com.super30.Playgorithm.service;

import com.super30.Playgorithm.model.Game;
import com.super30.Playgorithm.model.GameSession;
import com.super30.Playgorithm.repository.GameRepository;
import com.super30.Playgorithm.repository.GameSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GameService {

    private final GameRepository gameRepository;
    private final GameSessionRepository sessionRepository;

    public List<Game> getAllGames() {
        return gameRepository.findByIsActiveTrue();
    }

    public Game getGameById(String id) {
        return gameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Game not found"));
    }

    public List<Game> getGamesByCategory(String category) {
        return gameRepository.findByCategory(category);
    }

    public List<Game> getGamesByDifficulty(String difficulty) {
        return gameRepository.findByDifficulty(difficulty);
    }

    public GameSession startGame(String userId, String gameId) {
        Game game = getGameById(gameId);

        GameSession session = new GameSession();
        session.setUserId(userId);
        session.setGameId(gameId);
        session.setStatus("IN_PROGRESS");
        session.setStartedAt(LocalDateTime.now());
        session.setTotalTestCases(game.getTestCases().size());

        return sessionRepository.save(session);
    }

    public List<GameSession> getUserSessions(String userId) {
        return sessionRepository.findByUserId(userId);
    }

    public GameSession getSessionById(String sessionId) {
        return sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
    }
}
