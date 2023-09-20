package com.example.Final_Project.Entity;

import com.example.Final_Project.Dto.UserRequest;
import com.example.Final_Project.Enum.UserRole;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private  String userName;

//    @Column(unique = true)
//    private String email;

    private String gender;

    private String birth;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_Role")
    private UserRole userRole;

    // 개별적인 사용자 정보를 직접 받아와서 user엔터티 객체를 생성
    public User( String password, String userName, String email, String gender, String birth) {
        this.userName = userName;
        this.password = password;
        this.email = email;
        this.gender = gender;
        this.birth = birth;
    }
    // 가입 정보가 이미 캡슐화되어있는 경우 편리하게 사용
    public User(UserRequest userRequest) {
        this.password = userRequest.getPassword();
        this.userName = userRequest.getUserName();
        this.email = userRequest.getEmail();
        this.gender = userRequest.getGender();
        this.birth = userRequest.getBirth();
    }

    public User( String password) {
        this.password = password;
        this.userRole = UserRole.USER;
    }



}
