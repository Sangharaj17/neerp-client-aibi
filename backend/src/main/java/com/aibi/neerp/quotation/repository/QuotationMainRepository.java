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

@Repository
public interface QuotationMainRepository extends JpaRepository<QuotationMain, Integer> {
    List<QuotationMain> findByLead_LeadIdAndCombinedEnquiry_Id(Integer leadId, Integer combinedEnquiryId);

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
                    "WHERE q.status IN (:statuses) AND q.isDeleted = FALSE",

            // 💡 CRITICAL: The countQuery must match the WHERE clause
            countQuery = "SELECT COUNT(q.id) FROM QuotationMain q WHERE q.status IN (:statuses) AND q.isDeleted = FALSE"
    )
    Page<QuotationMain> findAllWithEagerAssociationsPageable(
            // 💡 The method now accepts a List of the QuotationStatus Enum
            @Param("statuses") List<QuotationStatus> statuses,
            Pageable pageable
    );
}
