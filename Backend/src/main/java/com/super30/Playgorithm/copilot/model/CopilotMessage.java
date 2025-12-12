package com.super30.Playgorithm.copilot.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CopilotMessage {
    private String role;
    private String content;
    private Instant createdAt;
}
