package com.aibi.neerp.customer.service;

import com.aibi.neerp.customer.dto.SiteDto;
import com.aibi.neerp.customer.entity.Customer;
import com.aibi.neerp.customer.entity.Site;
import com.aibi.neerp.customer.repository.CustomerRepository;
import com.aibi.neerp.customer.repository.SiteRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SiteService {

    private final SiteRepository siteRepository;
    private final CustomerRepository customerRepository;

    // ✅ Create or Update Site
    public SiteDto saveSite(SiteDto dto) {
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new EntityNotFoundException("Customer not found with id: " + dto.getCustomerId()));

        Site site = mapToEntity(dto, customer);
        Site saved = siteRepository.save(site);
        return mapToDto(saved);
    }

    // ✅ Get All Sites
    public List<SiteDto> getAllSites() {
        return siteRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // ✅ Get Site by ID
    public SiteDto getSiteById(Integer id) {
        Site site = siteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Site not found with id: " + id));
        return mapToDto(site);
    }

    // ✅ Delete Site
    public void deleteSite(Integer id) {
        if (!siteRepository.existsById(id)) {
            throw new EntityNotFoundException("Site not found with id: " + id);
        }
        siteRepository.deleteById(id);
    }

    // -------------------- 🔄 Mapping --------------------

    private SiteDto mapToDto(Site entity) {
        return new SiteDto(
                entity.getSiteId(),
                entity.getSiteName(),
                entity.getCustomer() != null ? entity.getCustomer().getCustomerId() : null,
                entity.getSiteAddress()
        );
    }

    private Site mapToEntity(SiteDto dto, Customer customer) {
        return Site.builder()
                .siteId(dto.getSiteId())
                .siteName(dto.getSiteName())
                .siteAddress(dto.getAddress())
                .customer(customer)
                .build();
    }
}
