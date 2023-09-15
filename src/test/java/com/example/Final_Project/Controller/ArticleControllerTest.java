package com.example.Final_Project.Controller;

import static org.junit.jupiter.api.Assertions.*;

import com.example.Final_Project.Entity.Article;
import com.example.Final_Project.Repository.ArticleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Arrays;
import java.util.List;

@WebMvcTest(ArticleController.class)
public class ArticleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ArticleRepository articleRepository;

    @BeforeEach
    public void setUp() {
        // ArticleRepository의 findByKeyword 메서드에 대한 목(mock) 설정
        Article article = Article.builder()
                .title_en("Title 1")
                .build();
        Mockito.when(articleRepository.findByKeyword("your_keyword"))
                .thenReturn(Arrays.asList(article));
    }

    @Test
    public void testSearchByKeyword() throws Exception {
        // "/search" 엔드포인트에 GET 요청을 보내고 검색 결과를 확인하는 테스트
        mockMvc.perform(MockMvcRequestBuilders.get("/").param("search", "your_keyword"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(1))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].title_en").value("Title 1"));
    }
}
