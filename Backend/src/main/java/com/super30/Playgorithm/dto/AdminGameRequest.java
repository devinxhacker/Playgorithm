package com.super30.Playgorithm.dto;

import com.super30.Playgorithm.model.Game;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminGameRequest {

    @NotBlank(message = "Game name is required")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Difficulty is required")
    private String difficulty;

    @Min(value = 0, message = "XP reward must be non-negative")
    private Integer xpReward;

    @Min(value = 0, message = "Time limit must be non-negative")
    private Integer timeLimit;

    private String problemStatement;

    private List<Game.TestCase> testCases;

    private List<String> supportedLanguages;

    private Map<String, Object> metadata;

    private Map<String, String> starterCodeTemplates;

    private String primaryLanguage;

    private String primaryStarterCode;

    private Boolean isActive;
}
