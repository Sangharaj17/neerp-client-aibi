package com.aibi.neerp.customer.repository;

import com.aibi.neerp.customer.entity.Site;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SiteRepository extends JpaRepository<Site, Integer> {

	boolean existsByCustomer_CustomerIdAndSiteNameIgnoreCase(Integer customerId, String siteName);
}
