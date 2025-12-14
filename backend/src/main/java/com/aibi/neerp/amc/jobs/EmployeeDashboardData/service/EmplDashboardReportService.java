package com.aibi.neerp.amc.jobs.EmployeeDashboardData.service;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.RouteMatcher.Route;

import com.aibi.neerp.amc.common.entity.JobActivityType;
import com.aibi.neerp.amc.jobs.EmployeeDashboardData.dto.ActivityDetailsData;
import com.aibi.neerp.amc.jobs.EmployeeDashboardData.dto.EmpActivitiesCountsData;
import com.aibi.neerp.amc.jobs.EmployeeDashboardData.dto.EmplActivityData;
import com.aibi.neerp.amc.jobs.EmployeeDashboardData.dto.MonthlyActivityCount;
import com.aibi.neerp.amc.jobs.EmployeeDashboardData.dto.TopEmplByActivityData;
import com.aibi.neerp.amc.jobs.EmployeeDashboardData.dto.YearlyActivityData;
import com.aibi.neerp.amc.jobs.initial.dto.EmployeeDto;
import com.aibi.neerp.amc.jobs.initial.entity.AmcJob;
import com.aibi.neerp.amc.jobs.initial.entity.AmcJobActivity;
import com.aibi.neerp.amc.jobs.initial.entity.BreakdownTodo;
import com.aibi.neerp.amc.jobs.initial.entity.BreakdownTodoLiftMapping;
import com.aibi.neerp.amc.jobs.initial.entity.Routes;
import com.aibi.neerp.amc.jobs.initial.repository.AmcJobActivityRepository;
import com.aibi.neerp.amc.jobs.initial.repository.AmcJobRepository;
import com.aibi.neerp.amc.jobs.initial.repository.BreakdownTodoLiftMappingRepository;
import com.aibi.neerp.amc.jobs.renewal.entity.AmcRenewalJob;
import com.aibi.neerp.amc.jobs.renewal.entity.AmcRenewalJobActivity;
import com.aibi.neerp.amc.jobs.renewal.repository.AmcRenewalJobActivityRepository;
import com.aibi.neerp.amc.jobs.renewal.repository.AmcRenewalJobRepository;
import com.aibi.neerp.amc.quatation.initial.entity.AmcQuotation;
import com.aibi.neerp.amc.quatation.initial.entity.RevisedAmcQuotation;
import com.aibi.neerp.amc.quatation.renewal.entity.AmcRenewalQuotation;
import com.aibi.neerp.amc.quatation.renewal.entity.RevisedRenewalAmcQuotation;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;

import lombok.AllArgsConstructor;

@Service
public class EmplDashboardReportService {
	
	private static final int TOP_EMPLOYEES_LIMIT = 10;
	
	private static final String[] MONTHS = {
		"JAN", "FEB", "MAR", "APR",
		"MAY", "JUN", "JUL", "AUG",
		"SEP", "OCT", "NOV", "DEC"
	};
	
	@Autowired
	private AmcJobRepository amcJobRepository;
	
	@Autowired AmcRenewalJobRepository amcRenewalJobRepository;
	
	@Autowired
	private AmcJobActivityRepository amcJobActivityRepository;
	
	@Autowired 
	private AmcRenewalJobActivityRepository amcRenewalJobActivityRepository;
	
	@Autowired
	private EmployeeRepository employeeRepository;
	
	@Autowired
	private BreakdownTodoLiftMappingRepository breakdownTodoLiftMappingRepository;
	
	/**
	 * Get top employees by activity data within a date range
	 */
	public TopEmplByActivityData topEmplByActivityData(LocalDate startDate, LocalDate endDate) {

	    if (startDate == null || endDate == null) {
	        throw new IllegalArgumentException("Start date and end date must not be null");
	    }

	    if (startDate.isAfter(endDate)) {
	        throw new IllegalArgumentException("Start date cannot be after end date");
	    }

	    List<AmcJobActivity> amcJobActivities =
	            amcJobActivityRepository.findByActivityDateBetween(startDate, endDate);

	    List<AmcRenewalJobActivity> amcRenewalJobActivities =
	            amcRenewalJobActivityRepository.findByActivityDateBetween(startDate, endDate);

	    Map<Integer, EmplActivityData> empActivityMap = new HashMap<>();
	    processAmcJobActivities(empActivityMap, amcJobActivities);
	    processAmcRenewalJobActivities(empActivityMap, amcRenewalJobActivities);

	    List<EmplActivityData> top10Employees = empActivityMap.values().stream()
	            .sorted(Comparator.comparingInt(this::getTotalActivityCount).reversed())
	            .limit(TOP_EMPLOYEES_LIMIT)
	            .collect(Collectors.toList());

	    return TopEmplByActivityData.builder()
	            .emplActivityDatas(top10Employees)
	            .build();
	}

	
	private void processAmcJobActivities(Map<Integer, EmplActivityData> empActivityMap, 
			List<AmcJobActivity> amcJobActivities) {
		
		if (amcJobActivities == null || amcJobActivities.isEmpty()) {
			return;
		}
		
		try {
					
	            List<AmcJobActivity> filterActivites = filterActivitiesForProcessAmcJobActivities(amcJobActivities);

			
				for (AmcJobActivity activity : filterActivites) {
					if (activity == null || activity.getJobActivityBy() == null || 
						activity.getJobActivityType() == null) {
						continue;
					}
					
					Integer empId = activity.getJobActivityBy().getEmployeeId();
					String activityType = activity.getJobActivityType().getActivityName();
					
					if (empId == null || activityType == null) {
						continue;
					}
					
					EmplActivityData data = empActivityMap.computeIfAbsent(empId, 
						k -> EmplActivityData.builder()
							.empname(activity.getJobActivityBy().getEmployeeName())
							.serviceActivityCount(0)
							.breakDownActivityCount(0)
							.build()
					);
					
					incrementActivityCount(data, activityType);
				}
			
				
		} catch (Exception e) {
			// Silently handle exception
		}
	}
	
	private List<AmcJobActivity> filterActivitiesForProcessAmcJobActivities(
	        List<AmcJobActivity> amcJobActivities) {

	    List<AmcJobActivity> filteredActivities = new ArrayList<>();
	    
	    if(amcJobActivities!=null) {

		    // Group activities by jobId
		    Map<Integer, List<AmcJobActivity>> jobActivitiesMap = new HashMap<>();
	
		    for (AmcJobActivity a : amcJobActivities) {
		        Integer jobId = a.getJob().getJobId();
		        jobActivitiesMap.computeIfAbsent(jobId, k -> new ArrayList<>()).add(a);
		    }
	
		    // Process per job
		    for (Map.Entry<Integer, List<AmcJobActivity>> entry : jobActivitiesMap.entrySet()) {
	
		        Integer jobId = entry.getKey();
		        List<AmcJobActivity> activities = entry.getValue();
	
		        Map<String, Set<Integer>> serviceEmpMap = new HashMap<>();
		        Map<Integer, Set<Integer>> breakdownEmpMap = new HashMap<>();
	
		        for (AmcJobActivity activity : activities) {
	
		            String type = activity.getJobActivityType().getActivityName();
	
		            // ====================================================
		            // SERVICE ACTIVITY
		            // ====================================================
		            if ("service".equalsIgnoreCase(type)) {
	
		                Integer empId = activity.getJobActivityBy().getEmployeeId();
		                String jobService = activity.getJobService();
	
		                Set<Integer> empIds =
		                        serviceEmpMap.computeIfAbsent(jobService, k -> new HashSet<>());
	
		                if (!empIds.contains(empId)) {
	
		                    // Fetch total lifts count for this service
		                    AmcJob amcJob = amcJobRepository.findById(jobId).get();
		                    CombinedEnquiry combinedEnquiry =
		                            amcJob.getAmcQuotation() != null
		                                    ? amcJob.getAmcQuotation().getCombinedEnquiry()
		                                    : amcJob.getRevisedAmcQuotation().getCombinedEnquiry();
	
		                    int totalLifts = combinedEnquiry.getEnquiries().size();
	
		                    // Check if service done for all lifts
		                    if (isServiceDoneForAllLifts(jobService, jobId, totalLifts)) {
		                        filteredActivities.add(activity);
		                    }
	
		                    empIds.add(empId);
		                }
		            }
	
		            // ====================================================
		            // BREAKDOWN ACTIVITY
		            // ====================================================
		            else {
	
		                Integer todoId = activity.getBreakdownTodo().getCustTodoId();
		                Integer empId = activity.getJobActivityBy().getEmployeeId();
	
		                Set<Integer> empIds =
		                        breakdownEmpMap.computeIfAbsent(todoId, k -> new HashSet<>());
	
		                if (!empIds.contains(empId)) {
	
		                    if (isBreakDownActivityDoneForAllLifts(todoId)) {
		                        filteredActivities.add(activity);
		                    }
	
		                    empIds.add(empId);
		                }
		            }
		        }
		    }
	    }

	    return filteredActivities;
	}

	
	
	
	private void processAmcRenewalJobActivities(Map<Integer, EmplActivityData> empActivityMap, 
			List<AmcRenewalJobActivity> activities) {
		
		if (activities == null || activities.isEmpty()) {
			return;
		}
		
		try {
			
            List<AmcRenewalJobActivity> filterActivites = filterActivitiesForProcessAmcRenewalJobActivities(activities);

			
				for (AmcRenewalJobActivity activity : filterActivites) {
					if (activity == null || activity.getJobActivityBy() == null || 
						activity.getJobActivityType() == null) {
						continue;
					}
					
					Integer empId = activity.getJobActivityBy().getEmployeeId();
					String activityType = activity.getJobActivityType().getActivityName();
					
					if (empId == null || activityType == null) {
						continue;
					}
					
					EmplActivityData data = empActivityMap.computeIfAbsent(empId, 
						k -> EmplActivityData.builder()
							.empname(activity.getJobActivityBy().getEmployeeName())
							.serviceActivityCount(0)
							.breakDownActivityCount(0)
							.build()
					);
					
					incrementActivityCount(data, activityType);
				}
				
		} catch (Exception e) {
			// Silently handle exception
		}
	}
	
	private List<AmcRenewalJobActivity> filterActivitiesForProcessAmcRenewalJobActivities(
	        List<AmcRenewalJobActivity> amcRenewalJobActivities) {

	    List<AmcRenewalJobActivity> filterActivites = new ArrayList<>();
	    
	    if(amcRenewalJobActivities!=null) {

		    HashMap<Integer, List<AmcRenewalJobActivity>> jobIdMapWithAmcRenewalJobActivities = 
		            new HashMap<>();
	
		    // --- Group by RenewalJobId ---
		    for (AmcRenewalJobActivity activity : amcRenewalJobActivities) {
	
		        Integer renewalJobId = activity.getAmcRenewalJob().getRenewalJobId();
	
		        jobIdMapWithAmcRenewalJobActivities
		            .computeIfAbsent(renewalJobId, k -> new ArrayList<>())
		            .add(activity);
		    }
	
		    // --- Process each Renewal Job ---
		    for (Map.Entry<Integer, List<AmcRenewalJobActivity>> entry :
		            jobIdMapWithAmcRenewalJobActivities.entrySet()) {
	
		        Integer renewalJobId = entry.getKey();
		        List<AmcRenewalJobActivity> activities = entry.getValue();
	
		        // Track service jobService → employeeIds
		        HashMap<String, HashSet<Integer>> jobServiceMapWithListOfEmpIds =
		                new HashMap<>();
	
		        // Track breakdown todo → employeeIds
		        HashMap<Integer, HashSet<Integer>> breakDownTodoIdMapWithListOfEmpIds =
		                new HashMap<>();
	
		        for (AmcRenewalJobActivity activity : activities) {
	
		            String jobActivityType = activity.getJobActivityType().getActivityName();
	
		            // ============================================================
		            //                  SERVICE ACTIVITIES
		            // ============================================================
		            if (jobActivityType.equalsIgnoreCase("service")) {
	
		                Integer empId = activity.getJobActivityBy().getEmployeeId();
		                String jobService = activity.getJobService();
	
		                HashSet<Integer> serviceEmpIds =
		                        jobServiceMapWithListOfEmpIds.get(jobService);
	
		                boolean isAlreadyDone =
		                        serviceEmpIds != null && serviceEmpIds.contains(empId);
	
		                if (!isAlreadyDone) {
	
		                    // ----------------------------------------
		                    // 1. Get total lift count for this renewal job
		                    // ----------------------------------------
		                    AmcRenewalJob renewalJob =
		                            amcRenewalJobRepository.findById(renewalJobId).get();
	
		                    CombinedEnquiry combinedEnquiry = null;
	
		                    if (renewalJob.getAmcRenewalQuotation()!= null)
		                        combinedEnquiry = renewalJob.getAmcRenewalQuotation().getCombinedEnquiry();
		                    else
		                        combinedEnquiry = renewalJob.getRevisedRenewalAmcQuotation().getCombinedEnquiry();
	
		                    int totalLiftCount = combinedEnquiry.getEnquiries().size();
	
		                    // ----------------------------------------
		                    // 2. Check if service completed for all lifts
		                    // ----------------------------------------
		                    boolean isServiceDoneForAll =
		                            isRenewalServiceDoneForAllLifts(jobService, renewalJobId, totalLiftCount);
	
		                    if (isServiceDoneForAll) {
		                        filterActivites.add(activity);
		                    }
	
		                    // ----------------------------------------
		                    // 3. Add emp id to tracking map
		                    // ----------------------------------------
		                    jobServiceMapWithListOfEmpIds
		                            .computeIfAbsent(jobService, k -> new HashSet<>())
		                            .add(empId);
		                }
	
		            }
		            // ============================================================
		            //                  BREAKDOWN ACTIVITIES
		            // ============================================================
		            else {
	
		                Integer custTodoId = activity.getBreakdownTodo().getCustTodoId();
		                Integer empId = activity.getJobActivityBy().getEmployeeId();
	
		                HashSet<Integer> bdEmpIds =
		                        breakDownTodoIdMapWithListOfEmpIds.get(custTodoId);
	
		                boolean isAlreadyDone =
		                        bdEmpIds != null && bdEmpIds.contains(empId);
	
		                if (!isAlreadyDone) {
	
		                    boolean allLiftsDone =
		                            isRenewalBreakdownDoneForAllLifts(custTodoId);
	
		                    if (allLiftsDone) {
		                        filterActivites.add(activity);
		                    }
	
		                    breakDownTodoIdMapWithListOfEmpIds
		                            .computeIfAbsent(custTodoId, k -> new HashSet<>())
		                            .add(empId);
		                }
		            }
		        }
		    }
	    }

	    return filterActivites;
	}

	
	private void incrementActivityCount(EmplActivityData data, String activityType) {
		if ("service".equalsIgnoreCase(activityType)) {
			data.setServiceActivityCount(data.getServiceActivityCount() + 1);
		} else if ("breakdown".equalsIgnoreCase(activityType)) {
			data.setBreakDownActivityCount(data.getBreakDownActivityCount() + 1);
		}
	}
	
	private int getTotalActivityCount(EmplActivityData data) {
		return data.getServiceActivityCount() + data.getBreakDownActivityCount();
	}
	
	/**
	 * Get yearly monthwise activity data
	 */
	public YearlyActivityData getYearlyActivityData() {
		try {
			YearlyActivityData yearlyActivityData = new YearlyActivityData();
			LocalDate currentDate = LocalDate.now();

			//String currentMonth = currentDate.getMonth().name();
			Integer currentYear = currentDate.getYear();
			
			Dates dates = calculateDatesFromCurrentDate(currentDate);
					
			LocalDate startDate = dates.startDate;
			LocalDate endDate = dates.endDate;
			
			// Initialize monthly activity counts for all months
			HashMap<String, MonthlyActivityCount> monthlyActivityCountInHash = 
					new HashMap<>();
			
			for (String month : MONTHS) {
				MonthlyActivityCount monthlyActivityCount = new MonthlyActivityCount();
				monthlyActivityCount.setMonth(month);
				monthlyActivityCount.setTotalServicesCounts(0);
				monthlyActivityCount.setTotalBreakDownsCounts(0);
				monthlyActivityCountInHash.put(month, monthlyActivityCount);
			}
			
			// Process AMC Job Activities
			List<AmcJobActivity> amcJobActivities = 
					amcJobActivityRepository.findByActivityDateBetween(startDate, endDate);
			
			System.out.println("amcJobActivities size is = "+amcJobActivities.size());
			
			List<AmcJobActivity> filterAmcJobActivities = filterCompletedServicesAndBrekdownsForAllLifts(amcJobActivities);
			
			if (filterAmcJobActivities != null && !filterAmcJobActivities.isEmpty()) {
				processAmcJobActivitiesForMonthly(filterAmcJobActivities, monthlyActivityCountInHash);
			}
			
			// Process AMC Renewal Job Activities
			monthlyActivityCountInHash = updateMonthlyActivityCountInHashForAmcRenewalActivity(
					monthlyActivityCountInHash, dates);

			// Get sequence-wise monthly activity counts
			List<MonthlyActivityCount> monthlyActivityCounts = 
					getSequenceWise(monthlyActivityCountInHash);
			
			/**
			 * here i am calculating total active jobs 
			 */
			
			Integer totalActiveJobs = 0 ;
			Integer totalCurrentMonthCompletedService = 0;
			String currentMonth = currentDate.getMonth().name().substring(0, 3); 
			String currentMonthAndYear = currentMonth + " " + currentYear;

			if (monthlyActivityCountInHash != null) {
			    totalCurrentMonthCompletedService =
			            monthlyActivityCountInHash.get(currentMonth).getTotalServicesCounts();
			}

			
			totalActiveJobs = getTotalActiveJobs(currentDate);
			
			yearlyActivityData.setMonthlyActivityCounts(monthlyActivityCounts);
			yearlyActivityData.setToatlServiceDoneCurrentMonth(totalCurrentMonthCompletedService);
			yearlyActivityData.setCurrentMonthAndYear(currentMonthAndYear);
			yearlyActivityData.setTotalActiveJobs(totalActiveJobs);			
			
			return yearlyActivityData;
			
		} catch (Exception e) {
			System.out.println(e);
			YearlyActivityData yearlyActivityData = new YearlyActivityData();
			yearlyActivityData.setMonthlyActivityCounts(new ArrayList<>());
			return yearlyActivityData;
		}
	}
	
	private List<AmcJobActivity> filterCompletedServicesAndBrekdownsForAllLifts(List<AmcJobActivity> amcJobActivities){
		
		if(amcJobActivities!=null) {
			
			List<AmcJobActivity> filterActivites = new ArrayList<AmcJobActivity>();
			
			HashMap<Integer, List<AmcJobActivity>> jobIdMapWithAmcJobActivities = new HashMap<Integer, List<AmcJobActivity>>();
			
			for(AmcJobActivity activity : amcJobActivities) {
				
				Integer jobId = activity.getJob().getJobId();
				
				if(jobIdMapWithAmcJobActivities.get(jobId) == null) {
					
					List<AmcJobActivity> activities = new ArrayList<AmcJobActivity>();
					activities.add(activity);
					
					jobIdMapWithAmcJobActivities.put(jobId, activities);
					
				}else {
					
					List<AmcJobActivity> activities = jobIdMapWithAmcJobActivities.get(jobId);
                    activities.add(activity);
					
					jobIdMapWithAmcJobActivities.put(jobId, activities);
				}
			}
			
			for(Map.Entry<Integer, List<AmcJobActivity>> entry : jobIdMapWithAmcJobActivities.entrySet()) {
				
				Integer jobId = entry.getKey();
				List<AmcJobActivity> activites = entry.getValue();
				
				Integer totalLiftCountsForService = 0;
				
				AmcJob amcJob = amcJobRepository.findById(jobId).get();
				AmcQuotation amcQuotation = amcJob.getAmcQuotation();
				RevisedAmcQuotation revisedAmcQuotation = amcJob.getRevisedAmcQuotation();				
				
				CombinedEnquiry combinedEnquiry = null;
				
				if(amcQuotation!=null) {
					combinedEnquiry = amcQuotation.getCombinedEnquiry();
					totalLiftCountsForService = combinedEnquiry.getEnquiries().size();					
				}else {
					combinedEnquiry = revisedAmcQuotation.getCombinedEnquiry();
					totalLiftCountsForService = combinedEnquiry.getEnquiries().size();	
				}
				
				HashSet<String> checkedStatusJobService = new HashSet<String>();
				HashSet<Integer> checkedStatusCustTodoIdForBreakDown = new HashSet<Integer>();
				
				for(AmcJobActivity activity : activites) {
					
					String jobActivityType = activity.getJobActivityType().getActivityName();
					String jobService = activity.getJobService();
					
					
					if(jobActivityType.equalsIgnoreCase("service")){
						
						if(checkedStatusJobService.contains(jobService)==false) {
							
							boolean isServiceDoneForAllLifts = isServiceDoneForAllLifts(jobService, jobId, totalLiftCountsForService);
							
							if(isServiceDoneForAllLifts) {
								filterActivites.add(activity);
							}
							
							checkedStatusJobService.add(jobService);
							
						}						
						
						
					}else {
						
						BreakdownTodo breakdownTodo = activity.getBreakdownTodo();
						Integer breakdownTodoId = breakdownTodo.getCustTodoId();
						
						if(checkedStatusCustTodoIdForBreakDown.contains(breakdownTodoId)==false) {
							
							boolean isBreakDownActivityDoneForAllLifts = isBreakDownActivityDoneForAllLifts(breakdownTodoId);
							
							if(isBreakDownActivityDoneForAllLifts) {
								filterActivites.add(activity);
							}
							
							checkedStatusCustTodoIdForBreakDown.add(breakdownTodoId);
						}
					}
				}
				
			}
			
			return filterActivites;
			
		}else {
			return new ArrayList<AmcJobActivity>();
		}
	
	}
	
	private boolean isServiceDoneForAllLifts(String jobService, Integer jobId, Integer liftAssignForThisJobCounts) {
	    // Count matching activities directly from DB
	    long doneActivityCount = amcJobActivityRepository.countByJob_JobIdAndJobServiceIgnoreCase(jobId, jobService);
	    
	    // Compare count with expected lifts
	    return doneActivityCount == liftAssignForThisJobCounts;
	}
	
	private boolean isBreakDownActivityDoneForAllLifts(Integer custTodoId) {

	    // Count how many lifts are assigned for this breakdown
	    long assignedLiftCount = breakdownTodoLiftMappingRepository
	            .countByBreakdownTodo_CustTodoId(custTodoId);

	    // Count how many activities are completed for this breakdown
	    long completedActivityCount = amcJobActivityRepository
	            .countByBreakdownTodo_CustTodoId(custTodoId);

	    // Compare both
	    return completedActivityCount == assignedLiftCount;
	}
	
	
	/**
	 * from below code start for renewalactivity filter where need to find those records which all lifts counts are completed for that service
	 * or breakdown
	 * @param currentDate
	 * @return
	 */
	
	private List<AmcRenewalJobActivity> filterCompletedServicesAndBreakdownsForAllLiftsRenewal(
	        List<AmcRenewalJobActivity> amcRenewalJobActivities) {

	    if (amcRenewalJobActivities == null) {
	        return new ArrayList<>();
	    }

	    List<AmcRenewalJobActivity> filteredActivities = new ArrayList<>();

	    HashMap<Integer, List<AmcRenewalJobActivity>> jobIdGroupedMap = new HashMap<>();

	    // GROUP BY JOB ID
	    for (AmcRenewalJobActivity activity : amcRenewalJobActivities) {

	        Integer jobId = activity.getAmcRenewalJob().getRenewalJobId();

	        jobIdGroupedMap
	                .computeIfAbsent(jobId, k -> new ArrayList<>())
	                .add(activity);
	    }

	    // PROCESS EACH JOB ID GROUP
	    for (Map.Entry<Integer, List<AmcRenewalJobActivity>> entry : jobIdGroupedMap.entrySet()) {

	        Integer jobId = entry.getKey();
	        List<AmcRenewalJobActivity> activities = entry.getValue();

	        // Get Job to count total lifts
	        AmcRenewalJob amcRenewalJob = amcRenewalJobRepository.findById(jobId).get();
	        AmcRenewalQuotation amcQuotation = amcRenewalJob.getAmcRenewalQuotation();
	        RevisedRenewalAmcQuotation revisedAmcQuotation = amcRenewalJob.getRevisedRenewalAmcQuotation();

	        CombinedEnquiry combinedEnquiry = null;

	        int totalLiftCount = 0;

	        if (amcQuotation != null) {
	            combinedEnquiry = amcQuotation.getCombinedEnquiry();
	            totalLiftCount = combinedEnquiry.getEnquiries().size();
	        } else {
	            combinedEnquiry = revisedAmcQuotation.getCombinedEnquiry();
	            totalLiftCount = combinedEnquiry.getEnquiries().size();
	        }

	        // Avoid duplicate checks
	        HashSet<String> serviceChecked = new HashSet<>();
	        HashSet<Integer> breakdownChecked = new HashSet<>();

	        // LOOP THROUGH ACTIVITIES
	        for (AmcRenewalJobActivity activity : activities) {

	            String jobActivityType = activity.getJobActivityType().getActivityName();
	            String jobService = activity.getJobService();

	            if (jobActivityType.equalsIgnoreCase("service")) {

	                if (!serviceChecked.contains(jobService)) {

	                    boolean done = isRenewalServiceDoneForAllLifts(jobService, jobId, totalLiftCount);

	                    if (done) {
	                        filteredActivities.add(activity);
	                    }

	                    serviceChecked.add(jobService);
	                }

	            } else { // BREAKDOWN

	                BreakdownTodo breakdownTodo = activity.getBreakdownTodo();
	                Integer custTodoId = breakdownTodo.getCustTodoId();

	                if (!breakdownChecked.contains(custTodoId)) {

	                    boolean done = isRenewalBreakdownDoneForAllLifts(custTodoId);

	                    if (done) {
	                        filteredActivities.add(activity);
	                    }

	                    breakdownChecked.add(custTodoId);
	                }
	            }
	        }
	    }

	    return filteredActivities;
	}
	
	private boolean isRenewalServiceDoneForAllLifts(String jobService, Integer renewalJobId, Integer totalLiftCount) {

	    long completedCount = amcRenewalJobActivityRepository
	            .countByAmcRenewalJob_RenewalJobIdAndJobServiceIgnoreCase(
	                    renewalJobId,
	                    jobService
	            );

	    return completedCount == totalLiftCount;
	}



	private boolean isRenewalBreakdownDoneForAllLifts(Integer custTodoId) {

	    long assignedLiftCount = breakdownTodoLiftMappingRepository
	            .countByBreakdownTodo_CustTodoId(custTodoId);

	    long completedActivityCount = amcRenewalJobActivityRepository
	            .countByBreakdownTodo_CustTodoId(custTodoId);

	    return completedActivityCount == assignedLiftCount;
	}



	
	// here code end 


	
	private Integer getTotalActiveJobs(LocalDate currentDate) {

	    Integer amcActive = amcJobRepository.countActiveJobs(currentDate);
	    Integer renewalActive = amcRenewalJobRepository.countActiveRenewalJobs(currentDate);

	    // Safe null handling
	    int total = 0;
	    if (amcActive != null) total += amcActive;
	    if (renewalActive != null) total += renewalActive;

	    return total;
	}

	
	private void processAmcJobActivitiesForMonthly(List<AmcJobActivity> amcJobActivities, 
			HashMap<String, MonthlyActivityCount> monthlyActivityCountInHash) {
		
		try {
			
			if(amcJobActivities!=null) {
				for (AmcJobActivity amcJobActivity : amcJobActivities) {
					if (amcJobActivity == null || amcJobActivity.getJobActivityType() == null || 
						amcJobActivity.getActivityDate() == null) {
						continue;
					}
					
					JobActivityType jobActivityType = amcJobActivity.getJobActivityType();
					String jobActivityTypeName = jobActivityType.getActivityName();
					
					if (jobActivityTypeName == null) {
						continue;
					}
					
					LocalDate activityDate = amcJobActivity.getActivityDate();
					String activityMonth = activityDate.getMonth()
							.getDisplayName(TextStyle.SHORT, Locale.ENGLISH).toUpperCase();
					Integer activityMonthInNum = activityDate.getMonthValue();
					
					MonthlyActivityCount monthlyActivityCount = monthlyActivityCountInHash.get(activityMonth);
					
					if (monthlyActivityCount == null) {
						monthlyActivityCount = new MonthlyActivityCount();
						monthlyActivityCount.setMonth(activityMonth);
						monthlyActivityCount.setTotalServicesCounts(0);
						monthlyActivityCount.setTotalBreakDownsCounts(0);
						monthlyActivityCount.setMonthInNum(activityMonthInNum);
					}
					
					// Increment the correct count based on activity type
					if ("service".equalsIgnoreCase(jobActivityTypeName)) {
						monthlyActivityCount.setTotalServicesCounts(
								monthlyActivityCount.getTotalServicesCounts() + 1);
					} else if ("breakdown".equalsIgnoreCase(jobActivityTypeName)) {
						monthlyActivityCount.setTotalBreakDownsCounts(
								monthlyActivityCount.getTotalBreakDownsCounts() + 1);
					}
					
					monthlyActivityCount.setMonthInNum(activityMonthInNum);
					monthlyActivityCountInHash.put(activityMonth, monthlyActivityCount);
				}
			}
			
		} catch (Exception e) {
			// Silently handle exception
		}
	}
	
	/**
	 * Returns monthly activity counts in sequence starting from current month
	 */
	private List<MonthlyActivityCount> getSequenceWise(
			HashMap<String, MonthlyActivityCount> monthlyActivityCountInHash) {
		
		try {
			String currentMonth = LocalDate.now().getMonth()
					.getDisplayName(TextStyle.SHORT, Locale.ENGLISH).toUpperCase();
			
			List<MonthlyActivityCount> monthlyActivityCounts = new ArrayList<>();
			
			int monthIndexVal = 0;
			
			for (int i = 0; i < MONTHS.length; i++) {
				if (MONTHS[i].equalsIgnoreCase(currentMonth)) {
					monthIndexVal = i;
					break;
				}
			}
			
			for (int i = 0; i < 12; i++) {
				String arrIndexMonth = MONTHS[monthIndexVal];
				MonthlyActivityCount monthlyActivityCount = monthlyActivityCountInHash.get(arrIndexMonth);
				
				if (monthlyActivityCount != null) {
					monthlyActivityCounts.add(monthlyActivityCount);
				} else {
					// Add empty count if not found
					MonthlyActivityCount emptyCount = new MonthlyActivityCount();
					emptyCount.setMonth(arrIndexMonth);
					emptyCount.setTotalServicesCounts(0);
					emptyCount.setTotalBreakDownsCounts(0);
					emptyCount.setMonthInNum(monthIndexVal + 1);
					monthlyActivityCounts.add(emptyCount);
				}
				
				monthIndexVal++;
				
				if (monthIndexVal == 12) {
					monthIndexVal = 0;
				}
			}
			
			return monthlyActivityCounts;
			
		} catch (Exception e) {
			return new ArrayList<>();
		}
	}
	
	private HashMap<String, MonthlyActivityCount> updateMonthlyActivityCountInHashForAmcRenewalActivity(
			HashMap<String, MonthlyActivityCount> monthlyActivityCountInHash, Dates dates) {
		
		try {
			LocalDate startDate = dates.startDate;
			LocalDate endDate = dates.endDate;
			
			List<AmcRenewalJobActivity> amcRenewalJobActivities = 
					amcRenewalJobActivityRepository.findByActivityDateBetween(startDate, endDate);
			
			List<AmcRenewalJobActivity> filterAmcRenewalJobActivities = 
					filterCompletedServicesAndBreakdownsForAllLiftsRenewal(amcRenewalJobActivities);
			
			if (filterAmcRenewalJobActivities != null && !filterAmcRenewalJobActivities.isEmpty()) {
				
				for (AmcRenewalJobActivity amcRenewalJobActivity : filterAmcRenewalJobActivities) {
					if (amcRenewalJobActivity == null || 
						amcRenewalJobActivity.getJobActivityType() == null || 
						amcRenewalJobActivity.getActivityDate() == null) {
						continue;
					}
					
					JobActivityType jobActivityType = amcRenewalJobActivity.getJobActivityType();
					String jobActivityTypeName = jobActivityType.getActivityName();
					
					if (jobActivityTypeName == null) {
						continue;
					}
					
					LocalDate activityDate = amcRenewalJobActivity.getActivityDate();
					String activityMonth = activityDate.getMonth()
							.getDisplayName(TextStyle.SHORT, Locale.ENGLISH).toUpperCase();
					Integer activityMonthInNum = activityDate.getMonthValue();
					
					MonthlyActivityCount monthlyActivityCount = monthlyActivityCountInHash.get(activityMonth);
					
					if (monthlyActivityCount == null) {
						monthlyActivityCount = new MonthlyActivityCount();
						monthlyActivityCount.setMonth(activityMonth);
						monthlyActivityCount.setTotalServicesCounts(0);
						monthlyActivityCount.setTotalBreakDownsCounts(0);
						monthlyActivityCount.setMonthInNum(activityMonthInNum);
					}
					
					// Increment the correct count based on activity type
					if ("service".equalsIgnoreCase(jobActivityTypeName)) {
						monthlyActivityCount.setTotalServicesCounts(
								monthlyActivityCount.getTotalServicesCounts() + 1);
					} else if ("breakdown".equalsIgnoreCase(jobActivityTypeName)) {
						monthlyActivityCount.setTotalBreakDownsCounts(
								monthlyActivityCount.getTotalBreakDownsCounts() + 1);
					}
					
					monthlyActivityCount.setMonthInNum(activityMonthInNum);
					monthlyActivityCountInHash.put(activityMonth, monthlyActivityCount);
				}
			}
			
			return monthlyActivityCountInHash;
			
		} catch (Exception e) {
			return monthlyActivityCountInHash;
		}
	}
	
	private static class Dates {
		LocalDate startDate;
		LocalDate endDate;
	}
	
	private Dates calculateDatesFromCurrentDate(LocalDate currentDate) {
		try {
			LocalDate minusOneYearDate = currentDate.minusYears(1);
			
			Dates dates = new Dates();
			// Start from the first day of the month one year ago
			dates.startDate = minusOneYearDate.withDayOfMonth(1);
			// End at the last day of the current month
			dates.endDate = currentDate.withDayOfMonth(currentDate.lengthOfMonth());
			
			return dates;
			
		} catch (Exception e) {
			Dates dates = new Dates();
			dates.startDate = LocalDate.now().minusYears(1);
			dates.endDate = LocalDate.now();
			return dates;
		}
	}
	
	
	
	
	public List<EmpActivitiesCountsData> activitiesCountsDatas(LocalDate fromDate, LocalDate toDate) {

	    List<EmpActivitiesCountsData> result = new ArrayList<>();

	    try {
	        List<Employee> employees = employeeRepository.findAll();
	        if (employees == null || employees.isEmpty()) {
	            return result;
	        }

	        for (Employee employee : employees) {

	            Integer empId = employee.getEmployeeId();
	            String empName = employee.getEmployeeName();

	            // Fetch activities within date range
	            List<AmcJobActivity> amcActivities =
	                    amcJobActivityRepository.findByEmployeeIdAndDateRange(empId, fromDate, toDate);
	            
	            System.out.println("amcActivities by emp id count is = > "+amcActivities.size());
	            
	            List<AmcJobActivity> filterAmcActivities = filterActivitiesForProcessAmcJobActivities(amcActivities);
	            
	            System.out.println("filterAmcActivities by emp id count is = > "+filterAmcActivities.size());


	            List<AmcRenewalJobActivity> renewalActivities =
	                    amcRenewalJobActivityRepository.findByEmployeeIdAndDateRange(empId, fromDate, toDate);
	            
	            List<AmcRenewalJobActivity> filterRenewalActivities = 
	            		filterActivitiesForProcessAmcRenewalJobActivities(renewalActivities);


	         // Counters
	            int assignedService = 0, unassignedService = 0;
	            int assignedBreak = 0, unassignedBreak = 0;

	            // Process AMC Activities
	            for (AmcJobActivity activity : filterAmcActivities) {
	                boolean isAssigned = isEmployeeAssigned(activity.getJob().getRoute(), empId);
	                String type = activity.getJobActivityType().getActivityName();
	                if (type.equalsIgnoreCase("service")) {
	                    if (isAssigned) assignedService++;
	                    else unassignedService++;
	                } else {
	                    if (isAssigned) assignedBreak++;
	                    else unassignedBreak++;
	                }
	            }

	            // Process Renewal Activities
	            for (AmcRenewalJobActivity activity : filterRenewalActivities) {
	                boolean isAssigned = isEmployeeAssigned(activity.getAmcRenewalJob().getRoute(), empId);
	                String type = activity.getJobActivityType().getActivityName();
	                if (type.equalsIgnoreCase("service")) {
	                    if (isAssigned) assignedService++;
	                    else unassignedService++;
	                } else {
	                    if (isAssigned) assignedBreak++;
	                    else unassignedBreak++;
	                }
	            }


	            int totalService = assignedService + unassignedService;
	            int totalBreakdown = assignedBreak + unassignedBreak;

	            // Assigned Jobs (all time)
	            int totalAssignedJobs =
	                    amcJobRepository.countAssignedJobs(empId).intValue()
	                            + amcRenewalJobRepository.countAssignedRenewalJobs(empId).intValue();


	            EmpActivitiesCountsData dto = EmpActivitiesCountsData.builder()
	                    .empName(empName)
	                    .empId(empId)
	                    .assignedDoneServiceCounts(assignedService)
	                    .assignedDoneBreakdownCounts(assignedBreak)
	                    .unassignedDoneServiceCounts(unassignedService)
	                    .unassignedDoneBreakdownCounts(unassignedBreak)
	                    .totalServiceDoneCounts(totalService)
	                    .totalBreakDownDoneCounts(totalBreakdown)
	                    .totalAssignedAmcJobs(totalAssignedJobs)
	                    .build();

	            result.add(dto);
	        }

	    } catch (Exception ex) {
	        throw new RuntimeException("Error generating employee activity report", ex);
	    }

	    return result;
	}

	
	private boolean isEmployeeAssigned(Routes route, Integer empId) {
	    if (route == null || route.getEmployees() == null) return false;

	    return route.getEmployees()
	            .stream()
	            .anyMatch(e -> e.getEmployeeId().equals(empId));
	}



	
	
	/**
	 * 
	 * this apis service methods are for empl report in details 
	 */
	
	
	/**
	 * and this is first method 
	 */
	
	public List<ActivityDetailsData> emplActivityDatasForInitialJobs(
	        LocalDate from,
	        LocalDate to,
	        Integer empId,
	        String jobActivityType
	) {

	    List<AmcJobActivity> activities =
	            amcJobActivityRepository.findActivitiesWithoutPagination(
	                    from, to, empId, jobActivityType
	            );
	    
        List<AmcJobActivity> filterAmcActivities = filterActivitiesForProcessAmcJobActivities(activities);


	    return filterAmcActivities.stream().map(activity -> {

	        ActivityDetailsData dto = new ActivityDetailsData();

	        dto.setActivityBy(activity.getJobActivityBy().getEmployeeName());
	        dto.setActivityDate(activity.getActivityDate());
	        dto.setCustomerName(activity.getJob().getLead().getCustomerName());
	        dto.setSiteName(activity.getJob().getSite().getSiteName());
	        dto.setSiteaddress(activity.getJob().getSite().getSiteAddress());
	        dto.setDescription(activity.getActivityDescription());

	        List<EmployeeDto> assignedTechnicians = activity.getJob()
	                .getRoute()
	                .getEmployees()
	                .stream()
	                .map(emp -> new EmployeeDto(
	                        emp.getEmployeeId(),
	                        emp.getEmployeeName(),
	                        emp.getAddress(),
	                        null
	                ))
	                .toList();

	        dto.setAssignedTechnicians(assignedTechnicians);

	        return dto;

	    }).toList();
	}

	
	public List<ActivityDetailsData> emplActivityDatasForRenewalJobs(
	        LocalDate from,
	        LocalDate to,
	        Integer empId,
	        String jobActivityType
	) {

	    List<AmcRenewalJobActivity> activities =
	            amcRenewalJobActivityRepository.findActivitiesWithoutPagination(
	                    from, to, empId, jobActivityType
	            );
	    
	    List<AmcRenewalJobActivity> filterRenewalActivities = 
        		filterActivitiesForProcessAmcRenewalJobActivities(activities);


	    return filterRenewalActivities.stream().map(activity -> {

	        ActivityDetailsData dto = new ActivityDetailsData();

	        dto.setActivityBy(activity.getJobActivityBy().getEmployeeName());
	        dto.setActivityDate(activity.getActivityDate());
	        dto.setCustomerName(activity.getAmcRenewalJob().getLead().getCustomerName());
	        dto.setSiteName(activity.getAmcRenewalJob().getSite().getSiteName());
	        dto.setSiteaddress(activity.getAmcRenewalJob().getSite().getSiteAddress());
	        dto.setDescription(activity.getActivityDescription());

	        List<EmployeeDto> assignedTechnicians = activity.getAmcRenewalJob()
	                .getRoute()
	                .getEmployees()
	                .stream()
	                .map(emp -> new EmployeeDto(
	                        emp.getEmployeeId(),
	                        emp.getEmployeeName(),
	                        emp.getAddress(),
	                        null
	                ))
	                .toList();

	        dto.setAssignedTechnicians(assignedTechnicians);

	        return dto;

	    }).toList();
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}