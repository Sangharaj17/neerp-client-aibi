package com.aibi.neerp.amc.common.controller;

import com.aibi.neerp.amc.common.dto.PaymentTermDto;
import com.aibi.neerp.amc.common.service.PaymentTermService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/amc/common/payment-terms")
public class PaymentTermController {

    private final PaymentTermService service;

    public PaymentTermController(PaymentTermService service) {
        this.service = service;
    }

    @GetMapping
    public List<PaymentTermDto> getAll() {
        return service.getAllPaymentTerms();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentTermDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getPaymentTermById(id));
    }

    @PostMapping
    public PaymentTermDto create(@RequestBody PaymentTermDto dto) {
        return service.createPaymentTerm(dto);
    }

    @PutMapping("/{id}")
    public PaymentTermDto update(@PathVariable Long id, @RequestBody PaymentTermDto dto) {
        return service.updatePaymentTerm(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deletePaymentTerm(id);
        return ResponseEntity.noContent().build();
    }
}
