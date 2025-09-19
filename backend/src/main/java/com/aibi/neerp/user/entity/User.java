package com.aibi.neerp.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false) // You can also make it unique if needed
    private String username;

    // A flag to indicate if user is logged in (true = logged in)
    @Column(name = "login_flag")
    private boolean loginFlag = false;

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", username='" + username + '\'' +
                ", loginFlag=" + loginFlag +
                '}';
    }
}
