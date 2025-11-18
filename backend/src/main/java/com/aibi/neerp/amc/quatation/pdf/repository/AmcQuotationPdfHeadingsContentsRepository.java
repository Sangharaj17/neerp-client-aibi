package com.aibi.neerp.amc.quatation.pdf.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aibi.neerp.amc.quatation.pdf.entity.AmcQuotationPdfHeadingsContents;

public interface AmcQuotationPdfHeadingsContentsRepository extends JpaRepository<AmcQuotationPdfHeadingsContents, Integer> {

	List<AmcQuotationPdfHeadingsContents> findByAmcQuotationPdfHeadingsId(Integer id);
}
