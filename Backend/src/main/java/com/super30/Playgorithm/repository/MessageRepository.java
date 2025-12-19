package com.super30.Playgorithm.repository;

import com.super30.Playgorithm.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    
    Page<Message> findByDeletedFalseOrderByCreatedAtDesc(Pageable pageable);
    
    List<Message> findTop50ByDeletedFalseOrderByCreatedAtDesc();
    
    List<Message> findByCreatedAtAfterAndDeletedFalse(LocalDateTime after);
    
    List<Message> findByUserIdAndDeletedFalse(String userId, Pageable pageable);
    
    @Query("{ 'flagged': true, 'deleted': false }")
    List<Message> findFlaggedMessages(Pageable pageable);
    
    long countByUserId(String userId);
}
