package com.aibi.neerp.customer.repository;

import com.aibi.neerp.customer.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {

	Customer findByLead_LeadId(Integer leadId);
}
