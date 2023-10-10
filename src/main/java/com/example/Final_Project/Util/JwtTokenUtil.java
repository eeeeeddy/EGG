package com.example.Final_Project.Util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;

public class JwtTokenUtil {
    // 암호화된 형태의 토큰이 생성
    public static String createToken(String email, String key, long expireTimesMS){
        Claims claims = Jwts.claims();
        claims.put("email", email);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                //현재시간
                .setExpiration(new Date(System.currentTimeMillis() + expireTimesMS))
                //현재시간 + 종료시간 = 만료 시간
                .signWith(SignatureAlgorithm.HS256, key)
                //해싱 알고리즘으로 입력받은 키를 암호화
                .compact();
    }
}
