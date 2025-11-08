package com.aibi.neerp.user.service;

import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.user.entity.User;
import com.aibi.neerp.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import javax.sql.DataSource;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final JdbcTemplate jdbcTemplate;

    // Constructor injection (recommended)
    public UserService(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setEmail(updatedUser.getEmail());
            user.setPassword(updatedUser.getPassword());
            user.setLoginFlag(updatedUser.isLoginFlag());
            return userRepository.save(user);
        });
    }

    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

//    public Optional<User> validateUser(String email, String password) {
//        return userRepository.findByEmail(email)
//                .filter(user -> user.getPassword().equals(password));
//    }

    public Optional<User> validateUser1(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }


    public Optional<Employee> validateUser(String email, String password) {
        System.out.println("[UserService] ===== Starting user validation =====");
        System.out.println("[UserService] Email: " + email);
        System.out.println("[UserService] Password: " + (password != null ? "***" : "null"));
        
        try {
            // Check database connection
            String dbName = jdbcTemplate.queryForObject("SELECT current_database()", String.class);
            System.out.println("[UserService] ✅ Connected to database: " + dbName);
            
            // Check if employee table exists
            try {
                Integer tableExists = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tbl_employee'",
                    Integer.class
                );
                System.out.println("[UserService] Employee table exists: " + (tableExists != null && tableExists > 0));
            } catch (Exception e) {
                System.err.println("[UserService] ⚠️ Could not check if employee table exists: " + e.getMessage());
            }
            
            // Try to find employee - use query instead of queryForObject to handle no results
            List<Employee> employees = jdbcTemplate.query(
                    "SELECT * FROM tbl_employee WHERE email_id = ? AND password = ? AND active = true",
                    (rs, rowNum) -> {
                        Employee e = new Employee();
                        e.setEmployeeId(rs.getInt("employee_id"));
                        e.setEmployeeName(rs.getString("employee_name"));
                        e.setContactNumber(rs.getString("contact_number"));
                        e.setEmailId(rs.getString("email_id"));
                        e.setAddress(rs.getString("address"));
                        if (rs.getDate("dob") != null) {
                            e.setDob(rs.getDate("dob").toLocalDate());
                        }
                        if (rs.getDate("joining_date") != null) {
                            e.setJoiningDate(rs.getDate("joining_date").toLocalDate());
                        }
                        e.setUsername(rs.getString("username"));
                        e.setPassword(rs.getString("password"));
                        e.setEmpPhoto(rs.getString("emp_photo"));
                        e.setActive(rs.getBoolean("active"));
                        e.setEmployeeCode(rs.getString("employee_code"));
                        e.setEmployeeSign(rs.getString("employee_sign"));
                        if (rs.getTimestamp("created_at") != null) {
                            e.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
                        }
                        return e;
                    },
                    email, password
            );

            if (employees.isEmpty()) {
                System.out.println("[UserService] ❌ No employee found with email: " + email + " and provided password");
                // Check if email exists at all
                Integer emailCount = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM tbl_employee WHERE email_id = ?",
                    Integer.class,
                    email
                );
                System.out.println("[UserService] Employees with this email: " + emailCount);
                return Optional.empty();
            }
            
            Employee employee = employees.get(0);
            System.out.println("[UserService] ✅ Employee found: " + employee.getUsername() + " (ID: " + employee.getEmployeeId() + ")");
            return Optional.of(employee);
            
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            System.err.println("[UserService] ❌ No employee found (EmptyResultDataAccessException): " + e.getMessage());
            return Optional.empty();
        } catch (Exception e) {
            System.err.println("[UserService] ❌ Error during validateEmployee: " + e.getMessage());
            System.err.println("[UserService] Error class: " + e.getClass().getName());
            e.printStackTrace();
            return Optional.empty();
        }
    }

    // Removed updateLoginFlag; employee login does not update users table

}
