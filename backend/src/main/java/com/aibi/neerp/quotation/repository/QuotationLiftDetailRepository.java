package com.aibi.neerp.quotation.repository;

import com.aibi.neerp.leadmanagement.entity.Enquiry;
import com.aibi.neerp.quotation.entity.QuotationLiftDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;

@Repository
public interface QuotationLiftDetailRepository extends JpaRepository<QuotationLiftDetail, Long> {
    Collection<Object> findByQuotationMainId(Integer id);

//    List<Integer> findEnquiryIdsByLeadAndCombinedEnquiry(Integer leadId, Integer combinedEnquiryId);

    @Query("SELECT q.enquiry.id FROM QuotationLiftDetail q WHERE q.lead.id = :leadId AND q.combinedEnquiry.id = :combinedEnquiryId")
    List<Integer> findEnquiryIdsByLeadAndCombinedEnquiry(@Param("leadId") Integer leadId, @Param("combinedEnquiryId") Integer combinedEnquiryId);

    @Modifying
    @Transactional
    @Query("UPDATE QuotationLiftDetail l SET l.isSaved = true, l.isFinalized = false WHERE l.id IN :liftIds")
    void updateSaveStatusForLifts(@Param("liftIds") List<Long> liftIds);

//    List<QuotationLiftDetail> findByLead_LeadIdAndCombinedEnquiry_Id(Integer , Integer );
}
