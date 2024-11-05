package com.example.CT295_IoT.Repository;

import com.example.CT295_IoT.Entity.HistoryScan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;


public interface HistoryScanRepository extends JpaRepository<HistoryScan, Integer> {
    @Modifying
    @Transactional
    @Query("DELETE FROM HistoryScan h WHERE h.uid = :uid")
    void deleteByUid(@Param("uid") String uid);
}

