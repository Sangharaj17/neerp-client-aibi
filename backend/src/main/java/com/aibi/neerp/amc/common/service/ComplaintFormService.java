package com.aibi.neerp.amc.common.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aibi.neerp.amc.common.dto.ComplaintFormEmpData;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;

@Service
public class ComplaintFormService {
	
	@Autowired
	private EmployeeRepository employeeRepository;

	  public ComplaintFormEmpData getComplaintFormEmpDataByEmpCode(String emp_code) {
	        Employee employee = employeeRepository.findByEmployeeCode(emp_code)
	                .orElseThrow(() -> new RuntimeException("Employee not found with code: " + emp_code));

	        // Map Employee to ComplaintFormEmpData
	        ComplaintFormEmpData empData = new ComplaintFormEmpData();
	        
	        empData.setEmpId(employee.getEmployeeId());
	        empData.setEmpCode(emp_code);
	        empData.setEmpName(employee.getEmployeeName());
	        empData.setEmpContactNumber(employee.getContactNumber());
	      
	      
	        return empData;
	    }
	
	

}
