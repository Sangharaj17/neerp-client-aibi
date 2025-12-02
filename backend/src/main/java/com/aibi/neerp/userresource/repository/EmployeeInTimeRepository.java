package com.aibi.neerp.userresource.repository;

import com.aibi.neerp.userresource.entity.EmployeeInTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EmployeeInTimeRepository extends JpaRepository<EmployeeInTime, Integer> {
    List<EmployeeInTime> findByEmployee_EmployeeId(Integer employeeId);
    List<EmployeeInTime> findByDate(LocalDate date);
    List<EmployeeInTime> findByEmployee_EmployeeIdAndDate(Integer employeeId, LocalDate date);
}

