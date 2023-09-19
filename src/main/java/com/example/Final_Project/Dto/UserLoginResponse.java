package com.example.Final_Project.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginResponse {
    // 토큰으로 응답
    private String token;
}
