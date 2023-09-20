package com.example.Final_Project.Repository;

import com.example.Final_Project.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    // 중복id 체크
    Optional<User> findByEmail(String email);

}