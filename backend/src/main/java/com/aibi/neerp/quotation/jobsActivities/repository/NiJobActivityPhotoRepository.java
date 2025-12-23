package com.aibi.neerp.quotation.jobsActivities.repository;

import com.aibi.neerp.quotation.jobsActivities.entity.NiJobActivityPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NiJobActivityPhotoRepository extends JpaRepository<NiJobActivityPhoto, Integer> {

    @Query("SELECT p FROM NiJobActivityPhoto p " +
            "WHERE p.jobActivity.jobActivityId = :activityId " +
            "ORDER BY p.createdAt ASC")
    List<NiJobActivityPhoto> findByJobActivityId(@Param("activityId") Integer activityId);

    @Query("SELECT COUNT(p) FROM NiJobActivityPhoto p " +
            "WHERE p.jobActivity.jobActivityId = :activityId")
    Long countByJobActivityId(@Param("activityId") Integer activityId);

    List<NiJobActivityPhoto> findByJobActivity_JobActivityIdAndDeletedFalse(
            Integer activityId
    );
}
