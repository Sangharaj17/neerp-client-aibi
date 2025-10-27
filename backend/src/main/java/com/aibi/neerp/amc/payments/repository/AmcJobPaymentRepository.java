package com.aibi.neerp.amc.payments.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aibi.neerp.amc.invoice.entity.AmcInvoice;
import com.aibi.neerp.amc.payments.entity.AmcJobPayment;

// The JpaRepository interface takes two generic parameters:
// 1. The Entity class it manages (AmcJobPayment)
// 2. The data type of the Entity's Primary Key (Integer for paymentId)
@Repository
public interface AmcJobPaymentRepository extends JpaRepository<AmcJobPayment, Integer> {
    
    // --- Custom Query Methods (Examples) ---
    
//    /**
//     * Finds a list of payment records associated with a specific Job ID.
//     * @param jobId The job_id from the AmcJobPayment table.
//     * @return List of AmcJobPayment records.
//     */
//    List<AmcJobPayment> findByJobId(Integer jobId);
//    
//    /**
//     * Finds a payment record by its unique invoice number.
//     * @param invoiceNo The invoice_no string.
//     * @return Optional containing the AmcJobPayment, or empty if not found.
//     */
//    Optional<AmcJobPayment> findByInvoiceNo(String invoiceNo);
//    
//    /**
//     * Finds payments made on or after a specific date.
//     * @param date The starting payment date (LocalDate).
//     * @return List of AmcJobPayment records.
//     */
//    List<AmcJobPayment> findByPaymentDateGreaterThanEqual(LocalDate date);
//
//    /**
//     * Finds payments associated with a specific AmcInvoice foreign key.
//     * This uses the navigation property 'amcInvoice' from the entity.
//     * @param amcInvoice The AmcInvoice entity to search by.
//     * @return List of AmcJobPayment records.
//     */
//    List<AmcJobPayment> findByAmcInvoice(AmcInvoice amcInvoice);
}