package com.super30.Playgorithm.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CopilotDelta {
    private String agent;
    private String content;
    private String type;
    private boolean finalMessage;
    private CopilotAction action;
}
