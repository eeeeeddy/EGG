package com.example.Final_Project.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
// 비밀번호 암호화
public class EncryptorConfig {
    @Bean
    public BCryptPasswordEncoder encodePwd() {
        return new BCryptPasswordEncoder(); //pw 인코딩 시 사용
        //BC... = 비밀번호를 암호화 하는데 사용할 수 있는 메서드
    }
}
