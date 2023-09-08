package com.example.Final_Project;

import com.example.Final_Project.Repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class RepositoryTest {

    @Autowired
    private ArticleRepository articleRepository;
}
