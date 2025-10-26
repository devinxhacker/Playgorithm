package com.super30.Playgorithm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LanguageInfoResponse {
    private List<String> supportedLanguages;
    private Map<String, LanguageConfig> languageConfigs;
    private String defaultLanguage;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LanguageConfig {
        private String displayName;
        private String version;
        private String fileExtension;
        private String compileCommand;
        private String runCommand;
        private Integer timeoutSeconds;
        private Integer memoryLimitMB;
        private String description;
    }
}