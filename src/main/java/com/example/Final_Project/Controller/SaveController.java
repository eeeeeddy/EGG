package com.example.Final_Project.Controller;

import com.example.Final_Project.Entity.SavePaper;
import com.example.Final_Project.Entity.Users;
import com.example.Final_Project.Repository.SaveRepository;
import com.example.Final_Project.Repository.UsersRepository;
import com.example.Final_Project.Security.SecurityUtil;
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

import javax.validation.constraints.Email;
import java.util.Optional;

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
    public SaveController(SaveService saveService, SaveRepository saveRepository, UsersRepository usersRepository) {
        this.saveService = saveService;
        this.saveRepository = saveRepository;
        this.usersRepository = usersRepository;
    }

    @PostMapping("/papers")
    public ResponseEntity<?> saveSavePaper(@RequestBody SavePaper savePaper) {
        try {
            // 현재 사용자의 Authentication 객체 가져오기
//            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            // 현재 사용자의 이메일 가져오기
//            String userEmail = authentication.getName(); // 현재 사용자의 이메일
            String userEmail = SecurityUtil.getCurrentUserEmail(); // 현재 사용자의 이메일

            System.out.println(userEmail);


            if (userEmail != null && !userEmail.equals("anonymousUser")) {
                Optional<Users> currentUser = usersRepository.findByEmail(userEmail); // 이메일로 사용자를 조회하여 가져옴
                if (currentUser.isPresent()) {
                    savePaper.setUser(currentUser.get()); // SavePaper 엔티티의 user 필드에 사용자 설정
                } else {
                    System.out.println("User not found.");
                }
            } else {
                System.out.println("User Email is null or anonymousUser.");
            }

            // 이미 저장되었는지 확인
            if (saveRepository.existsByArticleIdAndUserEmail(savePaper.getArticleId(), userEmail)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 저장되었습니다.");
            }

            SavePaper savedPaper = saveService.savePaper(savePaper);
            ResponseEntity<SavePaper> responseEntity = new ResponseEntity<>(savedPaper, HttpStatus.CREATED);

            System.out.println("ResponseEntity: " + responseEntity);

            return responseEntity;

//            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}