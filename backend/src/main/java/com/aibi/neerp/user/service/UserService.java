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
        //JdbcTemplate jdbcTemplate = new JdbcTemplate(dsManager.getCurrentDataSource());
        System.out.println("------------manually connection----------->");
        try {
            String dbName = jdbcTemplate.queryForObject("SELECT current_database()", String.class);
            System.out.println("✅ Connected to database: " + dbName);

            Employee employee = jdbcTemplate.queryForObject(
                    "SELECT * FROM tbl_employee WHERE email_id = ? AND password = ?",
                    (rs, rowNum) -> {
                        Employee e = new Employee();
                        e.setEmployeeId(rs.getInt("employee_id"));
                        e.setEmployeeName(rs.getString("employee_name"));
                        e.setContactNumber(rs.getString("contact_number"));
                        e.setEmailId(rs.getString("email_id"));
                        e.setAddress(rs.getString("address"));
                        e.setDob(rs.getDate("dob").toLocalDate());
                        e.setJoiningDate(rs.getDate("joining_date").toLocalDate());
                        e.setUsername(rs.getString("username"));
                        e.setPassword(rs.getString("password"));
                        e.setEmpPhoto(rs.getString("emp_photo"));
                        e.setActive(rs.getBoolean("active"));
                        e.setEmployeeCode(rs.getString("employee_code"));
                        e.setEmployeeSign(rs.getString("employee_sign"));
                        e.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
                        return e;
                    },
                    email, password
            );

            return Optional.ofNullable(employee);
        } catch (Exception e) {
            System.err.println("❌ Error during validateEmployee: " + e.getMessage());
            return Optional.empty();
        }

//        try {
//            String dbName = jdbcTemplate.queryForObject("SELECT current_database()", String.class);
//            System.out.println("✅ Connected to database: " + dbName);
//
//            User user = jdbcTemplate.queryForObject(
//                    "SELECT * FROM users WHERE email = ? AND password = ?",
//                    (rs, rowNum) -> {
//                        User u = new User();
//                        u.setId(rs.getLong("id"));
//                        u.setEmail(rs.getString("email"));
//                        u.setUsername(rs.getString("username"));
//                        u.setLoginFlag(rs.getBoolean("login_flag"));
//                        return u;
//                    },
//                    email, password // ✅ varargs instead of Object[]
//            );
//
//            return Optional.ofNullable(user);
//        } catch (Exception e) {
//            System.err.println("❌ Error during validateUser: " + e.getMessage());
//
//            return Optional.empty();
//        }
    }

    // Removed updateLoginFlag; employee login does not update users table


}
