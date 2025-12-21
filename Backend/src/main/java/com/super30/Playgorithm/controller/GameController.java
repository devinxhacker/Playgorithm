package com.super30.Playgorithm.controller;

import com.super30.Playgorithm.model.Game;
import com.super30.Playgorithm.model.GameSession;
import com.super30.Playgorithm.service.GameService;
import com.super30.Playgorithm.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = "*")
public class GameController {

    private final GameService gameService;
    private final UserService userService;

    public GameController(GameService gameService, UserService userService) {
        this.gameService = gameService;
        this.userService = userService;
    }

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
        String username = authentication.getName();
        var user = userService.getUserByUsername(username);
        
        // Get XP from submission or use default
        Integer xpEarned = submission.get("xpEarned") != null 
            ? Integer.valueOf(submission.get("xpEarned").toString()) 
            : 50;
        Boolean won = submission.get("won") != null 
            ? Boolean.valueOf(submission.get("won").toString()) 
            : true;
        
        // Update user stats
        userService.addXP(user.getId(), xpEarned);
        userService.incrementGamesPlayed(user.getId());
        if (won) {
            userService.incrementGamesWon(user.getId());
        }
        
        // Get updated user data
        var updatedUser = userService.getUserById(user.getId());
        
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Game completed successfully",
                "score", 100,
                "xpEarned", xpEarned,
                "totalXP", updatedUser.getTotalXP(),
                "level", updatedUser.getLevel(),
                "gamesPlayed", updatedUser.getGamesPlayed(),
                "gamesWon", updatedUser.getGamesWon(),
                "winRate", updatedUser.getWinRate()
        ));
    }

    @PostMapping("/complete")
    public ResponseEntity<?> completeGame(
            @RequestBody Map<String, Object> gameData,
            Authentication authentication
    ) {
        String username = authentication.getName();
        var user = userService.getUserByUsername(username);
        
        // Get XP from request or use default
        Integer xpEarned = gameData.get("xpEarned") != null 
            ? Integer.valueOf(gameData.get("xpEarned").toString()) 
            : 50;
        Boolean won = gameData.get("won") != null 
            ? Boolean.valueOf(gameData.get("won").toString()) 
            : true;
        String gameId = gameData.get("gameId") != null 
            ? gameData.get("gameId").toString() 
            : null;
        
        // Update user stats
        userService.addXP(user.getId(), xpEarned);
        userService.incrementGamesPlayed(user.getId());
        if (won) {
            userService.incrementGamesWon(user.getId());
        }
        
        // Get updated user data
        var updatedUser = userService.getUserById(user.getId());
        
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Game completed successfully",
                "xpEarned", xpEarned,
                "totalXP", updatedUser.getTotalXP(),
                "level", updatedUser.getLevel(),
                "gamesPlayed", updatedUser.getGamesPlayed(),
                "gamesWon", updatedUser.getGamesWon(),
                "winRate", updatedUser.getWinRate()
        ));
    }

    // Language-specific endpoints
    @GetMapping("/{gameId}/starter-code/{language}")
    public ResponseEntity<Map<String, String>> getStarterCode(
            @PathVariable String gameId,
            @PathVariable String language
    ) {
        if (!gameService.isLanguageSupported(language)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Language not supported: " + language));
        }
        
        String starterCode = gameService.getStarterCodeForLanguage(gameId, language);
        return ResponseEntity.ok(Map.of(
                "language", language,
                "starterCode", starterCode
        ));
    }

    @GetMapping("/{gameId}/starter-codes")
    public ResponseEntity<Map<String, String>> getAllStarterCodes(@PathVariable String gameId) {
        Map<String, String> starterCodes = gameService.getAllStarterCodesForGame(gameId);
        return ResponseEntity.ok(starterCodes);
    }

    @GetMapping("/supported-languages")
    public ResponseEntity<List<String>> getSupportedLanguages() {
        return ResponseEntity.ok(gameService.getSupportedLanguages());
    }

    @GetMapping("/language-configs")
    public ResponseEntity<Map<String, String>> getLanguageConfigurations() {
        return ResponseEntity.ok(gameService.getLanguageConfigurations());
    }

    @GetMapping("/languages/info")
    public ResponseEntity<Map<String, Object>> getLanguagesInfo() {
        Map<String, Object> languageInfo = Map.of(
            "supportedLanguages", gameService.getSupportedLanguages(),
            "languageDetails", Map.of(
                "cpp", Map.of(
                    "displayName", "C++",
                    "version", "g++ 9.4.0",
                    "description", "Standard C++ with STL support",
                    "fileExtension", ".cpp"
                ),
                "cpp17", Map.of(
                    "displayName", "C++17",
                    "version", "g++ 9.4.0",
                    "description", "C++17 with modern features like structured bindings",
                    "fileExtension", ".cpp"
                ),
                "cpp20", Map.of(
                    "displayName", "C++20",
                    "version", "g++ 10.3.0",
                    "description", "C++20 with ranges, concepts, and coroutines",
                    "fileExtension", ".cpp"
                ),
                "java", Map.of(
                    "displayName", "Java",
                    "version", "OpenJDK 11",
                    "description", "Java with full standard library",
                    "fileExtension", ".java"
                ),
                "python", Map.of(
                    "displayName", "Python 2.7",
                    "version", "Python 2.7",
                    "description", "Legacy Python 2.7 support",
                    "fileExtension", ".py"
                ),
                "python3", Map.of(
                    "displayName", "Python 3",
                    "version", "Python 3.9",
                    "description", "Modern Python with type hints support",
                    "fileExtension", ".py"
                ),
                "javascript", Map.of(
                    "displayName", "JavaScript",
                    "version", "Node.js 16",
                    "description", "JavaScript runtime with Node.js",
                    "fileExtension", ".js"
                ),
                "c", Map.of(
                    "displayName", "C",
                    "version", "gcc 9.4.0",
                    "description", "Standard C with standard library",
                    "fileExtension", ".c"
                )
            ),
            "defaultLanguage", "cpp"
        );
        
        return ResponseEntity.ok(languageInfo);
    }
}
