//package com.example.Final_Project.Controller;
//
//import com.example.Final_Project.Entity.Article;
//import com.example.Final_Project.Repository.ArticleRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/search") // API 엔드포인트 경로 설정
//public class ArticleController {
//
//    // ArticleRepository 인터페이스를 주입받아 데이터베이스와 상호작용할 수 있도록 선언
//    @Autowired
//    private ArticleRepository articleRepository;
//
//    // "/search" 엔드포인트는 키워드 검색을 수행하기 위한 GET 요청을 처리
//    @CrossOrigin(origins = "http://localhost:3000") // CORS 설정
//    @GetMapping("/")
//    public List<Article> searchByKeyword(@RequestParam(name = "searchKeyword") String searchKeyword) {
//
//        // "findByKeyword" 메서드를 사용하여 검색 키워드와 일치하는 데이터를 데이터베이스에서 조회하고 반환
//        return articleRepository.findByKeyword(searchKeyword);
//    }
//    // article_id를 기준으로 논문을 조회하는 엔드포인트 추가
//    @CrossOrigin(origins = "http://localhost:3000")
//    @GetMapping("/{articleId}")
//    public Article getArticleById(@PathVariable String articleId) {
//        return articleRepository.findById(articleId).orElse(null);
//    }
//}
