package com.super30.Playgorithm.copilot;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.time.Duration;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Slf4j
@Component
public class GeminiClient {

    private final WebClient webClient;
    private final String apiKey;
    private final String model;

    public GeminiClient(
            WebClient.Builder builder,
            @Value("${gemini.api.key:}") String apiKey,
            @Value("${gemini.model:gemini-2.0-flash}") String model
    ) {
        this.webClient = builder.baseUrl("https://generativelanguage.googleapis.com").build();
        this.apiKey = apiKey;
        this.model = model;
    }

    public Flux<String> streamResponse(String prompt) {
        if (!StringUtils.hasText(apiKey)) {
            log.warn("Gemini API key is missing. Falling back to offline script.");
            return fallback(prompt);
        }

        Map<String, Object> payload = Map.of(
                "contents", Collections.singletonList(Map.of(
                        "role", "user",
                        "parts", Collections.singletonList(Map.of("text", prompt))
                ))
        );

        return webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/v1beta/models/" + model + ":generateContent")
                        .queryParam("key", apiKey)
                        .build())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(payload)
                .retrieve()
            .bodyToMono(GeminiResponse.class)
                .flatMapMany(response -> {
                    String text = response.firstText();
                    if (!StringUtils.hasText(text)) {
                        text = "I could not craft a response right now. Please try again.";
                    }
                    String[] segments = text.split("(?<=\\.) ");
                    return Flux.fromArray(segments)
                            .map(String::trim)
                            .filter(StringUtils::hasText);
                })
                .timeout(Duration.ofSeconds(30))
                .onErrorResume(error -> {
                    log.error("Gemini API error", error);
                    return Flux.just(
                            "I hit a snag talking to Gemini.",
                            "Double-check the API credentials in the backend.");
                });
    }

    private Flux<String> fallback(String prompt) {
        String simulated = "(Offline mode) " + prompt;
        List<String> chunks = simulated.length() < 120
                ? List.of(simulated)
                : splitIntoChunks(simulated);
        return Flux.fromIterable(chunks).delayElements(Duration.ofMillis(180));
    }

        private List<String> splitIntoChunks(String text) {
        final int size = 140;
        int length = text.length();
        return java.util.stream.IntStream.range(0, (length + size - 1) / size)
            .mapToObj(i -> text.substring(i * size, Math.min(length, (i + 1) * size)))
            .collect(Collectors.toList());
    }

    @Data
    private static class GeminiResponse {
        private List<Candidate> candidates;

        String firstText() {
            if (candidates == null || candidates.isEmpty()) {
                return "";
            }
            return candidates.get(0).firstText();
        }
    }

    @Data
    private static class Candidate {
        private Content content;

        String firstText() {
            return content == null ? "" : content.firstText();
        }
    }

    @Data
    private static class Content {
        private List<Part> parts;

        String firstText() {
            if (parts == null) {
                return "";
            }
            return parts.stream()
                    .map(Part::getText)
                    .filter(StringUtils::hasText)
                    .collect(Collectors.joining(" "));
        }
    }

    @Data
    private static class Part {
        private String text;
    }
}
