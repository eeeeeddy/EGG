package com.example.Final_Project.Controller;

import com.example.Final_Project.Dto.Response;
import com.example.Final_Project.Dto.UserRequestDto;
import com.example.Final_Project.Security.JwtTokenProvider;
import com.example.Final_Project.Service.Helper;
import com.example.Final_Project.Service.UsersService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@Validated
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://3.37.110.13:3000"}) // CORS 설정
public class UsersController {
    private final JwtTokenProvider jwtTokenProvider;
    private final UsersService usersService;
    private final Response response;


    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@RequestBody @Validated UserRequestDto.SignUp signUp, Errors errors) {
        // validation check
        System.out.println(signUp.getEmail());
        System.out.println(signUp.getPassword());
        System.out.println(signUp.getUserName());

        if (errors.hasErrors()) {
            return response.invalidFields(Helper.refineError(errors));
        }
        return usersService.signUp(signUp);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Validated UserRequestDto.Login login, Errors errors) {
        // validation check
        System.out.println(login.getEmail());
        System.out.println(login.getPassword());

        if (errors.hasErrors()) {
            return response.invalidFields(Helper.refineError(errors));
        }
        return usersService.login(login);
    }

    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(@RequestBody @Validated UserRequestDto.Reissue reissue, Errors errors) {
        // validation check
        if (errors.hasErrors()) {
            return response.invalidFields(Helper.refineError(errors));
        }
        return usersService.reissue(reissue);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody(required = false) @Validated UserRequestDto.Logout logout, Errors errors) {
        // validation check
        if (logout == null) {
            // 요청 바디가 누락된 경우
            return response.fail("요청 바디가 누락되었습니다.", HttpStatus.BAD_REQUEST);
        }

        System.out.println(logout.getAccessToken());
        System.out.println(logout.getRefreshToken());

        if (errors.hasErrors()) {
            return response.invalidFields(Helper.refineError(errors));
        }
        return usersService.logout(logout);
    }

    @GetMapping("/authority")
    public ResponseEntity<?> authority() {
        log.info("ADD ROLE_ADMIN");
        return usersService.authority();
    }

    @GetMapping("/userTest")
    public ResponseEntity<?> userTest() {
        log.info("ROLE_USER TEST");
        return response.success();
    }

    @GetMapping("/adminTest")
    public ResponseEntity<?> adminTest() {
        log.info("ROLE_ADMIN TEST");
        return response.success();
    }
}