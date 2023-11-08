package com.example.Final_Project.Repository;

import com.example.Final_Project.Entity.SavePaper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SaveRepository extends JpaRepository<SavePaper, Long> {
    boolean existsByArticleIdAndUserEmail(String articleId, String userEmail);

    List<SavePaper> findByUserEmail(String  userEmail);

    void deleteByArticleIdAndUserEmail(String articleId, String userEmail);
}
