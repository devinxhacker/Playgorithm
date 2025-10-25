package com.super30.Playgorithm.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "achievements")
public class Achievement {
    @Id
    private String id;

    private String name;

    private String description;

    private String iconUrl;

    private String category; // MILESTONE, STREAK, SKILL, SOCIAL

    private String criteria; // JSON string describing unlock criteria

    private Integer xpReward;

    private String rarity; // COMMON, RARE, EPIC, LEGENDARY

    private Boolean isActive = true;
}
