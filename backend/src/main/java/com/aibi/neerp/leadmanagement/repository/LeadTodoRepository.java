package com.aibi.neerp.leadmanagement.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aibi.neerp.leadmanagement.entity.LeadTodo;

@Repository
public interface LeadTodoRepository extends JpaRepository<LeadTodo, Integer> {


	@Query("SELECT t FROM LeadTodo t " +
		       "JOIN t.lead l " +
		       "JOIN t.activityBy a " +
		       "WHERE LOWER(l.leadCompanyName) LIKE %:keyword% " +
		       "   OR LOWER(l.customerName) LIKE %:keyword% " +
		       "   OR LOWER(t.purpose) LIKE %:keyword% " +
		       "   OR LOWER(t.venue) LIKE %:keyword% " +
		       "   OR LOWER(t.time) LIKE %:keyword% " +
		       "   OR LOWER(FUNCTION('TO_CHAR', t.todoDate, 'YYYY-MM-DD')) LIKE %:keyword% " +
		       "   OR LOWER(a.employeeName) LIKE %:keyword%")
		Page<LeadTodo> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);


	@Query("SELECT t FROM LeadTodo t " +
		       "JOIN t.lead l " +
		       "LEFT JOIN t.activity a " +
		       "WHERE LOWER(l.leadCompanyName) LIKE %:keyword% " +
		       "   OR LOWER(t.purpose) LIKE %:keyword% " +
		       "   OR LOWER(t.venue) LIKE %:keyword% " +
		       "   OR LOWER(a.activityTitle) LIKE %:keyword% " +
		       "   OR LOWER(a.feedback) LIKE %:keyword%")
		Page<LeadTodo> getActivityListsearchByKeyword(@Param("keyword") String keyword, Pageable pageable);


	List<LeadTodo> findByLead_LeadId(Integer leadId);


}

