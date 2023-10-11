package com.example.Final_Project.Service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    public boolean isUserAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated();
    }
    public String getCurrentUserEmail() {
        // SecurityContextHolder를 사용하여 현재 사용자의 Authentication을 가져옴
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            // 인증된 사용자의 이메일 정보를 반환
            return authentication.getName();
        }
        return null;
    }// 특정 이메일의 인증 상태를 확인하는 메서드 추가
    public boolean isEmailAuthenticated(String email) {
        // SecurityContextHolder를 사용하여 현재 사용자의 Authentication을 가져옴
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            // 인증된 사용자의 이메일 정보를 가져옴
            String currentUserEmail = authentication.getName();
            // 특정 이메일과 현재 사용자의 이메일을 비교하여 인증 상태 확인
            return currentUserEmail.equals(email);
        }
        return false;
    }
}