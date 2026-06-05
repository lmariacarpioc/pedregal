package com.pedregal.backend.repository;

import com.pedregal.backend.entity.Inversion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InversionRepository extends JpaRepository<Inversion, Long> {
    Optional<Inversion> findBySyncId(String syncId);
    boolean existsBySyncId(String syncId);
}
