package com.aibi.neerp.amc.jobs.initial.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

import com.aibi.neerp.amc.common.entity.JobActivityType;
import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.leadmanagement.entity.Enquiry;

@Entity
@Table(name = "tbl_amc_job_activity")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmcJobActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_activity_id")
    private Integer jobActivityId;

    // job_id -> fk to tbl_amc_job
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = true)
    private AmcJob job;

    // job_activity_type -> fk to tbl_job_activity_type
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_activity_type", nullable = true)
    private JobActivityType jobActivityType;

    @Column(name = "activity_date", nullable = true)
    private LocalDate activityDate;

    @Column(name = "activity_time")
    private String activityTime;

    @Column(name = "activity_description", columnDefinition = "TEXT", nullable = true)
    private String activityDescription;

    @Column(name = "job_service", nullable = true)
    private String jobService;

    @Column(name = "job_type_work", nullable = true)
    private String jobTypeWork;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "executive", nullable = true)
    private Employee executive;

    // job_activity_by -> fk to tbl_employee
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_activity_by", nullable = true)
    private Employee jobActivityBy;

    // job_activity_by2 -> kept as String (can convert to FK if required)
    @Column(name = "job_activity_by2")
    private String jobActivityBy2;

    @Column(name = "mail_sent")
    private Boolean mailSent;

    @Column(name = "remark", columnDefinition = "TEXT", nullable = true)
    private String remark;

    @Column(name = "signature_name", nullable = true)
    private String signatureName;

    @Lob
    @Column(name = "signature_value", nullable = true)
    private byte[] signatureValue;

    @Column(name = "customer_feedback", nullable = true)
    private String customerFeedback;

    @Column(name = "in_time", nullable = true, length = 20)
    private String inTime;

    @Column(name = "out_time", nullable = true, length = 20)
    private String outTime;

    @Column(name = "act_service", nullable = true)
    private String actService;

    // lift_id -> fk to Lift table
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn( name="lift_id", referencedColumnName  = "enquiry_id")
    private Enquiry lift;

    // ✅ New column -> breakdown_todo_id (FK to tbl_breakdown_todo)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cust_todo_id")
    private BreakdownTodo breakdownTodo;
}

