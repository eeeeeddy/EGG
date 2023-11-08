package com.example.Final_Project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.web.bind.annotation.CrossOrigin;
// 스프링 부트 애블리케이션임을 나타냄
// 자동 구성을 활성화하며 클래스패스 스캔을 통해 spring Bean을 자동을 구성
// 내장 웹서버를 시작하고 웹을 실행

@SpringBootApplication
@EnableJpaAuditing
@CrossOrigin(origins = "http://localhost:3000") // CORS 설정
public class FinalProjectApplication {
//public static void main(String[] args) = 진입점
//SpringApplication.run(FinalProjectApplication.class, args); = 시작
//FinalProjectApplication.class = 주요 클래스로 이 클래스 기준으로 앱 구성하고 실행
//args 매개변수를 전달할 수 있는 배열로 앱실행에 영향을 미칠 수 있다.
	public static void main(String[] args) {
		SpringApplication.run(FinalProjectApplication.class, args);
	}
}