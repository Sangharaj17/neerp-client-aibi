package com.aibi.neerp.user.controller;

import com.aibi.neerp.employeemanagement.entity.Employee;
import com.aibi.neerp.login.dto.LoginRequest;
import com.aibi.neerp.user.entity.User;
import com.aibi.neerp.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users") // base path
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        boolean deleted = userService.deleteUser(id);
        if (deleted) return ResponseEntity.noContent().build();
        else return ResponseEntity.notFound().build();
    }

//    @GetMapping("/email")
//    public ResponseEntity<User> getUserByEmail(@RequestParam String email) {
//        return userService.getUserByEmail(email)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }


//    @PostMapping("/email")
//    public ResponseEntity<User> getUserByEmail(@RequestBody Map<String, String> request) {
//        String email = request.get("email");
//        return userService.getUserByEmail(email)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping("/validate")
    public ResponseEntity<?> validateUser(@RequestBody LoginRequest loginRequest) {
        Optional<Employee> userOpt = userService.validateUser(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        if (userOpt.isPresent()) {
            Employee user = userOpt.get();
            Map<String, String> response = new HashMap<>();
            response.put("email", user.getEmailId());
            response.put("name", user.getUsername()); // make sure you have `getName()` in your entity
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }


}
