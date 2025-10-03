package com.aibi.neerp.customer.service;

import com.aibi.neerp.customer.dto.CustomerDto;
import com.aibi.neerp.customer.dto.SiteDto;
import com.aibi.neerp.customer.entity.Customer;
import com.aibi.neerp.customer.entity.Site;
import com.aibi.neerp.customer.repository.CustomerRepository;
import com.aibi.neerp.customer.repository.SiteRepository;
import com.aibi.neerp.leadmanagement.entity.NewLeads;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final SiteRepository siteRepository;

    // ✅ Create or Update Customer
    public CustomerDto saveCustomer(CustomerDto dto) {
        Customer customer = mapToEntity(dto);
        Customer saved = customerRepository.save(customer);
        return mapToDto(saved);
    }

    // ✅ Get All Customers
    public Page<CustomerDto> getAllCustomers(String search, int page, int size, String sortBy, String direction) {
     //   log.info("Fetching Customers with search='{}', page={}, size={}, sortBy={}, direction={}",
        //        search, page, size, sortBy, direction);

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Customer> results = customerRepository.searchAll(
                (search == null ? "" : search),
                pageable
        );

        return results.map(this::mapToDto);
    }

    // ✅ Get Customer by ID
    public CustomerDto getCustomerById(Integer id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found with id: " + id));
        return mapToDto(customer);
    }

    // ✅ Delete Customer
    public void deleteCustomer(Integer id) {
        if (!customerRepository.existsById(id)) {
            throw new EntityNotFoundException("Customer not found with id: " + id);
        }
        customerRepository.deleteById(id);
    }

    // -------------------- 🔄 Mapping --------------------

    private CustomerDto mapToDto(Customer entity) {
        return CustomerDto.builder()
                .customerId(entity.getCustomerId())
                .customerName(entity.getCustomerName())
                .newCustomerName(entity.getNewCustomerName())
                .contactNumber(entity.getContactNumber())
                .gstNo(entity.getGstNo())
                .emailId(entity.getEmailId())
                .address(entity.getAddress())
                .isVerified(entity.getIsVerified())
                .active(entity.getActive())
                .leadId(entity.getLead() != null ? entity.getLead().getLeadId() : null)
                .sites(entity.getSites() != null
                        ? entity.getSites().stream().map(this::mapSiteToDto).collect(Collectors.toList())
                        : null)
                .build();
    }

    private Customer mapToEntity(CustomerDto dto) {
        Customer customer = Customer.builder()
                .customerId(dto.getCustomerId())
                .customerName(dto.getCustomerName())
                .newCustomerName(dto.getNewCustomerName())
                .contactNumber(dto.getContactNumber())
                .gstNo(dto.getGstNo())
                .emailId(dto.getEmailId())
                .address(dto.getAddress())
                .isVerified(dto.getIsVerified())
                .active(dto.getActive())
                .build();

        if (dto.getLeadId() != null) {
            NewLeads lead = new NewLeads();
            lead.setLeadId(dto.getLeadId());
            customer.setLead(lead);
        }

        if (dto.getSites() != null) {
            List<Site> sites = dto.getSites().stream()
                    .map(siteDto -> mapSiteToEntity(siteDto, customer))
                    .collect(Collectors.toList());
            customer.setSites(sites);
        }
        return customer;
    }

    private SiteDto mapSiteToDto(Site site) {
        return new SiteDto(
                site.getSiteId(),
                site.getSiteName(),
                site.getCustomer() != null ? site.getCustomer().getCustomerId() : null,
                site.getSiteAddress()
        );
    }

    private Site mapSiteToEntity(SiteDto dto, Customer customer) {
        return Site.builder()
                .siteId(dto.getSiteId())
                .siteName(dto.getSiteName())
                .siteAddress(dto.getAddress())
                .customer(customer)
                .build();
    }
}
