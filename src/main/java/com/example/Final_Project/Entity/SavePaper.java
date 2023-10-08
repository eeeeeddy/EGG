package com.example.Final_Project.Entity;

import co.elastic.clients.elasticsearch.xpack.usage.Base;
import lombok.*;
import org.hibernate.annotations.Cascade;

import javax.persistence.*;
import javax.validation.constraints.Email;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SavePaper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idx;

    @Column(nullable = false)
            //(nullable = false, unique = true)
    // 논문 Id
    private String article_id;

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
    // 한글 초록
    @Lob
    private String abstract_ko;

    // 영문 초록
    @Lob
    private String abstract_en;

    private String userEmail;

    // Getter 및 Setter 추가
    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

}