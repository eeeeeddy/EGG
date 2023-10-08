package com.example.Final_Project.Service;

import com.example.Final_Project.Entity.SavePaper;
import com.example.Final_Project.Entity.Users;
import com.example.Final_Project.Repository.SaveRepository;
import com.example.Final_Project.Repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Security;

@Service
public class SaveService {
    @Autowired
    private SaveRepository saveRepository;

    public SavePaper savePaper(SavePaper savePaper) {
        SavePaper savedPaper = saveRepository.save(savePaper);
        System.out.println("Saved Paper: " + savedPaper); // 저장된 SavePaper 객체 출력
        return savedPaper;
    }

}