package com.example.Final_Project.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @Column(name="author_id", nullable = false, unique = true)
    // 저자 아이디
    private String authorId;

    // 저자 이름
    private String name;

    // 저자 소속
    private String institution;

//    // 작성 논문 테이블 (AuthorArticleList 연결 관련)
//    @OneToOne(mappedBy = "author", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//    @JsonIgnore // 순환 참조 방지
//    private AuthorArticleList authorArticleList;
}
