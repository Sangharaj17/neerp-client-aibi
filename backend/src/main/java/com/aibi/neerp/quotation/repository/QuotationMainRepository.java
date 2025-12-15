package com.aibi.neerp.quotation.repository;

import com.aibi.neerp.quotation.entity.QuotationMain;
import com.aibi.neerp.quotation.utility.QuotationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;

@Repository
public interface QuotationMainRepository extends JpaRepository<QuotationMain, Integer> {
    List<QuotationMain> findByLead_LeadIdAndCombinedEnquiry_Id(Integer leadId, Integer combinedEnquiryId);

    // 1. Used when quotationNo is provided in the request
    // Filters by Lead ID, Combined Enquiry ID, Quotation Number, and ensures edition > 0.
    List<QuotationMain> findByLead_LeadIdAndCombinedEnquiry_IdAndQuotationNoAndEditionGreaterThan(
            Integer leadId,
            Integer combinedEnquiryId,
            String quotationNo,
            Integer edition
    );

    // 2. Used as the fallback when quotationNo is NOT provided in the request
    // Filters by Lead ID, Combined Enquiry ID, and ensures edition > 0.
    List<QuotationMain> findByLead_LeadIdAndCombinedEnquiry_IdAndEditionGreaterThan(
            Integer leadId,
            Integer combinedEnquiryId,
            Integer edition
    );

    @Query("SELECT q FROM QuotationMain q " +
            "LEFT JOIN FETCH q.lead l " +
            "LEFT JOIN FETCH q.combinedEnquiry ce " +
            "LEFT JOIN FETCH q.createdBy cb " +
            "LEFT JOIN FETCH q.finalizedBy fb")
    List<QuotationMain> findAllWithEagerAssociations();

//    // 💡 The 'Pageable' parameter handles pagination (limit/offset) and sorting (order by)
//    @Query(value = "SELECT q FROM QuotationMain q " +
//            "LEFT JOIN FETCH q.lead l " +
//            "LEFT JOIN FETCH q.combinedEnquiry ce " +
//            "LEFT JOIN FETCH q.createdBy cb " +
//            "LEFT JOIN FETCH q.finalizedBy fb WHERE q.status IN ('SAVE', 'FINALIZED') AND q.isDeleted = FALSE",
//            // 💡 Specify countQuery to prevent JPA from attempting to count over the JOIN FETCH
//            countQuery = "SELECT COUNT(q.id) FROM QuotationMain q")
//    Page<QuotationMain> findAllWithEagerAssociationsPageable(Pageable pageable);

    @Query(
            value = "SELECT q FROM QuotationMain q " +
                    "LEFT JOIN FETCH q.lead l " +
                    "LEFT JOIN FETCH q.combinedEnquiry ce " +
                    "LEFT JOIN FETCH q.createdBy cb " +
                    "LEFT JOIN FETCH q.finalizedBy fb " +
                    // 💡 Use the named parameter ':statuses'
                    // "WHERE q.status IN (:statuses) AND q.isDeleted = FALSE AND q.edition = 0",
                    "WHERE q.status IN (:statuses) AND q.edition = 0",

            // 💡 CRITICAL: The countQuery must match the WHERE clause
            // countQuery = "SELECT COUNT(q.id) FROM QuotationMain q WHERE q.status IN (:statuses) AND q.isDeleted = FALSE"
            countQuery = "SELECT COUNT(q.id) FROM QuotationMain q WHERE q.status IN (:statuses) AND q.edition = 0"
    )
    Page<QuotationMain> findAllWithEagerAssociationsPageable(
            // 💡 The method now accepts a List of the QuotationStatus Enum
            @Param("statuses") List<QuotationStatus> statuses,
            Pageable pageable
    );

    Optional<QuotationMain> findByIdAndIsSupersededFalse(Integer oldQuotationMainId);

    Optional<QuotationMain> findByParentQuotation_IdAndQuotationNo(Integer parentQuotationId, String quotationNo);

    List<QuotationMain> findByQuotationNoIgnoreCaseOrderByEditionAsc(String quotationNo);

    @Query(value = "SELECT qm FROM QuotationMain qm WHERE " +
            // Use a native PostgreSQL function (or a common replacement) to clean the DB data.
            // Replacing the non-breaking spaces and standardizing the comparison.
            // Note: You may need a more complex native function for all codes.
            "lower(REPLACE(REPLACE(TRIM(qm.quotationNo), ' ', ''), ' ', '')) = lower(:quotationNo) " + // ' ' is non-breaking space
            "ORDER BY qm.edition")
    List<QuotationMain> findCleanQuotationNo(@Param("quotationNo") String quotationNo);

//    @Query("""
//                SELECT COUNT(q)
//                FROM QuotationMain q
//                WHERE q.combinedEnquiry.id = :combinedEnquiryId
//                    AND q.lead.leadId = :leadId
//                   AND q.status = com.aibi.neerp.quotation.utility.QuotationStatus.DRAFTED
//                   AND q.edition = 0
//                   AND q.parentQuotation IS NULL
//            """)

    @Query("""
                SELECT COUNT(q) 
                FROM QuotationMain q
                WHERE q.combinedEnquiry.id = :combinedEnquiryId
                    AND q.lead.leadId = :leadId
                   AND q.isSuperseded = true
                   AND q.edition = 0
                   AND q.parentQuotation IS NULL
            """)
    int countQuotation(Integer combinedEnquiryId, Integer leadId);

    // Find maximum edition for a quotation group (by quotationNo, leadId, and combinedEnquiryId)
    @Query("""
                SELECT COALESCE(MAX(q.edition), 0)
                FROM QuotationMain q
                WHERE q.quotationNo = :quotationNo
                    AND q.lead.leadId = :leadId
                    AND q.combinedEnquiry.id = :combinedEnquiryId
            """)
    Integer findMaxEditionByQuotationNoAndLeadIdAndCombinedEnquiryId(
            @Param("quotationNo") String quotationNo,
            @Param("leadId") Integer leadId,
            @Param("combinedEnquiryId") Integer combinedEnquiryId
    );

//    List<QuotationMain> findByIsFinalizedTrueAndIsDeletedFalseOrderByIdDesc();

//    List<QuotationMain>
//    findByIsFinalizedTrueAndIsDeletedFalseAndJobStatusNotOrderByIdDesc(Integer jobStatus);

    //    @Query(value = "SELECT COUNT(*) FROM tbl_quotation_main " +
//            "WHERE is_deleted = false " +
//            "AND edition = 0 " +
//            "AND is_finalized = false " +
//            "AND parent_quotation_id IS NULL",
//            nativeQuery = true)
    @Query(value = "SELECT COUNT(qm.id) " +
            "FROM tbl_quotation_main qm " +
            "WHERE qm.is_deleted = false " +
            "AND qm.edition = 0 " +
            "AND qm.parent_quotation_id IS NULL " +
            "AND NOT EXISTS (" +
            "    SELECT 1 " +
            "    FROM tbl_quotation_main revision " +
            "    WHERE revision.is_finalized = true " + // CRITICAL: Check for TRUE finalization
            "      AND revision.lead_id = qm.lead_id " +
            "      AND revision.combined_enquiry_id = qm.combined_enquiry_id " +
            ")",
            nativeQuery = true)
    Long countAllActiveQuotations();


    List<QuotationMain> findByIsFinalizedTrueAndIsDeletedFalseAndJobStatusIsNullOrderByIdDesc();
}
