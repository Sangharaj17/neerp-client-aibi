package com.aibi.neerp.amc.invoice.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aibi.neerp.amc.invoice.entity.AmcInvoice;
import com.aibi.neerp.amc.jobs.initial.entity.AmcJob;
import com.aibi.neerp.amc.jobs.renewal.entity.AmcRenewalJob;

@Repository
public interface AmcInvoiceRepository extends JpaRepository<AmcInvoice, Integer> {
	
//    @Query("""
//            SELECT DISTINCT i
//            FROM AmcInvoice i
//           
//            LEFT JOIN i.amcJob j 
//            LEFT JOIN j.site js 
//            LEFT JOIN j.customer jc 
//            
//           
//            LEFT JOIN i.amcRenewalJob r
//            LEFT JOIN r.site rs
//            LEFT JOIN r.customer rc
//            
//            WHERE (:search IS NULL OR (
//            
//                LOWER(i.invoiceNo) LIKE LOWER(CONCAT('%', :search, '%')) OR
//                LOWER(i.payFor) LIKE LOWER(CONCAT('%', :search, '%')) OR
//                CAST(i.totalAmt AS string) LIKE CONCAT('%', :search, '%') OR
//                
//              
//                LOWER(js.siteName) LIKE LOWER(CONCAT('%', :search, '%')) OR
//                LOWER(js.siteAddress) LIKE LOWER(CONCAT('%', :search, '%')) OR
//                LOWER(jc.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR
//                
//               
//                LOWER(rs.siteName) LIKE LOWER(CONCAT('%', :search, '%')) OR
//                LOWER(rs.siteAddress) LIKE LOWER(CONCAT('%', :search, '%')) OR
//                LOWER(rc.customerName) LIKE LOWER(CONCAT('%', :search, '%'))
//            ))
//           
//            AND (:dateSearch IS NULL OR i.invoiceDate = :dateSearch)
//        """)
//        Page<AmcInvoice> searchAllInvoices(
//            @Param("search") String search,
//            @Param("dateSearch") LocalDate dateSearch, // CRITICAL: Use LocalDate
//            Pageable pageable
//        );
	// enquiryType
	
	@Query("""
            SELECT DISTINCT i
            FROM AmcInvoice i
           
            LEFT JOIN i.enquiryType e
            LEFT JOIN i.amcJob j 
            LEFT JOIN j.site js 
            LEFT JOIN j.customer jc 
            
            LEFT JOIN i.amcRenewalJob r
            LEFT JOIN r.site rs
            LEFT JOIN r.customer rc
            
            WHERE (:search IS NULL OR (
            
                LOWER(e.enquiryTypeName) LIKE LOWER(CONCAT('%', :search, '%')) OR

                LOWER(i.invoiceNo) LIKE LOWER(CONCAT('%', :search, '%')) OR
                LOWER(i.payFor) LIKE LOWER(CONCAT('%', :search, '%')) OR
                CAST(i.totalAmt AS string) LIKE CONCAT('%', :search, '%') OR
                
                LOWER(js.siteName) LIKE LOWER(CONCAT('%', :search, '%')) OR
                LOWER(js.siteAddress) LIKE LOWER(CONCAT('%', :search, '%')) OR
                LOWER(jc.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR
                
                LOWER(rs.siteName) LIKE LOWER(CONCAT('%', :search, '%')) OR
                LOWER(rs.siteAddress) LIKE LOWER(CONCAT('%', :search, '%')) OR
                LOWER(rc.customerName) LIKE LOWER(CONCAT('%', :search, '%'))
            ))
           
            AND (:dateSearch IS NULL OR :dateSearch = '' OR i.invoiceDate = CAST(:dateSearch AS date))
            
            
            
          AND (
                i.invoiceDate < CURRENT_DATE() 
                OR 
                (
                    FUNCTION('DATE_PART', 'month', i.invoiceDate) = :currentMonth OR
                    FUNCTION('DATE_PART', 'month', i.invoiceDate) = :nextMonth
                )
            )
          
        """)
        Page<AmcInvoice> searchAllInvoices(
            @Param("search") String search,
            @Param("dateSearch") String dateSearch,
            @Param("currentMonth") int currentMonth, 
            @Param("nextMonth") int nextMonth,       
            Pageable pageable
        );
	
	
	// Simple JPA method to count invoices based on the isCleared status
    long countByIsCleared(Integer isCleared);

    /**
     * Custom query to sum the total amounts of all PAID invoices (where isCleared = 1).
     * Assuming 'totalAmt' is the field name for the amount in the AmcInvoice entity.
     */
    @Query("SELECT SUM(i.totalAmt) FROM AmcInvoice i WHERE i.isCleared = 1")
    Double sumTotalAmountReceived();


    List<AmcInvoice> findByAmcJob(AmcJob amcJob);
	
    List<AmcInvoice> findByAmcRenewalJob(AmcRenewalJob amcRenewalJob);


    @Query("SELECT COALESCE(MAX(i.invoiceId), 0) FROM AmcInvoice i")
    Integer findMaxInvoiceId();
	
    List<AmcInvoice> findByMaterialQuotation_ModQuotIdAndIsCleared(Integer modQuotId, Integer isCleared);   

    List<AmcInvoice> findByOnCallQuotation_IdAndIsCleared(Integer onCallQuotationId, Integer isCleared);
    
    List<AmcInvoice> findByModernization_IdAndIsCleared(Integer modernizationId, Integer isCleared);
}
