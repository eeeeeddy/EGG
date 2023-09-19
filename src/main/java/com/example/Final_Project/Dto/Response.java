package com.example.Final_Project.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
// json형태로 에러메시지 나타내기
public class Response<T>{
    private String resultCode;
    private T result;

    public static Response<Void> error(String resultCode){
        return new Response(resultCode, null);
    }

    public static <T> Response<T> success(T result){
        return new Response<>("SUCCESS",result);
    }
}
