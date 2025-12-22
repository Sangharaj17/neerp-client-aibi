package com.aibi.neerp.amc.quatation.pdf.service;

import com.aibi.neerp.amc.quatation.pdf.dto.CssStyleDto;
import com.aibi.neerp.amc.quatation.pdf.entity.AmcQuotationPdfHeadings;
import com.aibi.neerp.amc.quatation.pdf.entity.CssStyle;
import com.aibi.neerp.amc.quatation.pdf.repository.AmcQuotationPdfHeadingsRepository;
import com.aibi.neerp.amc.quatation.pdf.repository.CssStyleRepository;
// You will need to import your AmcQuotationPdfHeadingsRepository here
// import com.aibi.neerp.amc.quatation.pdf.repository.AmcQuotationPdfHeadingsRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CssStyleService {

    @Autowired
    private CssStyleRepository cssStyleRepository;

     @Autowired
     private AmcQuotationPdfHeadingsRepository headingsRepository;

    public CssStyleDto createCssStyle(CssStyleDto dto) {
        CssStyle entity = mapToEntity(dto);
        CssStyle savedEntity = cssStyleRepository.save(entity);
        return mapToDto(savedEntity);
    }

    public CssStyleDto getCssStyleById(Integer id) {
        CssStyle entity = cssStyleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CssStyle not found with id: " + id));
        return mapToDto(entity);
    }

    public List<CssStyleDto> getAllCssStyles() {
        return cssStyleRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CssStyleDto updateCssStyle(Integer id, CssStyleDto dto) {
        CssStyle existing = cssStyleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CssStyle not found with id: " + id));

        existing.setPaddingTop(dto.getPaddingTop());
        existing.setPaddingBottom(dto.getPaddingBottom());

        // Update relationship if provided
        if (dto.getAmcQuotationPdfHeadingsId() != null) {
            // AmcQuotationPdfHeadings heading = headingsRepository.findById(dto.getAmcQuotationPdfHeadingsId())
            //        .orElseThrow(() -> new RuntimeException("Heading not found"));
            // existing.setAmcQuotationPdfHeadings(heading);
        }

        CssStyle updated = cssStyleRepository.save(existing);
        return mapToDto(updated);
    }

    public void deleteCssStyle(Integer id) {
        if (!cssStyleRepository.existsById(id)) {
            throw new RuntimeException("CssStyle not found with id: " + id);
        }
        cssStyleRepository.deleteById(id);
    }
    
    public CssStyleDto getCssStyleByHeadingId(Integer headingId) {
        CssStyle entity = cssStyleRepository
                .findFirstByAmcQuotationPdfHeadings_Id(headingId)
                .orElseThrow(() ->
                        new RuntimeException("CssStyle not found for heading id: " + headingId));

        return mapToDto(entity);
    }
    
    public CssStyleDto getCssStyleByHeadingName(String headingName) {
        // 1. Find the heading entity by the string name
        AmcQuotationPdfHeadings heading = headingsRepository
                .findByHeadingName(headingName)
                .orElseThrow(() -> new RuntimeException("Heading not found: " + headingName));

        // 2. Use the heading ID to get the style (reusing your existing logic)
        return getCssStyleByHeadingId(heading.getId());
    }
    
    @Transactional
    public CssStyleDto updateCssStyleByHeadingId(Integer headingId, CssStyleDto dto) {

        CssStyle cssStyle = cssStyleRepository
                .findFirstByAmcQuotationPdfHeadings_Id(headingId)
                .orElseGet(() -> {
                    CssStyle newStyle = new CssStyle();

                    // 🔗 attach heading reference
                    AmcQuotationPdfHeadings heading = headingsRepository
                            .findById(headingId)
                            .orElseThrow(() ->
                                    new RuntimeException("Heading not found with id: " + headingId));

                    newStyle.setAmcQuotationPdfHeadings(heading);
                    return newStyle;
                });

        // Update allowed fields (works for both new & existing)
        cssStyle.setPaddingTop(dto.getPaddingTop());
        cssStyle.setPaddingBottom(dto.getPaddingBottom());

        CssStyle saved = cssStyleRepository.save(cssStyle);
        return mapToDto(saved);
    }





    // --- Mapper Methods ---
    
    private CssStyle mapToEntity(CssStyleDto dto) {
        CssStyle entity = new CssStyle();
        entity.setId(dto.getId());
        entity.setPaddingTop(dto.getPaddingTop());
        entity.setPaddingBottom(dto.getPaddingBottom());
        
        if (dto.getAmcQuotationPdfHeadingsId() != null) {
            AmcQuotationPdfHeadings heading = new AmcQuotationPdfHeadings();
            heading.setId(dto.getAmcQuotationPdfHeadingsId());
            entity.setAmcQuotationPdfHeadings(heading);
        }
        return entity;
    }
    

    private CssStyleDto mapToDto(CssStyle entity) {
        CssStyleDto dto = new CssStyleDto();
        dto.setId(entity.getId());
        dto.setPaddingTop(entity.getPaddingTop());
        dto.setPaddingBottom(entity.getPaddingBottom());
        
        if (entity.getAmcQuotationPdfHeadings() != null) {
            dto.setAmcQuotationPdfHeadingsId(entity.getAmcQuotationPdfHeadings().getId());
        }
        return dto;
    }
}