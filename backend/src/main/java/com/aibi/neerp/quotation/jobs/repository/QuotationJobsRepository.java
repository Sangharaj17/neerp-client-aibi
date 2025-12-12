package com.aibi.neerp.quotation.jobs.repository;

import com.aibi.neerp.quotation.jobs.entity.QuotationJobs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuotationJobsRepository extends JpaRepository<QuotationJobs, Integer> {

}
