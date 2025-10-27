package com.aibi.neerp.customer.repository;

import com.aibi.neerp.customer.entity.Site;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SiteRepository extends JpaRepository<Site, Integer> {

	boolean existsByCustomer_CustomerIdAndSiteNameIgnoreCase(Integer customerId, String siteName);

	Optional<Site> findByCustomer_CustomerIdAndSiteNameIgnoreCase(Integer customerId, String siteName);
}
