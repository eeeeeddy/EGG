package com.example.Final_Project.Controller;

import com.example.Final_Project.Dto.*;
import com.example.Final_Project.Entity.User;
import com.example.Final_Project.Service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("users")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private final UserService userService;
    private final BCryptPasswordEncoder encoder;

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/checkEmail")
    public Response<CheckEmailResponse> checkEmail(@RequestParam String email) {
        boolean emailExists = userService.checkEmailExists(email);
        return Response.success(new CheckEmailResponse(emailExists));
    }

    @CrossOrigin(origins = "http://localhost:3000") // CORS 설정
    @PostMapping("/join")
    public Response<UserResponse> join(@RequestBody UserRequest userJoinRequest) {

        User join = userService.join(userJoinRequest.toEntity(encoder.encode(userJoinRequest.getPassword())));
        UserResponse userJoinResponse = new UserResponse(join);
        return Response.success(userJoinResponse);
    }

    @CrossOrigin(origins = "http://localhost:3000") // CORS 설정
    @PostMapping("/login")
    public Response<UserLoginResponse> login(@RequestBody UserLoginRequest userLoginRequest){
        String token = userService.login(userLoginRequest.getEmail(), userLoginRequest.getPassword());
        return Response.success(new UserLoginResponse(token));
    }
    // token 을 UserLoginResponse 객체에 담은 뒤, 반환



}
