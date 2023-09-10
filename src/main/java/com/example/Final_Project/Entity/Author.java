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

    // 저자 이름
    private String name;

    // 저자 소속
    private String institution;

    // AuthorArticleList 연결 관련
    @OneToOne(mappedBy = "author", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private AuthorArticleList authorArticleList;
}
