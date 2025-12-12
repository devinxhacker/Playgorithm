package com.super30.Playgorithm.copilot.agent;

import com.super30.Playgorithm.copilot.model.CopilotEvent;
import com.super30.Playgorithm.copilot.model.CopilotSession;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.Optional;

@Component
public class NavigatorAgent implements CopilotAgent {

    @Override
    public String getName() {
        return "Journey Navigator";
    }

    @Override
    public Optional<String> buildContext(CopilotSession session) {
        return session.getEvents().stream()
                .filter(event -> "ROUTE_CHANGE".equalsIgnoreCase(event.getType()))
                .max(Comparator.comparing(CopilotEvent::getCreatedAt))
                .map(event -> {
                    Object path = event.getPayload().getOrDefault("path", "unknown");
                    Object label = event.getPayload().getOrDefault("label", path);
                    return "User is exploring " + label + " (" + path + ")";
                });
    }
}
