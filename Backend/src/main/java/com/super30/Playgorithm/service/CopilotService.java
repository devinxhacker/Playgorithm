package com.super30.Playgorithm.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.super30.Playgorithm.copilot.GeminiClient;
import com.super30.Playgorithm.copilot.agent.CopilotAgent;
import com.super30.Playgorithm.copilot.model.CopilotEvent;
import com.super30.Playgorithm.copilot.model.CopilotMessage;
import com.super30.Playgorithm.copilot.model.CopilotSession;
import com.super30.Playgorithm.dto.CopilotAction;
import com.super30.Playgorithm.dto.CopilotChatRequest;
import com.super30.Playgorithm.dto.CopilotDelta;
import com.super30.Playgorithm.dto.CopilotEventRequest;
import com.super30.Playgorithm.dto.CopilotSessionRequest;
import com.super30.Playgorithm.dto.CopilotSessionResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;

import java.time.Instant;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class CopilotService {

    private static final TypeReference<Map<String, Object>> MAP_TYPE = new TypeReference<>() {};

    private final GeminiClient geminiClient;
    private final List<CopilotAgent> agents;
    private final ObjectMapper objectMapper;

    private final Map<String, CopilotSession> sessions = new ConcurrentHashMap<>();

    public CopilotSessionResponse createSession(CopilotSessionRequest request) {
        String sessionId = UUID.randomUUID().toString();
        CopilotSession session = CopilotSession.builder()
                .id(sessionId)
                .userId(request != null ? request.getUserId() : null)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .metadata(request != null && request.getMetadata() != null
                        ? new ConcurrentHashMap<>(request.getMetadata())
                        : new ConcurrentHashMap<>())
                .build();
        sessions.put(sessionId, session);
        return CopilotSessionResponse.builder()
                .sessionId(sessionId)
                .createdAt(session.getCreatedAt())
                .metadata(session.getMetadata())
                .build();
    }

    public void recordEvent(CopilotEventRequest request, String principal) {
        CopilotSession session = requireSession(request.getSessionId());
        String resolvedPrincipal = ensureOwnership(session, principal);
        session.getEvents().add(CopilotEvent.builder()
                .type(request.getType())
                .payload(request.getPayload())
                .createdAt(Instant.now())
                .build());
        session.touch();
        if (request.isHighPriority()) {
            session.getMetadata().put("lastPriorityEvent", request.getPayload());
        }
        log.debug("Copilot event [{}] accepted for session {} by {}", request.getType(), session.getId(), resolvedPrincipal);
    }

    public Flux<CopilotDelta> streamChat(CopilotChatRequest request, String principal) {
        CopilotSession session = requireSession(request.getSessionId());
        String resolvedPrincipal = ensureOwnership(session, principal);
        session.touch();
        session.getTranscript().add(CopilotMessage.builder()
                .role("user")
                .content(request.getMessage())
                .createdAt(Instant.now())
                .build());

        String prompt = buildPrompt(session, request);
        StringBuilder accumulator = new StringBuilder();

        return geminiClient.streamResponse(prompt)
                .map(chunk -> {
                    accumulator.append(chunk).append(' ');
                    return CopilotDelta.builder()
                            .agent("orchestrator")
                            .content(chunk)
                            .type("message")
                            .finalMessage(false)
                            .build();
                })
                .concatWith(Flux.defer(() -> {
                    ParsedResponse parsed = extractAction(accumulator.toString());
                    String finalText = StringUtils.hasText(parsed.text())
                            ? parsed.text()
                            : "I could not build a response right now.";

                    session.getTranscript().add(CopilotMessage.builder()
                            .role("assistant")
                            .content(finalText)
                            .createdAt(Instant.now())
                            .build());

                    CopilotDelta messageDelta = CopilotDelta.builder()
                            .agent("orchestrator")
                            .content(finalText)
                            .type("message")
                            .finalMessage(true)
                            .build();

                    if (parsed.action() != null) {
                        CopilotDelta actionDelta = CopilotDelta.builder()
                                .agent("orchestrator")
                                .type("action")
                                .action(parsed.action())
                                .finalMessage(false)
                                .build();
                        return Flux.just(messageDelta, actionDelta);
                    }
                    return Flux.just(messageDelta);
                }));
    }

    private CopilotSession requireSession(String sessionId) {
        CopilotSession session = sessions.get(sessionId);
        if (session == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Unknown Copilot session: " + sessionId);
        }
        return session;
    }

    private String ensureOwnership(CopilotSession session, String principal) {
        String derivedPrincipal = StringUtils.hasText(principal) ? principal : derivePrincipalFromSession(session);
        if (!StringUtils.hasText(derivedPrincipal)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Copilot session is not linked to a user");
        }
        if (session.getUserId() == null) {
            session.setUserId(derivedPrincipal);
        }
        Object metadataUsername = session.getMetadata().get("username");
        boolean matchesPrincipal = derivedPrincipal.equals(session.getUserId())
                || (metadataUsername instanceof String && derivedPrincipal.equals(metadataUsername));
        if (!matchesPrincipal) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Session is locked to another user");
        }
        return derivedPrincipal;
    }

    private String derivePrincipalFromSession(CopilotSession session) {
        if (StringUtils.hasText(session.getUserId())) {
            return session.getUserId();
        }
        Object metadataUsername = session.getMetadata().get("username");
        if (metadataUsername instanceof String username && StringUtils.hasText(username)) {
            return username;
        }
        return null;
    }

    private String buildPrompt(CopilotSession session, CopilotChatRequest request) {
        StringBuilder builder = new StringBuilder();
        builder.append("You are Playgorithm Copilot, a multi-agent assistant coordinating planners, game coaches, and data concierges. ")
                .append("You watch the user's current activity and respond proactively with concise, encouraging guidance. ")
                .append("Never claim to perform backend actions; describe what the platform can do on their behalf and keep responses user-facing. ")
                .append("If the UI should react (for example, opening Sorting Showdown), append a final line exactly once using this syntax: [[ACTION:{\\\"type\\\":\\\"NAVIGATE\\\",\\\"path\\\":\\\"/game/sorting-showdown\\\",\\\"state\\\":{\\\"mode\\\":\\\"bubble-sort\\\"}}]]. ")
                .append("Keep the JSON valid and only include fields that are required.\n\n");

        builder.append("Route directory (for ACTION usage only, never mention paths to the user): ")
            .append("Sorting Showdown=/game/sorting-showdown, Flexbox Arena=/game/flexbox-arena, TicTacToe Arena=/game/tictactoe-arena, Queens Arena=/game/queens-arena, Zip Game=/game/zip-game, Grid Arena=/game/grid-arena, Speed Debugging=/game/speed-debugging, Missionaries=/game/missionaries-arena, Chess Arena=/game/chess-arena, Challenges=/challenges, Leaderboard=/leaderboard, Dashboard=/dashboard. ")
            .append("If a user explicitly requests one of these, prefer launching that exact experience—never reroute them elsewhere unless they ask to.")
            .append("\n\n");

        builder.append("Active agent intel:\n");
        agents.stream()
                .map(agent -> agent.buildContext(session)
                        .map(context -> "- " + agent.getName() + ": " + context)
                        .orElse(null))
                .filter(StringUtils::hasText)
                .forEach(line -> builder.append(line).append('\n'));

        builder.append("\nRecent telemetry:\n");
        session.getEvents().stream()
                .sorted(Comparator.comparing(CopilotEvent::getCreatedAt).reversed())
                .limit(5)
                .forEach(event -> builder.append("- ")
                        .append(event.getType())
                        .append(": ")
                        .append(event.getPayload())
                        .append('\n'));

        builder.append("\nConversation memory:\n");
        List<CopilotMessage> transcript = session.getTranscript();
        transcript.stream()
                .skip(Math.max(0, transcript.size() - 6))
                .forEach(message -> builder.append(message.getRole()).append(": ")
                        .append(message.getContent())
                        .append('\n'));

        builder.append("\nUser request: ").append(request.getMessage()).append('\n');
        if (request.getContext() != null && !request.getContext().isEmpty()) {
            builder.append("Additional context: ").append(request.getContext()).append('\n');
        }

        builder.append("Provide actionable help. If backend work is needed, summarize the capability in plain language (e.g., \"I can trigger the Bubble Sort module for you\") without exposing raw endpoints or JSON. ")
            .append("Honor the user's chosen activity; only fall back to another game if they explicitly ask for suggestions. ")
            .append("Clearly distinguish between suggestions and actual system actions and rely on the ACTION block to request UI changes.");
        return builder.toString();
    }

    private ParsedResponse extractAction(String rawResponse) {
        String workingText = rawResponse == null ? "" : rawResponse.trim();
        if (!StringUtils.hasText(workingText)) {
            return new ParsedResponse("", null);
        }

        int markerStart = workingText.indexOf("[[ACTION:");
        if (markerStart >= 0) {
            int markerEnd = workingText.indexOf("]]", markerStart);
            if (markerEnd > markerStart) {
                String actionJson = workingText.substring(markerStart + "[[ACTION:".length(), markerEnd).trim();
                CopilotAction action = parseActionJson(actionJson);
                String sanitized = (workingText.substring(0, markerStart) + workingText.substring(markerEnd + 2)).trim();
                return new ParsedResponse(sanitized, action);
            }
        }
        return new ParsedResponse(workingText, null);
    }

    private record ParsedResponse(String text, CopilotAction action) { }

    private CopilotAction parseActionJson(String rawJson) {
        if (!StringUtils.hasText(rawJson)) {
            return null;
        }
        String cleaned = rawJson;
        if (cleaned.contains("\\\"")) {
            cleaned = cleaned.replace("\\\\", "\\");
            cleaned = cleaned.replace("\\\"", "\"");
        }
        try {
            Map<String, Object> rawAction = objectMapper.readValue(cleaned, MAP_TYPE);
            String type = (String) rawAction.getOrDefault("type", rawAction.get("action"));
            if (!StringUtils.hasText(type)) {
                return null;
            }
            Map<String, Object> payload = new LinkedHashMap<>(rawAction);
            payload.remove("type");
            payload.remove("action");
            return CopilotAction.builder()
                    .type(type)
                    .payload(payload)
                    .build();
        } catch (Exception ex) {
            log.warn("Failed to parse Copilot ACTION block", ex);
            return null;
        }
    }
}
