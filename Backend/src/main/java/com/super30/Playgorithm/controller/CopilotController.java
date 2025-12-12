package com.super30.Playgorithm.controller;

import com.super30.Playgorithm.dto.CopilotChatRequest;
import com.super30.Playgorithm.dto.CopilotDelta;
import com.super30.Playgorithm.dto.CopilotEventRequest;
import com.super30.Playgorithm.dto.CopilotSessionRequest;
import com.super30.Playgorithm.dto.CopilotSessionResponse;
import com.super30.Playgorithm.service.CopilotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/copilot")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CopilotController {

    private final CopilotService copilotService;

    @PostMapping("/session")
    public CopilotSessionResponse createSession(
            @RequestBody(required = false) CopilotSessionRequest request,
            Authentication authentication
    ) {
        if (request == null) {
            request = new CopilotSessionRequest();
        }
        if (authentication != null && request.getUserId() == null) {
            request.setUserId(authentication.getName());
        }
        return copilotService.createSession(request);
    }

    @PostMapping("/event")
    public void publishEvent(
            @Valid @RequestBody CopilotEventRequest request,
            Authentication authentication
    ) {
        copilotService.recordEvent(request, extractPrincipal(authentication));
    }

    @PostMapping(value = "/chat", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<CopilotDelta> chat(
            @Valid @RequestBody CopilotChatRequest request,
            Authentication authentication
    ) {
        return copilotService.streamChat(request, extractPrincipal(authentication));
    }

    private String extractPrincipal(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        return authentication.getName();
    }
}
