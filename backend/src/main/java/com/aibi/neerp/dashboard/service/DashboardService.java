package com.aibi.neerp.dashboard.service;

import com.aibi.neerp.quotation.repository.QuotationMainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.aibi.neerp.amc.jobs.initial.entity.AmcJob;
import com.aibi.neerp.amc.jobs.initial.repository.AmcJobRepository;
import com.aibi.neerp.amc.jobs.renewal.entity.AmcRenewalJob;
import com.aibi.neerp.amc.jobs.renewal.repository.AmcRenewalJobRepository;
import com.aibi.neerp.amc.quatation.initial.entity.AmcQuotation;
import com.aibi.neerp.amc.quatation.initial.repository.AmcQuotationRepository;
import com.aibi.neerp.customer.repository.CustomerRepository;
import com.aibi.neerp.dashboard.dto.DashboardAmcRenewalsListData;
import com.aibi.neerp.dashboard.dto.DashboardCountsData;
import com.aibi.neerp.dashboard.dto.DashboardTodoDto;
import com.aibi.neerp.dashboard.dto.MissedActivityDto;
import com.aibi.neerp.leadmanagement.entity.LeadTodo;
import com.aibi.neerp.leadmanagement.entity.NewLeads;
import com.aibi.neerp.leadmanagement.repository.LeadTodoRepository;
import com.aibi.neerp.leadmanagement.repository.NewLeadsRepository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collector;

import org.springframework.data.domain.Pageable;


@Service
public class DashboardService {


    @Autowired
    LeadTodoRepository leadTodoRepository;

    @Autowired
    NewLeadsRepository newLeadsRepository;

    @Autowired
    AmcQuotationRepository amcQuotationRepository;

    @Autowired
    AmcJobRepository amcJobRepository;

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    AmcRenewalJobRepository amcRenewalJobRepository;

    @Autowired
    QuotationMainRepository quotationMainRepository;


    public Page<DashboardTodoDto> getDashboardTodoList(String search, int page, int size) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        return leadTodoRepository.searchTodos(search, PageRequest.of(page, size))
                .map(todo -> new DashboardTodoDto(
                        todo.getLead().getLeadId(),
                        todo.getTodoId(),

                        todo.getPurpose() + " For " + todo.getLead().getCustomerName() + " at " + todo.getVenue(),
                        todo.getTodoDate().format(dateFormatter) + " at " + todo.getTime()

                ));
    }

    public Page<DashboardTodoDto> getMissedTodoListWithoutActivity(String search, int page, int size) {
        return leadTodoRepository.searchMissedTodosWithoutActivity(search, PageRequest.of(page, size))
                .map(this::convertToDto);
    }

    private DashboardTodoDto convertToDto(LeadTodo todo) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

        String todoName = todo.getPurpose() + " For " + todo.getLead().getCustomerName() + " at " + todo.getVenue();
        String dateAndTime = todo.getTodoDate().format(dateFormatter) + " at " + todo.getTime();

        Integer leadId = todo.getLead().getLeadId();
        Integer todoId = todo.getTodoId();

        return new DashboardTodoDto(leadId, todoId, todoName, dateAndTime);
    }


    public DashboardCountsData getDashboardCountsData() {

        DashboardCountsData dashboardCountsData = new DashboardCountsData();

        // Count active leads
        Integer totalActiveLeadCounts = newLeadsRepository.countByLeadStatus_StatusName("Active");

        // Count closed leads
        Integer closedLeadsCounts = newLeadsRepository.countByLeadStatus_StatusName("Closed");

        // Count AMC quotations
        // Integer totalAmcQuatationCounts = amcQuotationRepository.countAll();

        Integer totalAmcQuatationCounts = (int) amcQuotationRepository.count();
        Integer totalCustomerCounts = (int) customerRepository.count();

//
//		    // Count customers
//		    Integer totalCustomerCounts = customerRepository.countAll();

        // Count AMC jobs for renewal
        LocalDate currentDate = LocalDate.now();
        Integer totalAmcForRenewalsCounts = amcJobRepository.countAmcRenewalsDueWithin30Days(0, currentDate);

        Long renewalJobsRenewalCounts = amcRenewalJobRepository.countAmcLatestRenewals(currentDate);
        totalAmcForRenewalsCounts = totalAmcForRenewalsCounts + renewalJobsRenewalCounts.intValue();

        Long totalNewInstallationCount = quotationMainRepository.countAllActiveQuotations();


        // Set values in DTO
        dashboardCountsData.setTotalActiveLeadCounts(totalActiveLeadCounts);
        dashboardCountsData.setClosedLeadsCounts(closedLeadsCounts);
        dashboardCountsData.setTotalAmcQuatationCounts(totalAmcQuatationCounts);
        dashboardCountsData.setTotalCustomerCounts(totalCustomerCounts);
        dashboardCountsData.setTotalAmcForRenewalsCounts(totalAmcForRenewalsCounts);
        dashboardCountsData.setTotalNewInstallationQuatationCounts(Math.toIntExact(totalNewInstallationCount));


        return dashboardCountsData;
    }

    public Page<DashboardAmcRenewalsListData> getAmcRenewals(
            String search, int page, int size, String sortBy, String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        LocalDate currentDate = LocalDate.now();

        System.out.println("current date is ");
        System.out.println(currentDate.toString());

        Page<AmcJob> amcJobs = amcJobRepository.searchAmcRenewals(0, currentDate,
                (search == null ? "" : search), pageable);


        return amcJobs.map(amcJob -> {
            DashboardAmcRenewalsListData dto = new DashboardAmcRenewalsListData();
            dto.setAmcJobId(amcJob.getJobId());
            dto.setAmount(amcJob.getJobAmount());
            dto.setAmcPeriod(amcJob.getStartDate() + " to " + amcJob.getEndDate());
            dto.setCustomerName(amcJob.getCustomer().getCustomerName());
            dto.setCustomerSiteName(amcJob.getSite().getSiteName());
            long diff = java.time.temporal.ChronoUnit.DAYS.between(currentDate, amcJob.getEndDate());
            dto.setRemainingDays((int) diff);

            if (amcJob.getAmcQuotation() != null) {

                dto.setQuatationid(amcJob.getAmcQuotation().getAmcQuatationId());

            } else {
                dto.setReviseQuatationId(amcJob.getRevisedAmcQuotation().getRevisedQuatationId());

            }


            return dto;
        });
    }

    public Page<DashboardAmcRenewalsListData> getAmcRenewalsRenewals(
            String search, int page, int size, String sortBy, String direction) {

        // Sorting
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        LocalDate currentDate = LocalDate.now();

        // Call repository method
        // Call repository method using first version logic
        Page<AmcRenewalJob> renewalJobs = amcRenewalJobRepository.searchAmcLatestRenewals(
                currentDate,
                (search == null ? "" : search),  // treat null as empty string
                pageable
        );


        // Map entity to DTO
        return renewalJobs.map(job -> {
            DashboardAmcRenewalsListData dto = new DashboardAmcRenewalsListData();
            dto.setAmcJobId(job.getPreJobId().getJobId());

            dto.setRenewalJobId(job.getRenewalJobId());
            dto.setAmount(job.getJobAmount());
            dto.setAmcPeriod(job.getPreJobId().getStartDate() + " to " + job.getPreJobId().getEndDate());
            dto.setCustomerName(job.getCustomer().getCustomerName());
            dto.setCustomerSiteName(job.getSite().getSiteName());

            long remainingDays = ChronoUnit.DAYS.between(currentDate, job.getPreJobId().getEndDate());
            dto.setRemainingDays((int) remainingDays);

            if (job.getAmcRenewalQuotation() != null) {
                dto.setQuatationid(job.getAmcRenewalQuotation().getRenewalQuaId());
            } else if (job.getRevisedRenewalAmcQuotation() != null) {
                dto.setReviseQuatationId(job.getRevisedRenewalAmcQuotation().getRevisedRenewalId());

            }

            return dto;
        });
    }


}


