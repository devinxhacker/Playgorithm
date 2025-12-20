package com.super30.Playgorithm.copilot.agent;

import com.super30.Playgorithm.copilot.model.CopilotEvent;
import com.super30.Playgorithm.copilot.model.CopilotSession;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.Map;
import java.util.Optional;

@Component
public class GameCoachAgent implements CopilotAgent {

    @Override
    public String getName() {
        return "Game Coach";
    }

    @Override
    public Optional<String> buildContext(CopilotSession session) {
        return session.getEvents().stream()
                .filter(event -> "GAME_SIGNAL".equalsIgnoreCase(event.getType()))
                .max(Comparator.comparing(CopilotEvent::getCreatedAt))
                .map(CopilotEvent::getPayload)
                .map(this::buildSummary);
    }

    private String buildSummary(Map<String, Object> payload) {
        Object game = payload.getOrDefault("gameId", payload.getOrDefault("title", "a challenge"));
        Object phase = payload.getOrDefault("phase", "active play");
        Object state = payload.getOrDefault("state", "" );
        Object difficulty = payload.getOrDefault("difficulty", "dynamic");
        String emoji = getGameEmoji(String.valueOf(phase));
        return emoji + " Coaching in " + game + " | Phase: " + phase + " | Difficulty: " + difficulty + 
               (state.toString().isEmpty() ? "" : " | Status: " + state) +
               ". Offer strategy tips, encouragement, or explain concepts if user seems stuck.";
    }

    private String getGameEmoji(String phase) {
        if (phase.toLowerCase().contains("start") || phase.toLowerCase().contains("begin")) return "🎬";
        if (phase.toLowerCase().contains("complete") || phase.toLowerCase().contains("finish")) return "🎉";
        if (phase.toLowerCase().contains("stuck") || phase.toLowerCase().contains("error")) return "🆘";
        return "🎯";
    }
}
