package com.super30.Playgorithm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CodeSubmissionRequest {
    private String gameId;
    private String sessionId;
    private String language;
    private String code;
    private String languageVersion; // e.g., "cpp17", "cpp20", "python3"
}