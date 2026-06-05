package com.pedregal.backend.repository;

import com.pedregal.backend.entity.SyncLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SyncLogRepository extends JpaRepository<SyncLog, Long> {
    Optional<SyncLog> findBySyncId(String syncId);
    boolean existsBySyncId(String syncId);
}
