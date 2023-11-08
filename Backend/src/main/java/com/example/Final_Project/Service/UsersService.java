package com.example.Final_Project.Service;

import com.example.Final_Project.Config.CustomUserDetailsService;
import com.example.Final_Project.Dto.Response;
import com.example.Final_Project.Dto.UserRequestDto;
import com.example.Final_Project.Dto.UserResponseDto;
import com.example.Final_Project.Entity.Users;
import com.example.Final_Project.Enum.Authority;
import com.example.Final_Project.Security.JwtTokenProvider;
import com.example.Final_Project.Repository.UsersRepository;
import com.example.Final_Project.Security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.concurrent.TimeUnit;
@Service
@RequiredArgsConstructor
@Slf4j
public class UsersService {
    private final UsersRepository usersRepository;
    private final Response response;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate<String, Object> redisTemplate;
    private final CustomUserDetailsService customUserDetailsService;

    public ResponseEntity<?> signUp(UserRequestDto.SignUp signUp) {
        if (usersRepository.existsByEmail(signUp.getEmail())) {
            return response.fail("이미 회원가입된 이메일입니다.", HttpStatus.BAD_REQUEST);
        }

        Users user = Users.builder()
                .email(signUp.getEmail())
                .password(passwordEncoder.encode(signUp.getPassword()))
                .userName(signUp.getUserName())
                .gender(signUp.getGender())
                .birth(signUp.getBirth())
                .roles(Collections.singletonList(Authority.ROLE_USER.name()))
                .build();
        usersRepository.save(user);

        addAdminRoleToUser(signUp.getEmail());

        return response.success("회원가입에 성공했습니다.");
    }

    // admin 권한을 사용자에게 추가하는 메소드
    private void addAdminRoleToUser(String email) {
        // 사용자의 이메일을 기반으로 데이터베이스에서 사용자를 찾아온다.
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("이메일이 없습니다: " + email));

        // 사용자에게 admin 권한을 부여
        user.addRole(Authority.ROLE_ADMIN.name());

        // 사용자 정보를 업데이트
        usersRepository.save(user);
    }

    public ResponseEntity<?> login(UserRequestDto.Login login) {
        Users user = usersRepository.findByEmail(login.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("해당하는 유저가 존재하지 않습니다."));

        if (!passwordEncoder.matches(login.getPassword(), user.getPassword())) {
            return response.fail("비밀번호가 일치하지 않습니다.", HttpStatus.BAD_REQUEST);
        }

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(login.getEmail());
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        UserResponseDto.TokenInfo tokenInfo = jwtTokenProvider.generateToken(authentication);

        redisTemplate.opsForValue()
                .set("RT:" + userDetails.getUsername(), tokenInfo.getRefreshToken(), tokenInfo.getRefreshTokenExpirationTime(), TimeUnit.MILLISECONDS);

        return response.success(tokenInfo, "로그인에 성공했습니다.", HttpStatus.OK);
    }

    public ResponseEntity<?> reissue(UserRequestDto.Reissue reissue) {
        if (!jwtTokenProvider.validateToken(reissue.getRefreshToken())) {
            return response.fail("Refresh Token 정보가 유효하지 않습니다.", HttpStatus.BAD_REQUEST);
        }

        Authentication authentication = jwtTokenProvider.getAuthentication(reissue.getAccessToken());
        String refreshToken = (String) redisTemplate.opsForValue().get("RT:" + authentication.getName());

        if (StringUtils.isEmpty(refreshToken) || !refreshToken.equals(reissue.getRefreshToken())) {
            return response.fail("Refresh Token 정보가 일치하지 않습니다.", HttpStatus.BAD_REQUEST);
        }

        UserResponseDto.TokenInfo tokenInfo = jwtTokenProvider.generateToken(authentication);

        redisTemplate.opsForValue()
                .set("RT:" + authentication.getName(), tokenInfo.getRefreshToken(), tokenInfo.getRefreshTokenExpirationTime(), TimeUnit.MILLISECONDS);

        return response.success(tokenInfo, "Token 정보가 갱신되었습니다.", HttpStatus.OK);
    }

    public ResponseEntity<?> logout(UserRequestDto.Logout logout) {
        if (!jwtTokenProvider.validateToken(logout.getAccessToken())) {
            return response.fail("잘못된 요청입니다.", HttpStatus.BAD_REQUEST);
        }

        Authentication authentication = jwtTokenProvider.getAuthentication(logout.getAccessToken());
        String refreshTokenKey = "RT:" + authentication.getName();

        if (redisTemplate.hasKey(refreshTokenKey)) {
            redisTemplate.delete(refreshTokenKey);
        }

        Long expiration = jwtTokenProvider.getExpiration(logout.getAccessToken());
        redisTemplate.opsForValue().set(logout.getAccessToken(), "logout", expiration, TimeUnit.MILLISECONDS);

        return response.success("로그아웃 되었습니다.");
    }

    public ResponseEntity<?> authority() {
        String userEmail = SecurityUtil.getCurrentUserEmail();
        Users user = usersRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("No authentication information."));
        user.getRoles().add(Authority.ROLE_ADMIN.name());
        usersRepository.save(user);
        return response.success();
    }
}