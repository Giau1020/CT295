package com.example.CT295_IoT.Service;

import com.example.CT295_IoT.Entity.User;
import com.example.CT295_IoT.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    public User getUserByUsername(String username) {
        return userRepository.findById(username).orElse(null);
    }
    public void saveUser(User user) {
        userRepository.save(user);
    }
}
