package com.example.Final_Project.Entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Article {

    @Id
    @Column(nullable = false, unique = true)
    // 논문 Id
    private String articleId;

    @Lob
    // 한글 제목
    private String title_ko;

    @Lob
    // 영문 제목
    private String title_en;

    // 저자명
    private String author_name;

    // 저자 id
    private String author_id;

    // 저자 소속
    private String institution;

    // 학술지(저널) 이름
    private String journal_name;

    // 논문 발행 기관
    private String publisher;

    // 발행 연도
    private Integer pub_year;

    // 연구 분야
    private String major;

    // 키워드 리스트
    @Column(name = "keyword")
    private String keyword;

    // 한글 초록
    @Lob
    private String abstract_ko;

    // 영문 초록
    @Lob
    private String abstract_en;

    // 피인용 횟수
    private Integer citation_count;
}
