package com.example.demo.service;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import tools.jackson.databind.JsonNode;

@Service
public class AIService {

    private final WebClient webClient;

    private static final String API_KEY = "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";

    public AIService() {

        this.webClient = WebClient.builder()
                .baseUrl("https://openrouter.ai/api/v1")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + API_KEY)
                .build();
    }

    public String reviewCode(String code, String language) {

        String prompt = """
                You are an expert %s code analyzer.

                Analyze the code and identify:

                1. Syntax Errors
                2. Logical Errors
                3. Best Practice Violations
                4. Security Issues
                5. Performance Issues

                For each issue provide:

                - Line Number
                - Error Type
                - Severity (LOW/MEDIUM/HIGH)
                - Explanation
                - Fix

                Return the response in this format:

                ERROR #1
                Line:
                Severity:
                Type:
                Explanation:
                Fix:

                ERROR #2
                Line:
                Severity:
                Type:
                Explanation:
                Fix:

                If no issues are found, respond:

                No errors found. Code quality is good.

                Code:

                %s
                """.formatted(language, code);

        Map<String, Object> requestBody = new HashMap<>();

        requestBody.put("model", "openai/gpt-4o-mini");

        requestBody.put("messages", List.of(
                Map.of(
                        "role", "system",
                        "content", "You are a professional code reviewer and bug finder."
                ),
                Map.of(
                        "role", "user",
                        "content", prompt
                )
        ));

        try {

            JsonNode response = webClient.post()
                    .uri("/chat/completions")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();

            return response
                    .get("choices")
                    .get(0)
                    .get("message")
                    .get("content")
                    .asText();

        } catch (Exception e) {
            e.printStackTrace();
            return "ERROR: " + e.getMessage();
        }
    }
}