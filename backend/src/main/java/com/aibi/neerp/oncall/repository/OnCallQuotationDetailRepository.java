package com.aibi.neerp.oncall.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aibi.neerp.oncall.entity.OnCallQuotationDetail;

public interface OnCallQuotationDetailRepository extends JpaRepository<OnCallQuotationDetail, Integer>{

	void deleteByOnCallQuotationId(Integer id);
}
