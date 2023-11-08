package com.example.Final_Project.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import javax.persistence.*;
import java.util.Optional;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EntityScan
@EnableJpaRepositories
public class SavePaper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idx;

    @Column(nullable = false, unique = true)
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

    // 한글 초록
    @Lob
    private String abstract_ko;

    // 영문 초록
    @Lob
    private String abstract_en;

    // 카테고리
    private String category;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "userEmail", referencedColumnName = "email")
    private Users user; //user:savepaper = 1:n
    public void setUser(Users user) {
        this.user = user;
    }

}