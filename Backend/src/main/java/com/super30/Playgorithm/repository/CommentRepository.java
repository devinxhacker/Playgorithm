package com.super30.Playgorithm.repository;

import com.super30.Playgorithm.model.Comment;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByGameIdAndParentCommentIdIsNull(String gameId, Sort sort);
    List<Comment> findByParentCommentId(String parentCommentId, Sort sort);
    List<Comment> findByGameId(String gameId);
    Long countByGameId(String gameId);
    void deleteByGameId(String gameId);
}
