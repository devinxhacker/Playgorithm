package com.super30.Playgorithm.config;

import com.super30.Playgorithm.model.Game;
import com.super30.Playgorithm.model.User;
import com.super30.Playgorithm.repository.GameRepository;
import com.super30.Playgorithm.repository.UserRepository;
import com.super30.Playgorithm.service.LanguageTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class DataInitializer implements CommandLineRunner {

    private final GameRepository gameRepository;
    private final UserRepository userRepository;
    private final LanguageTemplateService languageTemplateService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(GameRepository gameRepository, 
                          UserRepository userRepository,
                          LanguageTemplateService languageTemplateService,
                          PasswordEncoder passwordEncoder) {
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
        this.languageTemplateService = languageTemplateService;
        this.passwordEncoder = passwordEncoder;
    }

        @Value("${admin.bootstrap.username:}")
        private String bootstrapAdminUsername;

        @Value("${admin.bootstrap.email:}")
        private String bootstrapAdminEmail;

        @Value("${admin.bootstrap.password:}")
        private String bootstrapAdminPassword;

    @Override
    public void run(String... args) throws Exception {
                bootstrapAdmin();
        if (gameRepository.count() == 0) {
            initializeGames();
        }
    }

        private void bootstrapAdmin() {
                if (userRepository.existsByRolesContaining("ROLE_ADMIN")) {
                        return;
                }

                if (!StringUtils.hasText(bootstrapAdminUsername) ||
                                !StringUtils.hasText(bootstrapAdminEmail) ||
                                !StringUtils.hasText(bootstrapAdminPassword)) {
                        System.out.println("⚠️ Admin bootstrap skipped. Missing credentials in properties.");
                        return;
                }

                User admin = new User();
                admin.setUsername(bootstrapAdminUsername);
                admin.setEmail(bootstrapAdminEmail);
                admin.setFullName("Playgorithm Admin");
                admin.setPassword(passwordEncoder.encode(bootstrapAdminPassword));
                admin.setRoles(Arrays.asList("ROLE_ADMIN", "ROLE_USER"));
                admin.setAchievementIds(new java.util.ArrayList<>());
                admin.setIsActive(true);
                admin.setLevel(1);
                admin.setTotalXP(0);
                admin.setGamesPlayed(0);
                admin.setGamesWon(0);
                admin.setWinRate(0.0);

                userRepository.save(admin);
                System.out.println("✅ Bootstrapped default admin user '" + bootstrapAdminUsername + "'");
        }

    private void initializeGames() {
        List<Game> games = Arrays.asList(
                createGame(
                        "Sorting Showdown",
                        "Race against time to implement the fastest sorting algorithm!",
                        "SORTING",
                        "EASY",
                        500,
                        300,
                        "Implement a function to sort an array of numbers in ascending order.",
                        
                        "function sortArray(arr) {\n  // Your code here\n  return arr;\n}",
                        Arrays.asList(
                                new Game.TestCase("[5, 2, 8, 1, 9]", "[1, 2, 5, 8, 9]", false, 10),
                                new Game.TestCase("[3, 3, 3]", "[3, 3, 3]", false, 10),
                                new Game.TestCase("[]", "[]", false, 10)
                        ),
                        "/src/assets/images/sorting-showdown.png"
                ),
                createGame(
                        "Graph Gladiator",
                        "Navigate through complex graph structures and find the shortest path!",
                        "GRAPH",
                        "MEDIUM",
                        1000,
                        600,
                        "Implement BFS to find the shortest path between two nodes in a graph.",
                        "function shortestPath(graph, start, end) {\n  // Your code here\n  return [];\n}",
                        Arrays.asList(
                                new Game.TestCase("graph: [[1,2],[3],[3],[]], start: 0, end: 3", "[0, 1, 3]", false, 20),
                                new Game.TestCase("graph: [[1],[2],[]], start: 0, end: 2", "[0, 1, 2]", false, 20)
                        ),
                        "/src/assets/images/algo-battles.jpg"
                ),
                createGame(
                        "Dynamic Programming Duel",
                        "Master optimization by breaking down complex problems!",
                        "DYNAMIC_PROGRAMMING",
                        "HARD",
                        2000,
                        900,
                        "Find the longest increasing subsequence in an array.",
                        "function longestIncreasingSubsequence(arr) {\n  // Your code here\n  return 0;\n}",
                        Arrays.asList(
                                new Game.TestCase("[10, 9, 2, 5, 3, 7, 101, 18]", "4", false, 30),
                                new Game.TestCase("[0, 1, 0, 3, 2, 3]", "4", false, 30)
                        ),
                        "/src/assets/images/epic-feature.jpg"
                ),
                createGame(
                        "Binary Search Challenge",
                        "Find elements in sorted arrays with lightning speed!",
                        "SEARCHING",
                        "EASY",
                        400,
                        300,
                        "Implement binary search to find a target value in a sorted array.",
                        "function binarySearch(arr, target) {\n  // Your code here\n  return -1;\n}",
                        Arrays.asList(
                                new Game.TestCase("arr: [1, 2, 3, 4, 5], target: 3", "2", false, 10),
                                new Game.TestCase("arr: [1, 2, 3, 4, 5], target: 6", "-1", false, 10)
                        ),
                        "/src/assets/images/futuristic-ninja-digital-art.jpg"
                ),
                createGame(
                        "Code Golf: FizzBuzz",
                        "Write the shortest code possible to solve FizzBuzz!",
                        "CODE_GOLF",
                        "EASY",
                        300,
                        600,
                        "Print numbers 1-100. For multiples of 3 print Fizz, for 5 print Buzz, for both print FizzBuzz.",
                        "function fizzBuzz(n) {\n  // Your code here\n}",
                        Arrays.asList(
                                new Game.TestCase("15", "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz", false, 10)
                        ),
                        "/src/assets/images/code-gulf.png"
                ),
                createGame(
                        "Speed Debugging: Bug Hunt",
                        "Race through syntax, logic, and runtime gauntlets to stabilize production before the clock hits zero!",
                        "DEBUGGING",
                        "MEDIUM",
                        900,
                        900,
                        "Fix 30 bite-sized bugs across Syntax Sprint, Logic Lab, and Runtime Rumble levels.",
                        "",
                        Arrays.asList(
                                new Game.TestCase("Levels", "3", false, 10),
                                new Game.TestCase("Bugs per level", "10", false, 10)
                        ),
                        "/src/assets/images/bug-hunt.png"
                ),
                createGame(
                        "Tic-Tac-Toe Arena",
                        "Challenge the AI in a classic game of Tic-Tac-Toe with strategic gameplay!",
                        "GRAPH",
                        "EASY",
                        500,
                        600,
                        "Master game theory and Minimax algorithm through strategic gameplay!",
                        "// Tic-Tac-Toe with Minimax Algorithm\nfunction minimax(board, isMaximizing) {\n  // Your code here\n}",
                        Arrays.asList(
                                new Game.TestCase("Perfect play always results in a tie", "TIE", false, 50)
                        ),
                        "/src/assets/images/tic-tac-toe.png"
                ),
                createGame(
                        "Flexbox Arena",
                        "Master CSS Flexbox through interactive challenges and warrior battles!",
                        "CSS_FLEXBOX",
                        "MEDIUM",
                        750,
                        1800,
                        "Learn and master CSS Flexbox properties through 8 exciting levels of warrior combat!",
                        "",
                        Arrays.asList(
                                new Game.TestCase("Level 1", "Basic Flexbox", false, 10),
                                new Game.TestCase("Level 2", "Flex Direction", false, 10),
                                new Game.TestCase("Level 3", "Justify Content", false, 10),
                                new Game.TestCase("Level 4", "Align Items", false, 10),
                                new Game.TestCase("Level 5", "Flex Wrap", false, 10),
                                new Game.TestCase("Level 6", "Align Content", false, 10),
                                new Game.TestCase("Level 7", "Flex Properties", false, 10),
                                new Game.TestCase("Level 8", "Master Challenge", false, 10)
                        ),
                        "/src/assets/images/flexbox-arena.png"
                ),
                createGame(
                        "Queens Arena",
                        "Master the classic N-Queens problem with beautiful visuals and learn backtracking!",
                        "GRAPH",
                        "MEDIUM",
                        1000,
                        1200,
                        "Place N queens on an N×N chessboard so that no two queens threaten each other. Learn backtracking algorithm!",
                        "",
                        Arrays.asList(
                                new Game.TestCase("4x4 Board", "2 solutions", false, 20),
                                new Game.TestCase("8x8 Board", "92 solutions", false, 30),
                                new Game.TestCase("12x12 Board", "14200 solutions", false, 50)
                        ),
                        "/src/assets/images/queen-arena.png"
                ),
                createGame(
                        "Zip Game",
                        "Connect numbers 1 to N by moving through adjacent cells. New puzzle every time!",
                        "GRAPH",
                        "EASY",
                        400,
                        300,
                        "Create a path from 1 to N by visiting each number in sequence, moving only to adjacent cells!",
                        "",
                        Arrays.asList(
                                new Game.TestCase("3x3 Grid", "Connect 1-9", false, 10),
                                new Game.TestCase("4x4 Grid", "Connect 1-16", false, 15),
                                new Game.TestCase("5x5 Grid", "Connect 1-25", false, 20),
                                new Game.TestCase("6x6 Grid", "Connect 1-36", false, 25),
                                new Game.TestCase("7x7 Grid", "Connect 1-49", false, 30)
                        ),
                        "/src/assets/images/zip-game.png"
                ),
                createGame(
                        "Grid Arena",
                        "Master CSS Grid layout by growing your carrot garden! 28 levels of grid mastery.",
                        "CSS_FLEXBOX",
                        "MEDIUM",
                        1500,
                        3600,
                        "Learn CSS Grid properties through 28 challenging levels of garden design!",
                        "",
                        Arrays.asList(
                                new Game.TestCase("Level 1-7", "Basic Grid", false, 10),
                                new Game.TestCase("Level 8-14", "Grid Areas", false, 15),
                                new Game.TestCase("Level 15-21", "Grid Template", false, 20),
                                new Game.TestCase("Level 22-28", "Advanced Grid", false, 25)
                        ),
                        "/src/assets/images/grid-arena.png"
                ),
                createGame(
                        "Missionaries & Cannibals",
                        "Solve the classic river-crossing puzzle! Learn constraint satisfaction and state-space search.",
                        "GRAPH",
                        "MEDIUM",
                        1200,
                        900,
                        "Get 3 missionaries and 3 cannibals across the river using a 2-person boat. Cannibals must never outnumber missionaries!",
                        "",
                        Arrays.asList(
                                new Game.TestCase("Move 1", "Valid", false, 10),
                                new Game.TestCase("Move 2", "Valid", false, 10),
                                new Game.TestCase("Move 3", "Valid", false, 10),
                                new Game.TestCase("Move 4", "Valid", false, 10),
                                new Game.TestCase("Move 5", "Valid", false, 10),
                                new Game.TestCase("Move 6", "Valid", false, 10),
                                new Game.TestCase("Move 7", "Valid", false, 10),
                                new Game.TestCase("Move 8", "Valid", false, 10),
                                new Game.TestCase("Move 9", "Valid", false, 10),
                                new Game.TestCase("Move 10", "Valid", false, 10),
                                new Game.TestCase("Move 11", "Complete", false, 10)
                        ),
                        "/src/assets/images/mission-cannible.png"
                ),
                createGame(
                        "Algorithm Visualizer",
                        "Explore 8 interactive algorithm visualizations: sorting, pathfinding, recursion, and more!",
                        "ALL",
                        "MEDIUM",
                        2000,
                        0,
                        "Interactive visualizations for: Sorting Algorithms, Pathfinding, Binary Search, N-Queens, Game of Life, Recursion Tree, Convex Hull, and 15-Puzzle!",
                        "",
                        Arrays.asList(
                                new Game.TestCase("Sorting", "6 algorithms", false, 25),
                                new Game.TestCase("Pathfinding", "4 algorithms", false, 25),
                                new Game.TestCase("Binary Search", "Interactive", false, 25),
                                new Game.TestCase("N-Queens", "Backtracking", false, 25),
                                new Game.TestCase("Game of Life", "Cellular Automata", false, 25),
                                new Game.TestCase("Recursion Tree", "Visual Tree", false, 25),
                                new Game.TestCase("Convex Hull", "Geometry", false, 25),
                                new Game.TestCase("15-Puzzle", "A* Search", false, 25)
                        ),
                        "/src/assets/images/algo-visu.png"
                ),
                createGame(
                        "Chess Arena",
                        "Play chess against AI with Minimax algorithm! Learn mode explains alpha-beta pruning.",
                        "GRAPH",
                        "HARD",
                        2500,
                        0,
                        "Play chess with three difficulty levels. Learn mode explains the Minimax algorithm and Alpha-Beta pruning step-by-step!",
                        "",
                        Arrays.asList(
                                new Game.TestCase("Easy AI", "Random moves", false, 30),
                                new Game.TestCase("Medium AI", "Depth 2 Minimax", false, 40),
                                new Game.TestCase("Hard AI", "Depth 3 with pruning", false, 50)
                        ),
                        "/src/assets/images/chess-arena.png"
                )
        );

        gameRepository.saveAll(games);
        System.out.println("✅ Initialized " + games.size() + " games");
    }

    private Game createGame(String name, String description, String category, String difficulty,
                           Integer xpReward, Integer timeLimit, String problemStatement,
                           String starterCode, List<Game.TestCase> testCases, String imageUrl) {
        Game game = new Game();
        game.setName(name);
        game.setDescription(description);
        game.setCategory(category);
        game.setDifficulty(difficulty);
        game.setXpReward(xpReward);
        game.setTimeLimit(timeLimit);
        game.setProblemStatement(problemStatement);
        game.setTestCases(testCases);
        game.setImageUrl(imageUrl);
        
        // Set up multi-language starter code templates
        Map<String, String> starterCodeTemplates = new HashMap<>();
        
        // Add language-specific templates
        starterCodeTemplates.put("cpp", languageTemplateService.getStarterCodeForLanguage("cpp", category));
        starterCodeTemplates.put("cpp17", languageTemplateService.getStarterCodeForLanguage("cpp17", category));
        starterCodeTemplates.put("cpp20", languageTemplateService.getStarterCodeForLanguage("cpp20", category));
        starterCodeTemplates.put("java", languageTemplateService.getStarterCodeForLanguage("java", category));
        starterCodeTemplates.put("python", languageTemplateService.getStarterCodeForLanguage("python", category));
        starterCodeTemplates.put("python3", languageTemplateService.getStarterCodeForLanguage("python3", category));
        starterCodeTemplates.put("javascript", starterCode); // Use the provided JavaScript code
        starterCodeTemplates.put("c", languageTemplateService.getStarterCodeForLanguage("c", category));
        
        game.setStarterCodeTemplates(starterCodeTemplates);
        
        // Set supported languages
                game.setSupportedLanguages(Arrays.asList("cpp", "cpp17", "cpp20", "java", "python", "python3", "javascript", "c"));
        game.setIsActive(true);
        return game;
    }
}
