package com.example.Final_Project.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;


// 보여줄 정보
public class UserResponseDto {
    @AllArgsConstructor
    @Getter
    @Builder
    public static class TokenInfo {
        private String grantType;
        private String accessToken;
        private String refreshToken;
        private Long refreshTokenExpirationTime;
    }
}
