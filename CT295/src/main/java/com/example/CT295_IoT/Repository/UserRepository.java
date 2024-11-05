package com.example.CT295_IoT.Repository;

import com.example.CT295_IoT.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {



}
