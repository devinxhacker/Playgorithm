package com.super30.Playgorithm.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class CopilotAction {
    private String type;
    private Map<String, Object> payload;
}
