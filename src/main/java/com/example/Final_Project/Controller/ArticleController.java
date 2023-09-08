package com.example.Final_Project.Controller;

import com.example.Final_Project.Entity.Article;
import com.example.Final_Project.Repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/")
public class ArticleController {

    // ArticleRepository 인터페이스를 주입받아 데이터베이스와 상호작용할 수 있도록 합니다.
    @Autowired
    private ArticleRepository articleRepository;

    // "/search" 엔드포인트는 키워드 검색을 수행하기 위한 GET 요청을 처리
    @GetMapping("/")
    public List<Article> searchByKeyword(@RequestParam(name = "search") String search) {

        // "findByKeyword" 메서드를 사용하여 검색 키워드와 일치하는 데이터를 데이터베이스에서 조회하고 반환
        return articleRepository.findByKeyword(search);
    }
}
