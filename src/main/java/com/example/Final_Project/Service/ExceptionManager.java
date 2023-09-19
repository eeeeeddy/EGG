package com.example.Final_Project.Service;

import com.example.Final_Project.Dto.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ExceptionManager {
    @ExceptionHandler(HospitalReviewAppException.class)
    public ResponseEntity<?> hospitalReviewAppExceptionHandler(HospitalReviewAppException e){
        return ResponseEntity.status(e.getErrorCode().getHttpStatus())
                .body(Response.error(e.getErrorCode().getMessage()));
    }
}


