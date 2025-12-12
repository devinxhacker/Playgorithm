package com.super30.Playgorithm.copilot.agent;

import com.super30.Playgorithm.copilot.model.CopilotSession;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataConciergeAgent implements CopilotAgent {

    @Override
    public String getName() {
        return "Data Concierge";
    }

    @Override
    public Optional<String> buildContext(CopilotSession session) {
        String summary = "Internal data services can fetch live game info, current leaderboards, a player's progress, " +
            "and any starter templates they might need. Always summarize what you can provide rather than exposing raw endpoints.";
        return Optional.of(summary);
    }
}
