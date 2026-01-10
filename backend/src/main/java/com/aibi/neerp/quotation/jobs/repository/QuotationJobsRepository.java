package com.aibi.neerp.quotation.jobs.repository;

import com.aibi.neerp.quotation.jobs.entity.QuotationJobs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuotationJobsRepository extends JpaRepository<QuotationJobs, Integer>, org.springframework.data.jpa.repository.JpaSpecificationExecutor<QuotationJobs> {

    @Query(value = """
                SELECT j.*
                FROM tbl_ni_job j
                LEFT JOIN tbl_ni_job_payment p
                    ON p.job_id = j.job_id
                LEFT JOIN tbl_quotation_lift_detail ld
                    ON ld.quotation_main_id = j.ni_quotation_id
                    AND ld.pwd_include_exclude = true
                GROUP BY j.job_id
                HAVING
                    COALESCE(SUM(p.amount_paid), 0)
                    <
                    (
                        COALESCE(j.job_amount, 0)
                        -
                        COALESCE(SUM(COALESCE(ld.pwd_amount, 0)), 0)
                    )
                ORDER BY j.job_id DESC
            """, nativeQuery = true)
    List<QuotationJobs> findPendingPaymentJobs();


}
