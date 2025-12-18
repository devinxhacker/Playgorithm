package com.super30.Playgorithm.service;

import com.super30.Playgorithm.dto.AdminDashboardStats;
import com.super30.Playgorithm.dto.AdminGameRequest;
import com.super30.Playgorithm.dto.AdminUserResponse;
import com.super30.Playgorithm.dto.AdminUserUpdateRequest;
import com.super30.Playgorithm.model.Game;
import com.super30.Playgorithm.model.User;
import com.super30.Playgorithm.repository.GameRepository;
import com.super30.Playgorithm.repository.GameSessionRepository;
import com.super30.Playgorithm.repository.LeaderboardRepository;
import com.super30.Playgorithm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final LeaderboardRepository leaderboardRepository;
    private final GameSessionRepository gameSessionRepository;
    private final LanguageTemplateService languageTemplateService;

    public AdminDashboardStats getDashboardStats() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByIsActiveTrue();
        long adminUsers = userRepository.countByRolesContaining("ROLE_ADMIN");
        long totalGames = gameRepository.count();
        long activeGames = gameRepository.countByIsActiveTrue();
        long totalSessions = gameSessionRepository.count();
        long totalLeaderboardEntries = leaderboardRepository.count();

        List<AdminDashboardStats.UserSnapshot> recentUsers = userRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(this::toUserSnapshot)
                .collect(Collectors.toList());

        List<AdminDashboardStats.GameSnapshot> spotlightGames = gameRepository
                .findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "xpReward")))
                .getContent()
                .stream()
                .map(this::toGameSnapshot)
                .collect(Collectors.toList());

        return AdminDashboardStats.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .adminUsers(adminUsers)
                .totalGames(totalGames)
                .activeGames(activeGames)
                .totalSessions(totalSessions)
                .totalLeaderboardEntries(totalLeaderboardEntries)
                .recentUsers(recentUsers)
                .spotlightGames(spotlightGames)
                .build();
    }

    public List<AdminUserResponse> getAllUsers() {
        return userRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(this::toAdminUserResponse)
                .collect(Collectors.toList());
    }

    public AdminUserResponse updateUser(String userId, AdminUserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }

        if (request.getIsActive() != null) {
            if (!request.getIsActive() && isLastAdmin(user)) {
                throw new RuntimeException("Cannot deactivate the last admin user");
            }
            user.setIsActive(request.getIsActive());
        }

        if (!CollectionUtils.isEmpty(request.getRoles())) {
            if (isRemovingAdminRole(user, request.getRoles()) && isLastAdmin(user)) {
                throw new RuntimeException("Cannot remove admin role from the last admin user");
            }
            user.setRoles(new ArrayList<>(request.getRoles()));
        }

        User saved = userRepository.save(user);
        return toAdminUserResponse(saved);
    }

    public void deleteUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (isLastAdmin(user)) {
            throw new RuntimeException("Cannot delete the last admin user");
        }

        userRepository.delete(user);
    }

    public List<Game> getAllGames() {
        return gameRepository.findAll(Sort.by(Sort.Direction.ASC, "name"));
    }

    public Game createGame(AdminGameRequest request) {
        Game game = new Game();
        applyGameRequest(game, request);
        return gameRepository.save(game);
    }

    public Game updateGame(String gameId, AdminGameRequest request) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        applyGameRequest(game, request);
        return gameRepository.save(game);
    }

    public Game updateGameStatus(String gameId, boolean isActive) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        game.setIsActive(isActive);
        return gameRepository.save(game);
    }

    public void deleteGame(String gameId) {
        gameRepository.deleteById(gameId);
    }

    private void applyGameRequest(Game game, AdminGameRequest request) {
        game.setName(request.getName());
        game.setDescription(request.getDescription());
        game.setCategory(request.getCategory());
        game.setDifficulty(request.getDifficulty());
        game.setXpReward(request.getXpReward() != null ? request.getXpReward() : 0);
        game.setTimeLimit(request.getTimeLimit() != null ? request.getTimeLimit() : 0);
        game.setProblemStatement(request.getProblemStatement());
        game.setImageUrl(request.getImageUrl());
        game.setIsActive(request.getIsActive() != null ? request.getIsActive() : Boolean.TRUE);

        List<Game.TestCase> testCases = request.getTestCases();
        if (CollectionUtils.isEmpty(testCases)) {
            testCases = List.of(new Game.TestCase("", "", false, 10));
        }
        game.setTestCases(testCases);

        List<String> languages = determineLanguages(request);
        game.setSupportedLanguages(languages);

        Map<String, String> starterTemplates = buildStarterTemplates(request, languages, game.getCategory());
        game.setStarterCodeTemplates(starterTemplates);

        if (request.getMetadata() != null) {
            game.setMetadata(request.getMetadata());
        } else if (game.getMetadata() == null) {
            game.setMetadata(new HashMap<>());
        }
    }

    private List<String> determineLanguages(AdminGameRequest request) {
        if (!CollectionUtils.isEmpty(request.getSupportedLanguages())) {
            return request.getSupportedLanguages().stream()
                    .map(lang -> lang.toLowerCase(Locale.ROOT))
                    .distinct()
                    .collect(Collectors.toList());
        }
        return languageTemplateService.getSupportedLanguageKeys();
    }

    private Map<String, String> buildStarterTemplates(AdminGameRequest request, List<String> languages, String category) {
        Map<String, String> templates = new HashMap<>(languageTemplateService.getDefaultStarterCodeTemplates(category));

        if (request.getStarterCodeTemplates() != null) {
            request.getStarterCodeTemplates().forEach((lang, code) -> {
                if (StringUtils.hasText(lang) && StringUtils.hasText(code)) {
                    templates.put(lang.toLowerCase(Locale.ROOT), code);
                }
            });
        }

        if (StringUtils.hasText(request.getPrimaryLanguage()) && StringUtils.hasText(request.getPrimaryStarterCode())) {
            templates.put(request.getPrimaryLanguage().toLowerCase(Locale.ROOT), request.getPrimaryStarterCode());
        }

        return languages.stream()
                .filter(templates::containsKey)
                .collect(Collectors.toMap(lang -> lang, templates::get));
    }

    private boolean isLastAdmin(User user) {
        return resolveRoles(user).contains("ROLE_ADMIN") && userRepository.countByRolesContaining("ROLE_ADMIN") <= 1;
    }

    private boolean isRemovingAdminRole(User user, List<String> newRoles) {
        return resolveRoles(user).contains("ROLE_ADMIN") && !newRoles.contains("ROLE_ADMIN");
    }

    private List<String> resolveRoles(User user) {
        if (user.getRoles() == null) {
            user.setRoles(new ArrayList<>());
        }
        return user.getRoles();
    }

    private AdminUserResponse toAdminUserResponse(User user) {
        return AdminUserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
            .roles(user.getRoles() != null ? user.getRoles() : List.of())
                .isActive(user.getIsActive())
                .level(user.getLevel())
                .totalXP(user.getTotalXP())
                .gamesPlayed(user.getGamesPlayed())
                .gamesWon(user.getGamesWon())
                .winRate(user.getWinRate())
                .createdAt(user.getCreatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }

    private AdminDashboardStats.UserSnapshot toUserSnapshot(User user) {
        return AdminDashboardStats.UserSnapshot.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
            .roles(user.getRoles() != null ? user.getRoles() : List.of())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }

    private AdminDashboardStats.GameSnapshot toGameSnapshot(Game game) {
        return AdminDashboardStats.GameSnapshot.builder()
                .id(game.getId())
                .name(game.getName())
                .category(game.getCategory())
                .difficulty(game.getDifficulty())
                .xpReward(game.getXpReward())
                .isActive(game.getIsActive())
                .build();
    }
}
