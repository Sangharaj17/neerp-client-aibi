package com.aibi.neerp.quotation.jobs.repository;

import com.aibi.neerp.quotation.jobs.entity.JobPayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface JobPaymentRepository extends JpaRepository<JobPayment, Integer> {

    List<JobPayment> findByInvoice_InvoiceId(Integer invoiceId);

    @Query("""
        SELECT COALESCE(SUM(p.amountPaid), 0)
        FROM JobPayment p
        WHERE p.job.jobId = :jobId
    """)
    BigDecimal getTotalPaidByJob(@Param("jobId") Integer jobId);

    @Query("""
        SELECT COALESCE(SUM(p.amountPaid), 0)
        FROM JobPayment p
        WHERE p.invoice.invoiceId = :invoiceId
    """)
    BigDecimal getTotalPaidByInvoice(@Param("invoiceId") Integer invoiceId);

    @Query(
            value = """
                    SELECT p.*
                    FROM tbl_ni_job_payment p
                    JOIN tbl_ni_job j ON j.job_id = p.job_id
                    JOIN tbl_customer c ON c.customer_id = j.customer_id
                    JOIN tbl_site s ON s.site_id = j.site_id
                    WHERE (
                        :search IS NULL
                        OR LOWER(p.invoice_no) LIKE LOWER(CONCAT('%', :search, '%'))
                        OR LOWER(c.customer_name) LIKE LOWER(CONCAT('%', :search, '%'))
                        OR LOWER(s.site_name) LIKE LOWER(CONCAT('%', :search, '%'))
                        OR LOWER(p.payment_type) LIKE LOWER(CONCAT('%', :search, '%'))
                        OR CAST(p.amount_paid AS TEXT) LIKE CONCAT('%', :search, '%')
                    )
                    """,
            countQuery = """
                     SELECT COUNT(*)
                    FROM tbl_ni_job_payment p
                    JOIN tbl_ni_job j ON j.job_id = p.job_id
                    JOIN tbl_customer c ON c.customer_id = j.customer_id
                    JOIN tbl_site s ON s.site_id = j.site_id
                    WHERE (
                        :search IS NULL
                        OR LOWER(p.invoice_no) LIKE LOWER(CONCAT('%', :search, '%'))
                        OR LOWER(c.customer_name) LIKE LOWER(CONCAT('%', :search, '%'))
                        OR LOWER(s.site_name) LIKE LOWER(CONCAT('%', :search, '%'))
                        OR LOWER(p.payment_type) LIKE LOWER(CONCAT('%', :search, '%'))
                        OR CAST(p.amount_paid AS TEXT) LIKE CONCAT('%', :search, '%')
                    )
                    """,
            nativeQuery = true
    )
    Page<JobPayment> searchPayments(
            @Param("search") String search,
            Pageable pageable
    );
}
