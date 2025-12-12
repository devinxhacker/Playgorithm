package com.super30.Playgorithm.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Map;

@Data
public class CopilotChatRequest {
    @NotBlank
    private String sessionId;
    @NotBlank
    private String message;
    private String mode;
    private Map<String, Object> context;
}
