package com.super30.Playgorithm.dto;

import lombok.Data;

import java.util.Map;

@Data
public class CopilotSessionRequest {
    private String userId;
    private Map<String, Object> metadata;
}
