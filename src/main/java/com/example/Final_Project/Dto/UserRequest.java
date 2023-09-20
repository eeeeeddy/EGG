package com.example.Final_Project.Dto;

import com.example.Final_Project.Entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
// 받아올 정보
public class UserRequest {
    private String userId;
    private String password;
    private String userName;
    private String email;
    private String gender;
    private String birth;

    public User toEntity(String password){
        return new User(
                password,
                this.userName,
                this.email, this.gender, this.birth);
    }
}
