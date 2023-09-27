package com.example.Final_Project.Repository;

import com.example.Final_Project.Entity.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorRepository extends JpaRepository<Author, String> {

    Author findByAuthorId(@Param("authorId") String authorId);
}
