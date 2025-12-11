package com.aibi.neerp.customer.repository;

import com.aibi.neerp.customer.entity.Customer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {

	Customer findByLead_LeadId(Integer leadId);
	
	 @Query("""
		        SELECT DISTINCT c
		        FROM Customer c
		        LEFT JOIN c.lead l
		        LEFT JOIN c.sites s
		        WHERE (:search IS NULL OR :search = '' OR (
		            LOWER(c.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR
		            LOWER(c.newCustomerName) LIKE LOWER(CONCAT('%', :search, '%')) OR
		            LOWER(c.emailId) LIKE LOWER(CONCAT('%', :search, '%')) OR
		            LOWER(c.gstNo) LIKE LOWER(CONCAT('%', :search, '%')) OR
		            LOWER(c.contactNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR
		            LOWER(c.address) LIKE LOWER(CONCAT('%', :search, '%')) OR
		            LOWER(l.leadCompanyName) LIKE LOWER(CONCAT('%', :search, '%')) OR
		            LOWER(s.siteName) LIKE LOWER(CONCAT('%', :search, '%')) OR
		            LOWER(s.siteAddress) LIKE LOWER(CONCAT('%', :search, '%'))
		        ))
		    """)
		    Page<Customer> searchAll(
		            @Param("search") String search,
		            Pageable pageable
		    );

	Optional<Customer> findByCustomerNameIgnoreCase(String customerName);
}
