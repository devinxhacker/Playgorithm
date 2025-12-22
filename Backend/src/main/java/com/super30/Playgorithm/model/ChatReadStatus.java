package com.super30.Playgorithm.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "chat_read_status")
public class ChatReadStatus {
    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    private LocalDateTime lastReadAt = LocalDateTime.now();
    
    private String lastReadMessageId;

    public ChatReadStatus(String userId) {
        this.userId = userId;
        this.lastReadAt = LocalDateTime.now();
    }
}
