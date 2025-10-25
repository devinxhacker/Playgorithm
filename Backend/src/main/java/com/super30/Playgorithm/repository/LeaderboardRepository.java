package com.super30.Playgorithm.repository;

import com.super30.Playgorithm.model.LeaderboardEntry;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaderboardRepository extends MongoRepository<LeaderboardEntry, String> {
    List<LeaderboardEntry> findByGameIdOrderByScoreDescTimeTakenAsc(String gameId, Pageable pageable);
    List<LeaderboardEntry> findByGameIdIsNullOrderByTotalXPDesc(Pageable pageable);
    List<LeaderboardEntry> findByUserIdAndGameIdIsNull(String userId);
}
