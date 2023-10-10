package com.example.Final_Project.Repository;

import com.example.Final_Project.Entity.SavePaper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface SaveRepository extends JpaRepository<SavePaper, String> {
    boolean existsByArticleIdAndUserEmail(String articleId, String userEmail);
}

