package com.super30.Playgorithm.copilot.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CopilotEvent {
    private String type;
    private Map<String, Object> payload;
    private Instant createdAt;
}
