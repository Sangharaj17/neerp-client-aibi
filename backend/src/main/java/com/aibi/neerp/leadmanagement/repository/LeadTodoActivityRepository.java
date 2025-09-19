package com.aibi.neerp.leadmanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aibi.neerp.leadmanagement.entity.LeadTodoActivity;

@Repository
public interface LeadTodoActivityRepository extends JpaRepository<LeadTodoActivity, Integer> {

	List<LeadTodoActivity> findByLead_LeadId(Integer leadId);
	
	
	
}

