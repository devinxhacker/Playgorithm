package com.super30.Playgorithm.copilot.model;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class CopilotSession {
    private String id;
    private String userId;
    private Instant createdAt;
    private Instant updatedAt;
    @Builder.Default
    private Map<String, Object> metadata = new java.util.concurrent.ConcurrentHashMap<>();
    @Builder.Default
    private List<CopilotEvent> events = new java.util.concurrent.CopyOnWriteArrayList<>();
    @Builder.Default
    private List<CopilotMessage> transcript = new java.util.concurrent.CopyOnWriteArrayList<>();

    public void touch() {
        updatedAt = Instant.now();
    }
}
