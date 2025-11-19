package com.aibi.neerp.user.service;

import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.employeemanagement.repository.EmployeeRepository;
import com.aibi.neerp.user.entity.User;
import com.aibi.neerp.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       EmployeeRepository employeeRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
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

    public Optional<User> validateUser1(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }

    public Optional<Employee> validateUser(String email, String password) {
        System.out.println("[UserService] ===== Starting user validation =====");
        System.out.println("[UserService] Email: " + email);
        System.out.println(password+"[UserService] Password: " + (password != null ? "***" : "null"));

        if (email == null || email.isBlank()) {
            System.out.println("[UserService] ❌ Email cannot be blank");
            return Optional.empty();
        }
        if (password == null || password.isBlank()) {
            System.out.println("[UserService] ❌ Password cannot be blank");
            return Optional.empty();
        }

        try {
            Optional<Employee> employeeOpt = employeeRepository.findByEmailIdAndActiveTrue(email);

            if (employeeOpt.isEmpty()) {
                System.out.println("[UserService] ❌ No active employee found with email: " + email);
                return Optional.empty();
            }

            Employee employee = employeeOpt.get();
            String storedPassword = employee.getPassword();

            if (passwordMatches(password, storedPassword)) {
                System.out.println("[UserService] ✅ Employee authenticated: " + employee.getUsername() + " (ID: " + employee.getEmployeeId() + ")");

                // Upgrade legacy plain-text passwords on the fly
                if (storedPassword != null && storedPassword.equals(password)) {
                    try {
                        employee.setPassword(passwordEncoder.encode(password));
                        employeeRepository.save(employee);
                        System.out.println("[UserService] 🔐 Legacy password upgraded to BCrypt for employee ID: " + employee.getEmployeeId());
                    } catch (Exception e) {
                        System.err.println("[UserService] ⚠️ Failed to upgrade legacy password: " + e.getMessage());
                    }
                }

                return Optional.of(employee);
            }

            System.out.println("[UserService] ❌ Password mismatch for email: " + email);
            return Optional.empty();

        } catch (Exception e) {
            System.err.println("[UserService] ❌ Error during validateUser: " + e.getMessage());
            System.err.println("[UserService] Error class: " + e.getClass().getName());
            e.printStackTrace();
            return Optional.empty();
        }
    }

    private boolean passwordMatches(String rawPassword, String storedPassword) {
        if (storedPassword == null || storedPassword.isBlank()) {
            return false;
        }
        if (passwordEncoder.matches(rawPassword, storedPassword)) {
            return true;
        }
        return storedPassword.equals(rawPassword);
    }
}
