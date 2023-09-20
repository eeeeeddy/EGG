package com.example.Final_Project.Dto;

import com.example.Final_Project.Entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
// 보여줄 정보
public class UserResponse {
    private String email;
    private String userName;

    public UserResponse(User user){
        this.email = user.getEmail();
        this.userName = user.getUserName();
    }
}
