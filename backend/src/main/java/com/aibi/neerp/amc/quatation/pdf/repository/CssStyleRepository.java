package com.aibi.neerp.amc.quatation.pdf.repository;

import com.aibi.neerp.amc.quatation.pdf.entity.CssStyle;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CssStyleRepository extends JpaRepository<CssStyle, Integer> {

	Optional<CssStyle> findFirstByAmcQuotationPdfHeadings_Id(Integer headingId);
}