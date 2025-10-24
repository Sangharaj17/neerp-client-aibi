package com.aibi.neerp.amc.invoice.repository;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aibi.neerp.amc.invoice.entity.AmcInvoice;

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
	
	
    @Query("""
            SELECT DISTINCT i
            FROM AmcInvoice i
           
            LEFT JOIN i.amcJob j 
            LEFT JOIN j.site js 
            LEFT JOIN j.customer jc 
            
           
            LEFT JOIN i.amcRenewalJob r
            LEFT JOIN r.site rs
            LEFT JOIN r.customer rc
            
            WHERE (:search IS NULL OR (
            
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
           
            AND (:dateSearch IS NULL OR i.invoiceDate = :dateSearch)
            
          
            AND (i.isCleared = 0)
            AND (
               FUNCTION('DATE_PART', 'month', i.invoiceDate) = :currentMonth OR
                FUNCTION('DATE_PART', 'month', i.invoiceDate) = :nextMonth
            )
          
        """)
        Page<AmcInvoice> searchAllInvoices(
            @Param("search") String search,
            @Param("dateSearch") LocalDate dateSearch, 
            @Param("currentMonth") int currentMonth, // New: Current Month number (1-12)
            @Param("nextMonth") int nextMonth,       // New: Next Month number (1-12)
            Pageable pageable
        );   
	
    
}
