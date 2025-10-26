package com.super30.Playgorithm.service;

import com.super30.Playgorithm.model.Game;
import com.super30.Playgorithm.model.GameSession;
import com.super30.Playgorithm.repository.GameRepository;
import com.super30.Playgorithm.repository.GameSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GameService {

    private final GameRepository gameRepository;
    private final GameSessionRepository sessionRepository;
    private final LanguageTemplateService languageTemplateService;

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

    public String getStarterCodeForLanguage(String gameId, String language) {
        Game game = getGameById(gameId);
        
        // Check if game has language-specific starter code
        if (game.getStarterCodeTemplates() != null && game.getStarterCodeTemplates().containsKey(language)) {
            return game.getStarterCodeTemplates().get(language);
        }
        
        // Fall back to default template for the language
        return languageTemplateService.getStarterCodeForLanguage(language, game.getCategory());
    }

    public Map<String, String> getAllStarterCodesForGame(String gameId) {
        Game game = getGameById(gameId);
        
        if (game.getStarterCodeTemplates() != null && !game.getStarterCodeTemplates().isEmpty()) {
            return game.getStarterCodeTemplates();
        }
        
        // Generate default templates for all supported languages
        return languageTemplateService.getDefaultStarterCodeTemplates(game.getCategory());
    }

    public List<String> getSupportedLanguages() {
        return List.of("cpp", "cpp17", "cpp20", "java", "python", "python3", "javascript", "c");
    }

    public boolean isLanguageSupported(String language) {
        return languageTemplateService.isLanguageSupported(language);
    }

    public Map<String, String> getLanguageConfigurations() {
        return languageTemplateService.getLanguageConfigurations();
    }
}
