package com.super30.Playgorithm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameSubmissionRequest {
    private String gameId;
    private String sessionId;
    private String code;
    private String language;
}
