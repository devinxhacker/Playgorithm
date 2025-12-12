package com.super30.Playgorithm.copilot.agent;

import com.super30.Playgorithm.copilot.model.CopilotSession;

import java.util.Optional;

public interface CopilotAgent {
    String getName();

    /**
     * Returns a short context string describing what this agent currently
     * observes and can do for the user. Empty when there is no signal.
     */
    Optional<String> buildContext(CopilotSession session);
}
