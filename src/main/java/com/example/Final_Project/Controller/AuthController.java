package com.example.Final_Project.Controller;
import com.example.Final_Project.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://3.37.110.13:3000"}) // CORS 설정
public class AuthController {
    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/check-authentication")
    public String checkAuthenticationStatus() {
        String userEmail = authService.getCurrentUserEmail();

        if (userEmail != null) {
            return "현재 사용자 (" + userEmail + ") 는 인증되었습니다.";
        } else {
            return "현재 사용자는 인증되지 않았습니다.";
        }
    }

    @GetMapping("/check-email-authentication")
    public String checkEmailAuthenticationStatus(@RequestParam String email) {
        boolean isAuthenticated = authService.isEmailAuthenticated(email);

        if (isAuthenticated) {
            return "이메일 " + email + " 는 인증되었습니다.";
        } else {
            return "이메일 " + email + " 는 인증되지 않았습니다.";
        }
    }
}