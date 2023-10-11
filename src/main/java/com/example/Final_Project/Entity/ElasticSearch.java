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
    private String id2;

    private String articleID;

    private String journalName;

    private String journalPublisher;

    private String pubYear;

    private String pubMon;

    private String volume;

    private String issue;

    private String articleCategories;

    private String articleRegularity;

    private String titleKor;

    private String titleEng;

    private String authors;

    private String abstractKor;

    private String abstractEng;

    private String fpage;

    private String lpage;

    private String citations;

    private String url;

    private String verified;

    private String doi;

    private String uci;

    private String keyword;
}
