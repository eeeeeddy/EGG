package com.example.Final_Project.Service;

import com.example.Final_Project.Entity.User;
import com.example.Final_Project.Enum.ErrorCode;
import com.example.Final_Project.Jwt.JwtTokenUtil;
import com.example.Final_Project.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;

    @Transactional
    public User join(User user) {
        userRepository.findByUserId(user.getUserId())
                .ifPresent( user1 -> {
                    throw new HospitalReviewAppException(
                            ErrorCode.DUPLICATED_USER_NAME, String.format(
                                    "UserId : %s",user1.getUserId()));
                });
        userRepository.save(user);
        return user;
    }

    @Value("${jwt.token.secret}")
    private String secretKey;
    private long expiredTimeMs = 1000 * 60 * 60; //1시간 = 토큰 만료 시간

    public String login(String userId, String password){
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new HospitalReviewAppException(ErrorCode.USER_NOT_FOUNDED, String.format("%S는 가입된 적이 없습니다.",userId)));

        if(!encoder.matches(password,user.getPassword())){
            throw new HospitalReviewAppException(ErrorCode.INVALID_PASSWORD, String.format("userID 또는 password가 잘 못 되었습니다."));

        }
        return JwtTokenUtil.createToken(userId,secretKey,expiredTimeMs);
        // 정상적으로 로그인을 마친 경우 userId, secretKey, expiredTimeMs을 통해서 문자열 형태의 토큰을 생성한 뒤 반환한다.
    }

}
