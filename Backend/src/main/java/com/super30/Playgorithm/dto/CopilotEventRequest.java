package com.super30.Playgorithm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

@Data
public class CopilotEventRequest {
    @NotBlank
    private String sessionId;
    @NotBlank
    private String type;
    @NotNull
    private Map<String, Object> payload;
    private boolean highPriority;
}
