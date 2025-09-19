package com.aibi.neerp.amc.jobs.initial.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aibi.neerp.amc.jobs.initial.entity.BreakdownTodo;

@Repository
public interface BreakdownTodoRepository extends JpaRepository<BreakdownTodo, Integer> {

	List<BreakdownTodo> findByJob_JobId(Integer jobId);
	
}

