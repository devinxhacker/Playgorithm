package com.super30.Playgorithm.config;

import com.super30.Playgorithm.model.Game;
import com.super30.Playgorithm.repository.GameRepository;
import com.super30.Playgorithm.service.LanguageTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final GameRepository gameRepository;
    private final LanguageTemplateService languageTemplateService;

    @Override
    public void run(String... args) throws Exception {
        if (gameRepository.count() == 0) {
            initializeGames();
        }
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
                        )
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
                        )
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
                        )
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
                        )
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
                        )
                ),
                createGame(
                        "Speed Typing: Variables",
                        "Type the correct code as fast as possible!",
                        "SPEED_TYPING",
                        "EASY",
                        200,
                        120,
                        "Type: const greeting = 'Hello, World!';",
                        "",
                        Arrays.asList(
                                new Game.TestCase("const greeting = 'Hello, World!';", "const greeting = 'Hello, World!';", false, 10)
                        )
                )
        );

        gameRepository.saveAll(games);
        System.out.println("✅ Initialized " + games.size() + " games");
    }

    private Game createGame(String name, String description, String category, String difficulty,
                           Integer xpReward, Integer timeLimit, String problemStatement,
                           String starterCode, List<Game.TestCase> testCases) {
        Game game = new Game();
        game.setName(name);
        game.setDescription(description);
        game.setCategory(category);
        game.setDifficulty(difficulty);
        game.setXpReward(xpReward);
        game.setTimeLimit(timeLimit);
        game.setProblemStatement(problemStatement);
        game.setTestCases(testCases);
        
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
