package com.aibi.neerp.newInstallation.invoice.repository;

import com.aibi.neerp.newInstallation.invoice.entity.NiInvoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface NiInvoiceRepository extends JpaRepository<NiInvoice, Integer> {

    @Query(value = "SELECT invoice_no FROM tbl_ni_invoice ORDER BY invoice_id DESC LIMIT 1", nativeQuery = true)
    String findLastInvoiceNo();

    long countByIsClearedTrue();

    long countByIsClearedFalse();

    @Query("SELECT COALESCE(SUM(i.totalAmount), 0) FROM NiInvoice i WHERE i.isCleared = true")
    BigDecimal sumPaidAmount();

    @Query(
            value = """
        SELECT i.*
        FROM tbl_ni_invoice i
        JOIN tbl_ni_job j ON j.job_id = i.job_id
        JOIN tbl_site s ON s.site_id = j.site_id
        JOIN tbl_lead l ON l.lead_id = i.lead_id
        WHERE (
            :search IS NULL
            OR i.search_vector @@ plainto_tsquery(:search)
        )
        """,
            countQuery = """
        SELECT count(*)
        FROM tbl_ni_invoice i
        JOIN tbl_ni_job j ON j.job_id = i.job_id
        JOIN tbl_site s ON s.site_id = j.site_id
        JOIN tbl_lead l ON l.lead_id = i.lead_id
        WHERE (
            :search IS NULL
            OR i.search_vector @@ plainto_tsquery(:search)
        )
        """,
            nativeQuery = true
    )
    Page<NiInvoice> searchInvoices(
            @Param("search") String search,
            Pageable pageable
    );



//    @Query(
//            value = """
//                    SELECT i.*
//                    FROM tbl_ni_invoice i
//                    JOIN tbl_ni_job j ON j.job_id = i.job_id
//                    JOIN tbl_site s ON s.site_id = j.site_id
//                    JOIN tbl_new_leads l ON l.lead_id = i.lead_id
//                    WHERE (
//                        :search IS NULL
//                        OR LOWER(i.invoice_no) LIKE LOWER(CONCAT('%', :search, '%'))
//                        OR LOWER(s.site_name) LIKE LOWER(CONCAT('%', :search, '%'))
//                        OR LOWER(s.site_address) LIKE LOWER(CONCAT('%', :search, '%'))
//                        OR LOWER(i.pay_for) LIKE LOWER(CONCAT('%', :search, '%'))
//                        OR TO_CHAR(i.invoice_date, 'DD/Mon/YYYY') ILIKE CONCAT('%', :search, '%')
//                        OR CASE WHEN i.is_cleared = true THEN 'paid' ELSE 'pending' END ILIKE CONCAT('%', :search, '%')
//                        OR CAST(i.total_amt AS TEXT) LIKE CONCAT('%', :search, '%')
//                        OR LOWER(l.customer_name) LIKE LOWER(CONCAT('%', :search, '%'))
//                    )
//                    ORDER BY
//                        CASE
//                            WHEN :sortBy = 'invoiceNo' AND :direction = 'asc' THEN LOWER(i.invoice_no)
//                        END ASC,
//                        CASE
//                            WHEN :sortBy = 'invoiceNo' AND :direction = 'desc' THEN LOWER(i.invoice_no)
//                        END DESC,
//                        CASE
//                            WHEN :sortBy = 'siteName' AND :direction = 'asc' THEN LOWER(s.site_name)
//                        END ASC,
//                        CASE
//                            WHEN :sortBy = 'siteName' AND :direction = 'desc' THEN LOWER(s.site_name)
//                        END DESC,
//                        CASE
//                            WHEN :sortBy = 'siteAddress' AND :direction = 'asc' THEN LOWER(s.site_address)
//                        END ASC,
//                        CASE
//                            WHEN :sortBy = 'siteAddress' AND :direction = 'desc' THEN LOWER(s.site_address)
//                        END DESC,
//                        CASE
//                            WHEN :sortBy = 'customerName' AND :direction = 'asc' THEN LOWER(l.customer_name)
//                        END ASC,
//                        CASE
//                            WHEN :sortBy = 'customerName' AND :direction = 'desc' THEN LOWER(l.customer_name)
//                        END DESC,
//                        CASE
//                            WHEN :sortBy = 'invoiceDate' AND :direction = 'asc' THEN i.invoice_date
//                        END ASC,
//                        CASE
//                            WHEN :sortBy = 'invoiceDate' AND :direction = 'desc' THEN i.invoice_date
//                        END DESC,
//                        CASE
//                            WHEN :sortBy = 'totalAmount' AND :direction = 'asc' THEN i.total_amt
//                        END ASC,
//                        CASE
//                            WHEN :sortBy = 'totalAmount' AND :direction = 'desc' THEN i.total_amt
//                        END DESC,
//                        CASE
//                            WHEN :sortBy = 'payFor' AND :direction = 'asc' THEN LOWER(i.pay_for)
//                        END ASC,
//                        CASE
//                            WHEN :sortBy = 'payFor' AND :direction = 'desc' THEN LOWER(i.pay_for)
//                        END DESC,
//                        CASE
//                            WHEN :sortBy = 'status' AND :direction = 'asc' THEN i.is_cleared
//                        END ASC,
//                        CASE
//                            WHEN :sortBy = 'status' AND :direction = 'desc' THEN i.is_cleared
//                        END DESC,
//                        CASE
//                            WHEN :sortBy = 'createdAt' AND :direction = 'asc' THEN i.created_at
//                        END ASC,
//                        CASE
//                            WHEN :sortBy = 'createdAt' AND :direction = 'desc' THEN i.created_at
//                        END DESC,
//                        i.created_at DESC
//                    """,
//            countQuery = """
//                    SELECT COUNT(*)
//                    FROM tbl_ni_invoice i
//                    JOIN tbl_ni_job j ON j.job_id = i.job_id
//                    JOIN tbl_site s ON s.site_id = j.site_id
//                    JOIN tbl_new_leads l ON l.lead_id = i.lead_id
//                    WHERE (
//                        :search IS NULL
//                        OR LOWER(i.invoice_no) LIKE LOWER(CONCAT('%', :search, '%'))
//                        OR LOWER(s.site_name) LIKE LOWER(CONCAT('%', :search, '%'))
//                        OR LOWER(s.site_address) LIKE LOWER(CONCAT('%', :search, '%'))
//                        OR LOWER(i.pay_for) LIKE LOWER(CONCAT('%', :search, '%'))
//                        OR TO_CHAR(i.invoice_date, 'DD/Mon/YYYY') ILIKE CONCAT('%', :search, '%')
//                        OR CASE WHEN i.is_cleared = true THEN 'paid' ELSE 'pending' END ILIKE CONCAT('%', :search, '%')
//                        OR CAST(i.total_amt AS TEXT) LIKE CONCAT('%', :search, '%')
//                        OR LOWER(l.customer_name) LIKE LOWER(CONCAT('%', :search, '%'))
//                    )
//                    """,
//            nativeQuery = true
//    )
//    Page<NiInvoice> searchInvoices(
//            @Param("search") String search,
//            @Param("sortBy") String sortBy,
//            @Param("direction") String direction,
//            Pageable pageable
//    );

    // ✅ All invoices for a job
    List<NiInvoice> findByJob_JobIdOrderByInvoiceDateAsc(Integer jobId);

    // ✅ Only uncleared invoices (most common for payment screen)
    List<NiInvoice> findByJob_JobIdAndIsClearedFalseOrderByInvoiceDateAsc(Integer jobId);

}
