package com.super30.Playgorithm.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "game_sessions")
public class GameSession {
    @Id
    private String id;

    private String userId;

    private String gameId;

    private String status; // IN_PROGRESS, COMPLETED, ABANDONED

    private LocalDateTime startedAt = LocalDateTime.now();

    private LocalDateTime completedAt;

    private Integer timeTaken; // in seconds

    private Integer score;

    private Integer xpEarned;

    private String submittedCode;

    private String language;

    private List<TestResult> testResults;

    private Integer testCasesPassed;

    private Integer totalTestCases;

    private Map<String, Object> metrics; // lines of code, time complexity, etc.

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TestResult {
        private Integer testCaseNumber;
        private Boolean passed;
        private String actualOutput;
        private String expectedOutput;
        private String error;
        private Long executionTime;
    }
}
