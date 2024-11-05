package com.example.CT295_IoT.Controller;



import com.example.CT295_IoT.Entity.User;
import com.example.CT295_IoT.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User loginUser) {
        // Check if the user exists by username
        User user = userService.getUserByUsername(loginUser.getUsername());

        if (user == null) {
            return ResponseEntity.status(401).body("Invalid username");
        }

        // Check if the password matches (In real-world use case, passwords should be hashed and verified)
        if (user.getPassword().equals(loginUser.getPassword())) {
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(401).body("Invalid password");
        }
    }

    // Additional endpoints (Create, Get, etc.)
    // Create a new user
    @PostMapping("/create")
    public ResponseEntity<String> createUser(@RequestBody User user) {
        userService.saveUser(user);
        return ResponseEntity.ok("User created successfully");
    }



    // Get a user by username
    @GetMapping("/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}

