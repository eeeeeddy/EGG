//package com.example.Final_Project.Config;
//
//import org.springframework.context.annotation.Bean;
//import springfox.documentation.builders.PathSelectors;
//import springfox.documentation.builders.RequestHandlerSelectors;
//import springfox.documentation.spi.DocumentationType;
//import springfox.documentation.spring.web.plugins.Docket;
//
////@Configuration
//public class SwaggerConfig{
//    @Bean
//    public Docket api() {
//        return new Docket(DocumentationType.OAS_30)
//                .select()
//                .apis(RequestHandlerSelectors.basePackage("ccom.example.Final_Project.Controller")) // 컨트롤러 패키지 지정
//                .paths(PathSelectors.any()) // 모든 경로 문서화
//                .build();
//    }
//}
