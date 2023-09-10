package com.example.Final_Project.Entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class AuthorArticleList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "author_id", referencedColumnName = "author_id")
    // 저자 아이디
    private Author author;

    @Lob
    // 논문 한글 제목
    private String article_title_ko;

    @Lob
    // 논문 영문 제목
    private String article_title_en;
}
