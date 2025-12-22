package com.aibi.neerp.amc.quatation.pdf.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aibi.neerp.amc.quatation.pdf.entity.AmcQuotationPdfHeadings;
import com.aibi.neerp.amc.quatation.pdf.entity.CssStyle;

public interface AmcQuotationPdfHeadingsRepository extends JpaRepository<AmcQuotationPdfHeadings, Integer> {

	Optional<AmcQuotationPdfHeadings> findByHeadingName(String headingName);
	

}
