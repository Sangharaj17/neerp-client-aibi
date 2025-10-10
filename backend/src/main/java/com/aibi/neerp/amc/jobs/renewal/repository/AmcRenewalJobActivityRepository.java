package com.aibi.neerp.amc.jobs.renewal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aibi.neerp.amc.jobs.renewal.entity.AmcRenewalJobActivity;

public interface AmcRenewalJobActivityRepository extends JpaRepository<AmcRenewalJobActivity, Integer>{

	List<AmcRenewalJobActivity> findByBreakdownTodo_CustTodoId(Integer breakdownTodoId);

}
