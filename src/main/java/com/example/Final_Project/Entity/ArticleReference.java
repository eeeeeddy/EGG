package com.example.Final_Project.Entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class ArticleReference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "article_id", referencedColumnName = "article_id")
    // Origin 논문 아이디
    private Article article;

    @Lob
    // 참고 논문 한글 제목
    private String reference_title_ko;

    @Lob
    // 참고 논문 영문 제목
    private String reference_title_en;
}
