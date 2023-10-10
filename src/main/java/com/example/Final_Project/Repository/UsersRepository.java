package com.example.Final_Project.Repository;

import com.example.Final_Project.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<Users,String> {
    // 중복id 체크
    Optional<Users> findByEmail(String email);
    boolean existsByEmail(String email);

}