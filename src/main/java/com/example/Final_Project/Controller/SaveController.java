package com.example.Final_Project.Controller;

import com.example.Final_Project.Entity.SavePaper;
import com.example.Final_Project.Entity.Users;
import com.example.Final_Project.Repository.SaveRepository;
import com.example.Final_Project.Repository.UsersRepository;
import com.example.Final_Project.Service.SaveService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@Validated
@RequestMapping("/api/save")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class SaveController {
    @Autowired
    private SaveService saveService;
    private SaveRepository saveRepository;
    private UsersRepository usersRepository;

    @Autowired
    public SaveController(SaveService saveService, SaveRepository saveRepository, UsersRepository usersRepository){
        this.saveService = saveService;
        this.saveRepository = saveRepository;
        this.usersRepository = usersRepository;
    }

    @PostMapping("/papers")
    public ResponseEntity<SavePaper> saveSavePaper(@RequestBody SavePaper savePaper) {
        try {
            // Spring Security를 사용하여 현재 사용자의 이메일 가져오기
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName(); // 현재 사용자의 이메일

            if (userEmail != null) {
                System.out.println("User Email: " + userEmail);
                savePaper.setUserEmail(userEmail); // SavePaper 엔티티의 userEmail 필드 설정
            } else {
                System.out.println("User Email is null.");
            }

            SavePaper savedPaper = saveService.savePaper(savePaper);
            ResponseEntity<SavePaper> responseEntity = new ResponseEntity<>(savedPaper, HttpStatus.CREATED);

            System.out.println("ResponseEntity: " + responseEntity);

            return responseEntity;
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}