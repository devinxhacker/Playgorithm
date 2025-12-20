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
        Object username = session.getMetadata().get("username");
        Object level = session.getMetadata().get("level");
        String userInfo = username != null ? " for " + username : "";
        String levelInfo = level != null ? " (Level " + level + ")" : "";
        
        String summary = "📦 Data available" + userInfo + levelInfo + ": game stats, leaderboard rankings, user progress, starter code templates. " +
            "When users ask about their performance or standings, offer to check this data. " +
            "Present information conversationally (e.g., 'You're climbing the leaderboard! 📈') without mentioning technical endpoints.";
        return Optional.of(summary);
    }
}
