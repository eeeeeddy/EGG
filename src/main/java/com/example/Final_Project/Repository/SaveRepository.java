package com.example.Final_Project.Repository;

import com.example.Final_Project.Entity.SavePaper;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaveRepository extends JpaRepository<SavePaper, String> {
}

