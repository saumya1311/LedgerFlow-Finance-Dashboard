package com.finance.api.repository;

import com.finance.api.model.Record;
import com.finance.api.model.RecordType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RecordRepository extends JpaRepository<Record, Long>, JpaSpecificationExecutor<Record> {
    
    Page<Record> findByUser_IdAndDeletedFalse(Long userId, Pageable pageable);
    
    Page<Record> findByDeletedFalse(Pageable pageable);

    @Query("SELECT r FROM Record r WHERE r.user.id = :userId AND r.deleted = false AND r.date BETWEEN :from AND :to")
    List<Record> findByUserIdAndDateRange(Long userId, LocalDate from, LocalDate to);

    @Query("SELECT r FROM Record r WHERE r.deleted = false AND r.date BETWEEN :from AND :to")
    List<Record> findAllByDateRange(LocalDate from, LocalDate to);
}
