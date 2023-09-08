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

    @Id
    @Column(nullable = false, unique = true)
    // 저자 아이디
    private String author_id;

    // 논문 제목
    private String article_title;

    // 저자 이름
    private String name;

    // 저자 소속
    private String institution;
}
