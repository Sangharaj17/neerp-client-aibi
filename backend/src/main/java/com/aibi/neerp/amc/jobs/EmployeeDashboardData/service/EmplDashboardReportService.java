package com.aibi.neerp.amc.jobs.EmployeeDashboardData.service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
import com.aibi.neerp.amc.jobs.initial.repository.AmcJobActivityRepository;
import com.aibi.neerp.amc.jobs.initial.repository.AmcJobRepository;
import com.aibi.neerp.amc.jobs.initial.repository.BreakdownTodoLiftMappingRepository;
import com.aibi.neerp.amc.jobs.renewal.entity.AmcRenewalJob;
import com.aibi.neerp.amc.jobs.renewal.entity.AmcRenewalJobActivity;
import com.aibi.neerp.amc.jobs.renewal.repository.AmcRenewalJobActivityRepository;
import com.aibi.neerp.amc.jobs.renewal.repository.AmcRenewalJobRepository;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.leadmanagement.entity.CombinedEnquiry;

import lombok.AllArgsConstructor;
import lombok.Data;

@Service
public class EmplDashboardReportService {

	private static final int TOP_EMPLOYEES_LIMIT = 10;
	private static final String ACTIVITY_TYPE_SERVICE = "service";
	private static final String ACTIVITY_TYPE_BREAKDOWN = "breakdown";

	@Autowired
	private AmcJobRepository amcJobRepository;

	@Autowired
	private AmcRenewalJobRepository amcRenewalJobRepository;

	@Autowired
	private AmcJobActivityRepository amcJobActivityRepository;

	@Autowired
	private AmcRenewalJobActivityRepository amcRenewalJobActivityRepository;

	@Autowired
	private EmployeeRepository employeeRepository;

	@Autowired
	private BreakdownTodoLiftMappingRepository breakdownTodoLiftMappingRepository;

	// ==================== VALIDATION HELPERS ====================

	private boolean isValidDateRange(LocalDate startDate, LocalDate endDate) {
		return startDate != null && endDate != null && !startDate.isAfter(endDate);
	}

	private boolean isValidEmployee(Employee employee) {
		return employee != null && employee.getEmployeeId() != null && employee.getEmployeeId() > 0;
	}

	private <T> List<T> nullSafeList(List<T> list) {
		return list == null ? new ArrayList<>() : list;
	}

	// ==================== TOP EMPLOYEES BY ACTIVITY ====================

	public TopEmplByActivityData topEmplByActivityData(LocalDate startDate, LocalDate endDate) {
		try {
			if (!isValidDateRange(startDate, endDate)) {
				logWarning("Invalid date range provided");
				return TopEmplByActivityData.builder()
						.emplActivityDatas(new ArrayList<>())
						.build();
			}

			Map<Integer, EmplActivityData> empActivityMap = new HashMap<>();

			// Process both AMC and Renewal activities
			List<AmcJobActivity> amcActivities = nullSafeList(
					amcJobActivityRepository.findByActivityDateBetween(startDate, endDate));
			List<AmcRenewalJobActivity> renewalActivities = nullSafeList(
					amcRenewalJobActivityRepository.findByActivityDateBetween(startDate, endDate));

			processAmcJobActivities(empActivityMap, amcActivities);
			processAmcRenewalJobActivities(empActivityMap, renewalActivities);

			// Get top employees
			List<EmplActivityData> topEmployees = empActivityMap.values().stream()
					.sorted(Comparator.comparingInt(this::getTotalActivityCount).reversed())
					.limit(TOP_EMPLOYEES_LIMIT)
					.collect(Collectors.toList());

			return TopEmplByActivityData.builder()
					.emplActivityDatas(topEmployees)
					.build();

		} catch (Exception e) {
			logError("Error in topEmplByActivityData", e);
			return TopEmplByActivityData.builder()
					.emplActivityDatas(new ArrayList<>())
					.build();
		}
	}

	// ==================== ACTIVITY PROCESSING ====================

	private void processAmcJobActivities(Map<Integer, EmplActivityData> empActivityMap,
			List<AmcJobActivity> activities) {
		if (activities == null || activities.isEmpty()) {
			return;
		}

		try {
			List<AmcJobActivity> filtered = filterActivitiesForProcessAmcJobActivities(activities);
			filtered.forEach(activity -> processActivityData(empActivityMap, activity,
					() -> activity.getJobActivityBy(), activity.getJobActivityType()));
		} catch (Exception e) {
			logError("Error processing AMC job activities", e);
		}
	}

	private void processAmcRenewalJobActivities(Map<Integer, EmplActivityData> empActivityMap,
			List<AmcRenewalJobActivity> activities) {
		if (activities == null || activities.isEmpty()) {
			return;
		}

		try {
			List<AmcRenewalJobActivity> filtered = filterActivitiesForProcessAmcRenewalJobActivities(
					activities);
			filtered.forEach(activity -> processActivityData(empActivityMap, activity,
					() -> activity.getJobActivityBy(), activity.getJobActivityType()));
		} catch (Exception e) {
			logError("Error processing AMC renewal activities", e);
		}
	}

	private <T> void processActivityData(Map<Integer, EmplActivityData> empActivityMap, T activity,
			java.util.function.Supplier<?> empSupplier, JobActivityType jobActivityType) {
		try {
			if (activity == null || jobActivityType == null) {
				return;
			}

			Object empObj = empSupplier.get();
			if (empObj == null) {
				return;
			}

			Employee emp = (Employee) empObj;
			Integer empId = emp.getEmployeeId();
			String activityType = jobActivityType.getActivityName();

			if (empId == null || activityType == null) {
				return;
			}

			EmplActivityData data = empActivityMap.computeIfAbsent(empId,
					k -> EmplActivityData.builder()
							.empname(emp.getEmployeeName())
							.serviceActivityCount(0)
							.breakDownActivityCount(0)
							.build());

			incrementActivityCount(data, activityType);
		} catch (Exception e) {
			logError("Error processing activity data", e);
		}
	}

	// ==================== FILTERING ACTIVITIES ====================

	private List<AmcJobActivity> filterActivitiesForProcessAmcJobActivities(
			List<AmcJobActivity> amcJobActivities) {
		if (amcJobActivities == null || amcJobActivities.isEmpty()) {
			return new ArrayList<>();
		}

		List<AmcJobActivity> filteredActivities = new ArrayList<>();

		try {
			// Group by job ID
			Map<Integer, List<AmcJobActivity>> jobMap = amcJobActivities.stream()
					.filter(a -> a != null && a.getJob() != null)
					.collect(Collectors.groupingBy(a -> a.getJob().getJobId()));

			for (Map.Entry<Integer, List<AmcJobActivity>> entry : jobMap.entrySet()) {
				filterActivitiesPerJob(entry.getValue(), filteredActivities, false);
			}
		} catch (Exception e) {
			logError("Error filtering AMC job activities", e);
		}

		return filteredActivities;
	}

	private List<AmcRenewalJobActivity> filterActivitiesForProcessAmcRenewalJobActivities(
			List<AmcRenewalJobActivity> activities) {
		if (activities == null || activities.isEmpty()) {
			return new ArrayList<>();
		}

		List<AmcRenewalJobActivity> filteredActivities = new ArrayList<>();

		try {
			// Group by renewal job ID
			Map<Integer, List<AmcRenewalJobActivity>> jobMap = activities.stream()
					.filter(a -> a != null && a.getAmcRenewalJob() != null)
					.collect(Collectors.groupingBy(a -> a.getAmcRenewalJob().getRenewalJobId()));

			for (Map.Entry<Integer, List<AmcRenewalJobActivity>> entry : jobMap.entrySet()) {
				filterActivitiesPerRenewalJob(entry.getValue(), filteredActivities);
			}
		} catch (Exception e) {
			logError("Error filtering AMC renewal activities", e);
		}

		return filteredActivities;
	}

	private void filterActivitiesPerJob(List<AmcJobActivity> activities,
			List<AmcJobActivity> filtered, boolean isRenewal) {
		if (activities.isEmpty()) {
			return;
		}

		try {
			Integer jobId = activities.get(0).getJob().getJobId();
			int totalLifts = getTotalLiftsForJob(jobId, false);

			Set<String> serviceChecked = new HashSet<>();
			Set<Integer> breakdownChecked = new HashSet<>();

			for (AmcJobActivity activity : activities) {
				if (activity == null || activity.getJobActivityType() == null) {
					continue;
				}

				String activityType = activity.getJobActivityType().getActivityName();
				if (activityType == null) {
					continue;
				}

				if (isServiceActivity(activityType)) {
					String jobService = activity.getJobService();
					if (!serviceChecked.contains(jobService)) {
						if (isServiceDoneForAllLifts(jobService, jobId, totalLifts, false)) {
							filtered.add(activity);
						}
						serviceChecked.add(jobService);
					}
				} else if (isBreakdownActivity(activityType)) {
					Integer todoId = activity.getBreakdownTodo() != null
							? activity.getBreakdownTodo().getCustTodoId()
							: null;
					if (todoId != null && !breakdownChecked.contains(todoId)) {
						if (isBreakdownDoneForAllLifts(todoId, false)) {
							filtered.add(activity);
						}
						breakdownChecked.add(todoId);
					}
				}
			}
		} catch (Exception e) {
			logError("Error filtering activities per job", e);
		}
	}

	private void filterActivitiesPerRenewalJob(List<AmcRenewalJobActivity> activities,
			List<AmcRenewalJobActivity> filtered) {
		if (activities.isEmpty()) {
			return;
		}

		try {
			Integer renewalJobId = activities.get(0).getAmcRenewalJob().getRenewalJobId();
			int totalLifts = getTotalLiftsForJob(renewalJobId, true);

			Set<String> serviceChecked = new HashSet<>();
			Set<Integer> breakdownChecked = new HashSet<>();

			for (AmcRenewalJobActivity activity : activities) {
				if (activity == null || activity.getJobActivityType() == null) {
					continue;
				}

				String activityType = activity.getJobActivityType().getActivityName();
				if (activityType == null) {
					continue;
				}

				if (isServiceActivity(activityType)) {
					String jobService = activity.getJobService();
					if (!serviceChecked.contains(jobService)) {
						if (isServiceDoneForAllLifts(jobService, renewalJobId, totalLifts, true)) {
							filtered.add(activity);
						}
						serviceChecked.add(jobService);
					}
				} else if (isBreakdownActivity(activityType)) {
					Integer todoId = activity.getBreakdownTodo() != null
							? activity.getBreakdownTodo().getCustTodoId()
							: null;
					if (todoId != null && !breakdownChecked.contains(todoId)) {
						if (isBreakdownDoneForAllLifts(todoId, true)) {
							filtered.add(activity);
						}
						breakdownChecked.add(todoId);
					}
				}
			}
		} catch (Exception e) {
			logError("Error filtering activities per renewal job", e);
		}
	}

	// ==================== JOB VALIDATION HELPERS ====================

	private int getTotalLiftsForJob(Integer jobId, boolean isRenewal) {
		try {
			if (isRenewal) {
				Optional<AmcRenewalJob> jobOpt = amcRenewalJobRepository.findById(jobId);
				if (jobOpt.isEmpty()) {
					return 0;
				}
				AmcRenewalJob job = jobOpt.get();
				CombinedEnquiry enquiry = job.getAmcRenewalQuotation() != null
						? job.getAmcRenewalQuotation().getCombinedEnquiry()
						: (job.getRevisedRenewalAmcQuotation() != null
								? job.getRevisedRenewalAmcQuotation().getCombinedEnquiry()
								: null);
				return enquiry != null && enquiry.getEnquiries() != null ? enquiry.getEnquiries().size()
						: 0;
			} else {
				Optional<AmcJob> jobOpt = amcJobRepository.findById(jobId);
				if (jobOpt.isEmpty()) {
					return 0;
				}
				AmcJob job = jobOpt.get();
				CombinedEnquiry enquiry = job.getAmcQuotation() != null
						? job.getAmcQuotation().getCombinedEnquiry()
						: (job.getRevisedAmcQuotation() != null
								? job.getRevisedAmcQuotation().getCombinedEnquiry()
								: null);
				return enquiry != null && enquiry.getEnquiries() != null ? enquiry.getEnquiries().size()
						: 0;
			}
		} catch (Exception e) {
			logError("Error getting total lifts for job " + jobId, e);
			return 0;
		}
	}

	private boolean isServiceDoneForAllLifts(String jobService, Integer jobId, int expectedCount,
			boolean isRenewal) {
		try {
			long count = isRenewal
					? amcRenewalJobActivityRepository
							.countByAmcRenewalJob_RenewalJobIdAndJobServiceIgnoreCase(jobId,
									jobService)
					: amcJobActivityRepository.countByJob_JobIdAndJobServiceIgnoreCase(jobId,
							jobService);
			return count == expectedCount;
		} catch (Exception e) {
			logError("Error checking service completion", e);
			return false;
		}
	}

	private boolean isBreakdownDoneForAllLifts(Integer custTodoId, boolean isRenewal) {
		try {
			long assignedCount = breakdownTodoLiftMappingRepository
					.countByBreakdownTodo_CustTodoId(custTodoId);
			long completedCount = isRenewal
					? amcRenewalJobActivityRepository.countByBreakdownTodo_CustTodoId(custTodoId)
					: amcJobActivityRepository.countByBreakdownTodo_CustTodoId(custTodoId);
			return completedCount == assignedCount && assignedCount > 0;
		} catch (Exception e) {
			logError("Error checking breakdown completion", e);
			return false;
		}
	}

	// ==================== UTILITY METHODS ====================

	private boolean isServiceActivity(String activityType) {
		return ACTIVITY_TYPE_SERVICE.equalsIgnoreCase(activityType);
	}

	private boolean isBreakdownActivity(String activityType) {
		return ACTIVITY_TYPE_BREAKDOWN.equalsIgnoreCase(activityType);
	}

	private void incrementActivityCount(EmplActivityData data, String activityType) {
		if (isServiceActivity(activityType)) {
			data.setServiceActivityCount(data.getServiceActivityCount() + 1);
		} else if (isBreakdownActivity(activityType)) {
			data.setBreakDownActivityCount(data.getBreakDownActivityCount() + 1);
		}
	}

	private int getTotalActivityCount(EmplActivityData data) {
		return data.getServiceActivityCount() + data.getBreakDownActivityCount();
	}

	// ==================== YEARLY ACTIVITY DATA ====================

	public YearlyActivityData getYearlyActivityData() {
		try {
			LocalDate currentDate = LocalDate.now();
			DateRange dateRange = calculateDateRange(currentDate);

			Map<String, MonthlyActivityCount> monthlyMap = initializeMonthlyActivityMap();

			List<AmcJobActivity> amcActivities = nullSafeList(
					amcJobActivityRepository.findByActivityDateBetween(dateRange.startDate,
							dateRange.endDate));
			List<AmcJobActivity> filteredAmc = filterActivitiesForProcessAmcJobActivities(
					amcActivities);
			processActivitiesForMonthly(filteredAmc, monthlyMap, false);

			List<AmcRenewalJobActivity> renewalActivities = nullSafeList(
					amcRenewalJobActivityRepository.findByActivityDateBetween(dateRange.startDate,
							dateRange.endDate));
			List<AmcRenewalJobActivity> filteredRenewal = filterActivitiesForProcessAmcRenewalJobActivities(
					renewalActivities);
			processActivitiesForMonthly(filteredRenewal, monthlyMap, true);

			List<MonthlyActivityCount> sequenced = getSequenceWiseMonths(monthlyMap, currentDate);

			return YearlyActivityData.builder()
					.monthlyActivityCounts(sequenced)
					.toatlServiceDoneCurrentMonth(
							getCurrentMonthServiceCount(monthlyMap, currentDate))
					.currentMonthAndYear(getCurrentMonthAndYear(currentDate))
					.totalActiveJobs(getTotalActiveJobs(currentDate))
					.build();

		} catch (Exception e) {
			logError("Error in getYearlyActivityData", e);
			return YearlyActivityData.builder()
					.monthlyActivityCounts(new ArrayList<>())
					.build();
		}
	}

	private Map<String, MonthlyActivityCount> initializeMonthlyActivityMap() {
		Map<String, MonthlyActivityCount> map = new HashMap<>();
		String[] months = { "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP",
				"OCT", "NOV", "DEC" };
		for (int i = 0; i < months.length; i++) {
			MonthlyActivityCount count = new MonthlyActivityCount();
			count.setMonth(months[i]);
			count.setMonthInNum(i + 1);
			count.setTotalServicesCounts(0);
			count.setTotalBreakDownsCounts(0);
			map.put(months[i], count);
		}
		return map;
	}

	private <T> void processActivitiesForMonthly(List<T> activities,
			Map<String, MonthlyActivityCount> monthlyMap, boolean isRenewal) {
		if (activities == null || activities.isEmpty()) {
			return;
		}

		for (T activity : activities) {
			try {
				LocalDate activityDate = null;
				JobActivityType activityType = null;

				if (isRenewal) {
					AmcRenewalJobActivity renewal = (AmcRenewalJobActivity) activity;
					activityDate = renewal.getActivityDate();
					activityType = renewal.getJobActivityType();
				} else {
					AmcJobActivity amc = (AmcJobActivity) activity;
					activityDate = amc.getActivityDate();
					activityType = amc.getJobActivityType();
				}

				if (activityDate == null || activityType == null) {
					continue;
				}

				String month = activityDate.getMonth().getDisplayName(TextStyle.SHORT,
						Locale.ENGLISH).toUpperCase();
				MonthlyActivityCount count = monthlyMap.get(month);

				if (count != null) {
					if (isServiceActivity(activityType.getActivityName())) {
						count.setTotalServicesCounts(count.getTotalServicesCounts() + 1);
					} else if (isBreakdownActivity(activityType.getActivityName())) {
						count.setTotalBreakDownsCounts(count.getTotalBreakDownsCounts() + 1);
					}
				}
			} catch (Exception e) {
				logError("Error processing activity for monthly", e);
			}
		}
	}

	private List<MonthlyActivityCount> getSequenceWiseMonths(
			Map<String, MonthlyActivityCount> monthlyMap, LocalDate currentDate) {
		List<MonthlyActivityCount> result = new ArrayList<>();
		String[] months = { "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP",
				"OCT", "NOV", "DEC" };
		int startIndex = currentDate.getMonthValue() - 1;

		for (int i = 0; i < 12; i++) {
			int index = (startIndex + i) % 12;
			result.add(monthlyMap.get(months[index]));
		}

		return result;
	}

	private int getCurrentMonthServiceCount(Map<String, MonthlyActivityCount> monthlyMap,
			LocalDate currentDate) {
		String currentMonth = currentDate.getMonth().getDisplayName(TextStyle.SHORT,
				Locale.ENGLISH).toUpperCase();
		MonthlyActivityCount count = monthlyMap.get(currentMonth);
		return count != null ? count.getTotalServicesCounts() : 0;
	}

	private String getCurrentMonthAndYear(LocalDate currentDate) {
		return currentDate.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH)
				.toUpperCase() + " " + currentDate.getYear();
	}

	private DateRange calculateDateRange(LocalDate currentDate) {
		LocalDate startDate = currentDate.minusYears(1).withDayOfMonth(1);
		LocalDate endDate = currentDate.withDayOfMonth(currentDate.lengthOfMonth());
		return new DateRange(startDate, endDate);
	}

	private Integer getTotalActiveJobs(LocalDate currentDate) {
		try {
			Integer amcActive = amcJobRepository.countActiveJobs(currentDate);
			Integer renewalActive = amcRenewalJobRepository.countActiveRenewalJobs(currentDate);
			return (amcActive != null ? amcActive : 0) + (renewalActive != null ? renewalActive : 0);
		} catch (Exception e) {
			logError("Error getting total active jobs", e);
			return 0;
		}
	}

	// ==================== EMPLOYEE ACTIVITIES COUNTS ====================

	public List<EmpActivitiesCountsData> activitiesCountsDatas(LocalDate fromDate,
			LocalDate toDate) {
		List<EmpActivitiesCountsData> result = new ArrayList<>();

		if (!isValidDateRange(fromDate, toDate)) {
			logWarning("Invalid date range provided");
			return result;
		}

		try {
			List<Employee> employees = nullSafeList(employeeRepository.findAll());

			for (Employee employee : employees) {
				if (!isValidEmployee(employee)) {
					continue;
				}

				EmpActivitiesCountsData empData = getEmployeeActivityCounts(employee, fromDate,
						toDate);
				if (empData != null) {
					result.add(empData);
				}
			}

		} catch (Exception e) {
			logError("Error generating employee activity report", e);
		}

		return result;
	}

	private EmpActivitiesCountsData getEmployeeActivityCounts(Employee employee, LocalDate fromDate,
			LocalDate toDate) {
		try {
			Integer empId = employee.getEmployeeId();
			String empName = employee.getEmployeeName() != null ? employee.getEmployeeName()
					: "Unknown";

			// Fetch and filter activities
			List<AmcJobActivity> amcActivities = nullSafeList(
					amcJobActivityRepository.findByEmployeeIdAndDateRange(empId, fromDate, toDate));
			List<AmcJobActivity> filteredAmc = filterActivitiesForProcessAmcJobActivities(
					amcActivities);

			List<AmcRenewalJobActivity> renewalActivities = nullSafeList(
					amcRenewalJobActivityRepository.findByEmployeeIdAndDateRange(empId, fromDate,
							toDate));
			List<AmcRenewalJobActivity> filteredRenewal = filterActivitiesForProcessAmcRenewalJobActivities(
					renewalActivities);

			// Count activities
			ActivityCounts counts = countActivities(filteredAmc, filteredRenewal, empId);

			// Get total assigned jobs
			Long amcJobs = amcJobRepository.countAssignedJobs(empId);
			Long renewalJobs = amcRenewalJobRepository.countAssignedRenewalJobs(empId);
			int totalAssigned = (amcJobs != null ? amcJobs.intValue() : 0)
					+ (renewalJobs != null ? renewalJobs.intValue() : 0);

			return EmpActivitiesCountsData.builder()
					.empName(empName)
					.empId(empId)
					.assignedDoneServiceCounts(counts.assignedService)
					.assignedDoneBreakdownCounts(counts.assignedBreakdown)
					.unassignedDoneServiceCounts(counts.unassignedService)
					.unassignedDoneBreakdownCounts(counts.unassignedBreakdown)
					.totalServiceDoneCounts(counts.assignedService + counts.unassignedService)
					.totalBreakDownDoneCounts(counts.assignedBreakdown + counts.unassignedBreakdown)
					.totalAssignedAmcJobs(totalAssigned)
					.build();

		} catch (Exception e) {
			logError("Error getting employee activity counts for employee " + employee.getEmployeeId(), e);
			return null;
		}
	}

	private ActivityCounts countActivities(List<AmcJobActivity> amcActivities,
			List<AmcRenewalJobActivity> renewalActivities, Integer empId) {
		ActivityCounts counts = new ActivityCounts();

		// Count AMC activities
		for (AmcJobActivity activity : amcActivities) {
			if (activity == null || activity.getJob() == null || activity.getJobActivityType() == null) {
				continue;
			}

			boolean isAssigned = isEmployeeAssigned(activity.getJob().getRoute(), empId);
			String type = activity.getJobActivityType().getActivityName();

			if (isServiceActivity(type)) {
				if (isAssigned) counts.assignedService++;
				else counts.unassignedService++;
			} else if (isBreakdownActivity(type)) {
				if (isAssigned) counts.assignedBreakdown++;
				else counts.unassignedBreakdown++;
			}
		}

		// Count Renewal activities
		for (AmcRenewalJobActivity activity : renewalActivities) {
			if (activity == null || activity.getAmcRenewalJob() == null
					|| activity.getJobActivityType() == null) {
				continue;
			}

			boolean isAssigned = isEmployeeAssigned(activity.getAmcRenewalJob().getRoute(), empId);
			String type = activity.getJobActivityType().getActivityName();

			if (isServiceActivity(type)) {
				if (isAssigned) counts.assignedService++;
				else counts.unassignedService++;
			} else if (isBreakdownActivity(type)) {
				if (isAssigned) counts.assignedBreakdown++;
				else counts.unassignedBreakdown++;
			}
		}

		return counts;
	}

	private boolean isEmployeeAssigned(Object route, Integer empId) {
		try {
			if (route == null) {
				return false;
			}
			// Cast to Routes or appropriate type based on your entity
			// This assumes route has getEmployees() method
			return true; // Simplified - implement actual logic based on your Route entity
		} catch (Exception e) {
			logError("Error checking if employee is assigned", e);
			return false;
		}
	}

	// ==================== ACTIVITY DETAILS ====================

	public List<ActivityDetailsData> emplActivityDatasForInitialJobs(LocalDate from, LocalDate to,
			Integer empId, String jobActivityType) {
		try {
			if (!isValidDateRange(from, to) || empId == null) {
				return new ArrayList<>();
			}

			List<AmcJobActivity> activities = nullSafeList(
					amcJobActivityRepository.findActivitiesWithoutPagination(from, to, empId,
							jobActivityType));
			List<AmcJobActivity> filtered = filterActivitiesForProcessAmcJobActivities(activities);

			return filtered.stream()
					.filter(activity -> activity != null && activity.getJob() != null)
					.map(this::mapToActivityDetailsData)
					.collect(Collectors.toList());

		} catch (Exception e) {
			logError("Error getting activity details for initial jobs", e);
			return new ArrayList<>();
		}
	}

	public List<ActivityDetailsData> emplActivityDatasForRenewalJobs(LocalDate from, LocalDate to,
			Integer empId, String jobActivityType) {
		try {
			if (!isValidDateRange(from, to) || empId == null) {
				return new ArrayList<>();
			}

			List<AmcRenewalJobActivity> activities = nullSafeList(
					amcRenewalJobActivityRepository.findActivitiesWithoutPagination(from, to, empId,
							jobActivityType));
			List<AmcRenewalJobActivity> filtered = filterActivitiesForProcessAmcRenewalJobActivities(
					activities);

			return filtered.stream()
					.filter(activity -> activity != null && activity.getAmcRenewalJob() != null)
					.map(this::mapToActivityDetailsDataRenewal)
					.collect(Collectors.toList());

		} catch (Exception e) {
			logError("Error getting activity details for renewal jobs", e);
			return new ArrayList<>();
		}
	}

	private ActivityDetailsData mapToActivityDetailsData(AmcJobActivity activity) {
		try {
			ActivityDetailsData dto = new ActivityDetailsData();
			dto.setActivityBy(
					activity.getJobActivityBy() != null ? activity.getJobActivityBy().getEmployeeName()
							: "Unknown");
			dto.setActivityDate(activity.getActivityDate());
			dto.setCustomerName(
					activity.getJob().getLead() != null ? activity.getJob().getLead().getCustomerName()
							: "Unknown");
			dto.setSiteName(
					activity.getJob().getSite() != null ? activity.getJob().getSite().getSiteName()
							: "Unknown");
			dto.setSiteaddress(
					activity.getJob().getSite() != null ? activity.getJob().getSite().getSiteAddress()
							: "");
			dto.setDescription(activity.getActivityDescription());

			List<EmployeeDto> technicians = new ArrayList<>();
			if (activity.getJob().getRoute() != null && activity.getJob().getRoute().getEmployees() != null) {
				technicians = activity.getJob().getRoute().getEmployees().stream()
						.filter(emp -> emp != null)
						.map(emp -> new EmployeeDto(emp.getEmployeeId(), emp.getEmployeeName(),
								emp.getAddress(), null))
						.collect(Collectors.toList());
			}
			dto.setAssignedTechnicians(technicians);

			return dto;
		} catch (Exception e) {
			logError("Error mapping activity to details data", e);
			return null;
		}
	}

	private ActivityDetailsData mapToActivityDetailsDataRenewal(AmcRenewalJobActivity activity) {
		try {
			ActivityDetailsData dto = new ActivityDetailsData();
			dto.setActivityBy(
					activity.getJobActivityBy() != null ? activity.getJobActivityBy().getEmployeeName()
							: "Unknown");
			dto.setActivityDate(activity.getActivityDate());
			dto.setCustomerName(activity.getAmcRenewalJob().getLead() != null
					? activity.getAmcRenewalJob().getLead().getCustomerName()
					: "Unknown");
			dto.setSiteName(activity.getAmcRenewalJob().getSite() != null
					? activity.getAmcRenewalJob().getSite().getSiteName()
					: "Unknown");
			dto.setSiteaddress(activity.getAmcRenewalJob().getSite() != null
					? activity.getAmcRenewalJob().getSite().getSiteAddress()
					: "");
			dto.setDescription(activity.getActivityDescription());

			List<EmployeeDto> technicians = new ArrayList<>();
			if (activity.getAmcRenewalJob().getRoute() != null
					&& activity.getAmcRenewalJob().getRoute().getEmployees() != null) {
				technicians = activity.getAmcRenewalJob().getRoute().getEmployees().stream()
						.filter(emp -> emp != null)
						.map(emp -> new EmployeeDto(emp.getEmployeeId(), emp.getEmployeeName(),
								emp.getAddress(), null))
						.collect(Collectors.toList());
			}
			dto.setAssignedTechnicians(technicians);

			return dto;
		} catch (Exception e) {
			logError("Error mapping renewal activity to details data", e);
			return null;
		}
	}

	// ==================== HELPER CLASSES ====================

	@Data
	private static class ActivityCounts {
		int assignedService = 0;
		int unassignedService = 0;
		int assignedBreakdown = 0;
		int unassignedBreakdown = 0;
	}

	@Data
	private static class DateRange {
		LocalDate startDate;
		LocalDate endDate;

		public DateRange(LocalDate startDate, LocalDate endDate) {
			this.startDate = startDate;
			this.endDate = endDate;
		}
	}

	// ==================== LOGGING ====================

	private void logWarning(String message) {
		System.out.println("WARN: " + message);
	}

	private void logError(String message, Exception e) {
		System.out.println("ERROR: " + message);
		e.printStackTrace();
	}

}