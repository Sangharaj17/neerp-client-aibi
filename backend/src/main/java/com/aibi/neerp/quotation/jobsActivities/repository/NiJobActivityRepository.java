package com.aibi.neerp.quotation.jobsActivities.repository;


import com.aibi.neerp.quotation.jobsActivities.entity.NiJobActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NiJobActivityRepository extends JpaRepository<NiJobActivity, Integer> {

    @Query("SELECT ja FROM NiJobActivity ja " +
            "WHERE ja.job.jobId = :jobId " +
            "AND ja.status != 'DELETED' " +
            "ORDER BY ja.activityDate DESC, ja.createdAt DESC")
    List<NiJobActivity> findByJobIdAndStatusNot(@Param("jobId") Integer jobId);

    @Query("SELECT ja FROM NiJobActivity ja " +
            "WHERE ja.jobActivityId = :id AND ja.status != 'DELETED'")
    Optional<NiJobActivity> findByIdAndNotDeleted(@Param("id") Integer id);

    @Query("SELECT COUNT(ja) FROM NiJobActivity ja " +
            "WHERE ja.job.jobId = :jobId AND ja.status = 'ACTIVE'")
    Long countActiveActivitiesByJobId(@Param("jobId") Integer jobId);

    Optional<NiJobActivity> findByJobActivityIdAndStatusNot(
            Integer jobActivityId,
            String status
    );
}
