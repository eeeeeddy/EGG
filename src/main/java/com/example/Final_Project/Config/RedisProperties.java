package com.example.Final_Project.Config;


import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

// redisConfig파일 안에 port와 host알아내기
//@ConfigurationProperties를 이용해 redis의 하위의 값들을 필드값으로 가져왔음
@Component
@ConfigurationProperties(prefix = "spring.redis")
@Getter
@Setter
public class RedisProperties {

    private int port;
    private String host;

    public int getPort(){
        return this.port;
    }
    public String getHost() {
        return this.host;
    }
}
