package com.aibi.neerp.userresource.repository;

import com.aibi.neerp.userresource.entity.EmployeeLeave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EmployeeLeaveRepository extends JpaRepository<EmployeeLeave, Integer> {
    List<EmployeeLeave> findByEmployee_EmployeeId(Integer employeeId);
    List<EmployeeLeave> findByLeaveFromDateBetween(LocalDate startDate, LocalDate endDate);
    List<EmployeeLeave> findByEmployee_EmployeeIdAndLeaveFromDateBetween(Integer employeeId, LocalDate startDate, LocalDate endDate);
}

