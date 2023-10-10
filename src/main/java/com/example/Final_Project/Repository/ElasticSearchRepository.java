package com.example.Final_Project.Repository;

import com.example.Final_Project.Entity.ElasticSearch;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ElasticSearchRepository extends ElasticsearchRepository<ElasticSearch, String> {
    List<ElasticSearch> findByKeyword(@Param("ESKeyword") String ESkeyword);
}
