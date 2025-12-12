package com.super30.Playgorithm.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.Map;

@Data
@Builder
public class CopilotSessionResponse {
    private String sessionId;
    private Instant createdAt;
    private Map<String, Object> metadata;
}
