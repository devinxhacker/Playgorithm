package com.super30.Playgorithm.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploaded images from /app/backend/uploads in container
        // Use absolute path for Docker deployment
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:/app/backend/uploads/", "file:uploads/");
    }
}
