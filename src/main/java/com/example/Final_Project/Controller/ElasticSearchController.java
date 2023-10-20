package com.example.Final_Project.Controller;

import com.example.Final_Project.Entity.ElasticSearch;
import com.example.Final_Project.Repository.ElasticSearchRepository;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.MatchQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://3.37.110.13:3000"}) // CORS 설정
@RequestMapping("/search/_search")
public class ElasticSearchController {
    @Autowired
    private ElasticSearchRepository elasticSearchRepository;

    @Autowired
    private RestHighLevelClient restHighLevelClient;

    @Autowired
    private ElasticsearchRestTemplate elasticsearchRestTemplate;

    @GetMapping("/{keyword}")
    public List<ElasticSearch> findByKeyword(@PathVariable String keyword) {
        List<ElasticSearch> result = new ArrayList<>();

        // 페이지 크기 설정
        Pageable pageable = PageRequest.of(0, 20); // 페이지 0, 크기 10 (여기서 크기를 원하는 값으로 조정)

        try {
            // Bool 쿼리 빌더를 사용하여 "should" 절을 만듭니다.
            BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery();

            // Match 쿼리 빌더를 사용하여 필드 "titleKor"에서 키워드와 매치되는 쿼리를 생성합니다.
            MatchQueryBuilder matchQueryBuilderTitle = QueryBuilders.matchQuery("titleKor", keyword);

            // Match 쿼리 빌더를 사용하여 필드 "abstractKor"에서 키워드와 매치되는 쿼리를 생성합니다.
            MatchQueryBuilder matchQueryBuilderAbstract = QueryBuilders.matchQuery("abstractKor", keyword);

            // "should" 절에 Match 쿼리를 추가합니다.
            boolQueryBuilder.should(matchQueryBuilderTitle);
            boolQueryBuilder.should(matchQueryBuilderAbstract);

            // NativeSearchQueryBuilder를 사용하여 검색 쿼리를 빌드합니다.
            NativeSearchQuery searchQuery = new NativeSearchQueryBuilder()
                    .withQuery(boolQueryBuilder) // Bool 쿼리를 검색 쿼리로 설정
                    .withPageable(pageable)     // 페이지 크기 설정
                    .build();

            // Elasticsearch에서 Spring Data Elasticsearch의 NativeSearchQuery를 사용하여 검색합니다.
            SearchHits<ElasticSearch> searchHits = elasticsearchRestTemplate.search(searchQuery, ElasticSearch.class, IndexCoordinates.of("article"));

            // 검색 결과에서 데이터를 추출하여 리스트에 추가합니다.
            searchHits.forEach(searchHit -> {
                ElasticSearch elasticSearch = searchHit.getContent();
                result.add(elasticSearch);
            });
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }
}
