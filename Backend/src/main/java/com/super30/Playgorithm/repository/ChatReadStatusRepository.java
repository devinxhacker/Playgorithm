package com.super30.Playgorithm.repository;

import com.super30.Playgorithm.model.ChatReadStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatReadStatusRepository extends MongoRepository<ChatReadStatus, String> {
    Optional<ChatReadStatus> findByUserId(String userId);
}
