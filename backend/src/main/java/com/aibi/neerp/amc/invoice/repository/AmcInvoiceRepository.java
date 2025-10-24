package com.aibi.neerp.amc.invoice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aibi.neerp.amc.invoice.entity.AmcInvoice;

@Repository
public interface AmcInvoiceRepository extends JpaRepository<AmcInvoice, Integer> {
    
}
