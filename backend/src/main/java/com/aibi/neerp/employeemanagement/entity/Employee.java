package com.aibi.neerp.employeemanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.aibi.neerp.rolebackmanagement.entity.Role;

@Entity
@Table(name = "tbl_employee")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_id")
    private Integer employeeId;

    // Uncomment if you add nerpClients later
    // @ManyToOne
    // @JoinColumn(name = "client_id", nullable = false)
    // private NerpClient client;

    @Column(name = "employee_name", nullable = false, length = 255)
    private String employeeName;

    @Column(name = "contact_number", nullable = false, length = 255)
    private String contactNumber;

    @Column(name = "email_id", nullable = false, length = 255)
    private String emailId;

    @Column(name = "address", nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column(name = "dob", nullable = false)
    private LocalDate dob;

    @Column(name = "joining_date", nullable = false)
    private LocalDate joiningDate;

    @ManyToOne
    @JoinColumn(name = "role_id", referencedColumnName = "role_id")
    private Role role;

    @Column(name = "username", nullable = false, length = 255)
    private String username;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "emp_photo", nullable = false, length = 255)
    private String empPhoto;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @Column(name = "employee_code", nullable = false, length = 255)
    private String employeeCode;

    @Column(name = "employee_sign", length = 255)
    private String employeeSign;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}

