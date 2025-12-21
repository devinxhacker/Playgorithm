package com.super30.Playgorithm.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "games")
public class Game {
    @Id
    private String id;

    private String name;

    private String description;

    private String category; // DSA_ALGORITHMS, AI_ALGORITHMS, WEB_DEVELOPMENT, VISUALIZATION, DEBUGGING, CODING_CHALLENGES, GENERAL

    private String difficulty; // EASY, MEDIUM, HARD

    private Integer xpReward;

    private Integer timeLimit; // in seconds

    private String problemStatement;

    private List<TestCase> testCases;

    // Language-specific starter code templates
    private Map<String, String> starterCodeTemplates;

    // Language-specific solution templates
    private Map<String, String> solutionTemplates;

    private List<String> supportedLanguages;

    private Map<String, Object> metadata;

    private String imageUrl;

    private Boolean isActive = true;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TestCase {
        private String input;
        private String expectedOutput;
        private Boolean isHidden = false;
        private Integer points = 10;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LanguageConfig {
        private String language;
        private String version;
        private String fileExtension;
        private String compileCommand;
        private String runCommand;
        private Integer timeoutSeconds;
        private Integer memoryLimitMB;
    }
}
