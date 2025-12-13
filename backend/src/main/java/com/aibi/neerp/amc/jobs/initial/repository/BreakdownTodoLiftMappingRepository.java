package com.aibi.neerp.amc.jobs.initial.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aibi.neerp.amc.jobs.initial.entity.AmcJob;
import com.aibi.neerp.amc.jobs.initial.entity.BreakdownTodo;
import com.aibi.neerp.amc.jobs.initial.entity.BreakdownTodoLiftMapping;

public interface BreakdownTodoLiftMappingRepository extends JpaRepository<BreakdownTodoLiftMapping, Integer>{

	void deleteByBreakdownTodo(BreakdownTodo existing);

	List<BreakdownTodoLiftMapping> findByBreakdownTodo_CustTodoId(Integer breakdownId);

	long countByBreakdownTodo_CustTodoId(Integer custTodoId);

}
