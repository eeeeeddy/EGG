package com.example.Final_Project.Service;

import com.example.Final_Project.Entity.SavePaper;
import com.example.Final_Project.Repository.SaveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class SaveService {
    @Autowired
    private SaveRepository saveRepository;

    public SavePaper savePaper(SavePaper savePaper) {
        SavePaper savedPaper = saveRepository.save(savePaper);
        System.out.println("Saved Paper: " + savedPaper); // 저장된 SavePaper 객체 출력
        return savedPaper ;
    }
    @Autowired
    public SaveService(SaveRepository saveRepository) {
        this.saveRepository = saveRepository;
    }

    @Transactional
    public void deleteSavePaper(String articleId, String userEmail) {
        if (saveRepository.existsByArticleIdAndUserEmail(articleId, userEmail)) {
            saveRepository.deleteByArticleIdAndUserEmail(articleId, userEmail);
        }
    }

}