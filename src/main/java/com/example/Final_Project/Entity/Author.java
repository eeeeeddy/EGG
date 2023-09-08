package com.example.Final_Project.Entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Author {
    // 깃 디벨롭 테스트
    @Id
    @Column(nullable = false, unique = true)
    // 저자 아이디
    private String author_id;

    @Lob
    // 논문 한글 제목
    private String article_title_ko;

    @Lob
    // 논문 영문 제목
    private String article_title_en;

    // 저자 이름
    private String name;

    // 저자 소속
    private String institution;
}
