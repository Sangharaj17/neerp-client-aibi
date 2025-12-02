package com.aibi.neerp.userresource.repository;

import com.aibi.neerp.userresource.entity.EmployeeOutTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EmployeeOutTimeRepository extends JpaRepository<EmployeeOutTime, Integer> {
    List<EmployeeOutTime> findByEmployee_EmployeeId(Integer employeeId);
    List<EmployeeOutTime> findByDate(LocalDate date);
    List<EmployeeOutTime> findByEmployee_EmployeeIdAndDate(Integer employeeId, LocalDate date);
}

