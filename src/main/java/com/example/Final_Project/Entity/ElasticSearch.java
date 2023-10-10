package com.example.Final_Project.Entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

@Getter
@Setter
@NoArgsConstructor
@Document(indexName = "kci")
public class ElasticSearch {

    @Id
    private String articleID;

    private String keyword;

    private String titleKor;

    private String abstractKor;

    private String journalName;

    private String author1ID;

    private String author1Inst;
}
