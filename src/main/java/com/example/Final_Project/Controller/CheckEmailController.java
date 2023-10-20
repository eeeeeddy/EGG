package com.example.Final_Project.Controller;

import com.example.Final_Project.Repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://3.37.110.13:3000"}) // CORS 설정
public class CheckEmailController {
    private final UsersRepository usersRepository;

    @Autowired
    public CheckEmailController(UsersRepository usersRepository){
        this.usersRepository = usersRepository;
    }

    @GetMapping("/api/v1/users/checkEmail")
    public boolean checkEmail(@RequestParam String email) {
        // 이메일이 이미 등록되었는지 확인하는 로직을 작성합니다.
        boolean exists = usersRepository.existsByEmail(email);
        return exists;
    }
}
