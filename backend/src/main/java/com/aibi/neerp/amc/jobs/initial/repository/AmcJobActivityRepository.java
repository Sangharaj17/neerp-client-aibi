package com.aibi.neerp.amc.jobs.initial.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aibi.neerp.amc.common.entity.JobActivityType;
import com.aibi.neerp.amc.jobs.initial.entity.AmcJob;
import com.aibi.neerp.amc.jobs.initial.entity.AmcJobActivity;
import com.aibi.neerp.amc.jobs.initial.entity.BreakdownTodo;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AmcJobActivityRepository extends JpaRepository<AmcJobActivity, Integer> {


	List<AmcJobActivity> findByBreakdownTodo_CustTodoId(Integer brekdownTodoId);

	List<AmcJobActivity> findByJob_JobId(Integer jobId);

  
}

