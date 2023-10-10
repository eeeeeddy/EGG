package com.example.Final_Project.Controller;

import com.example.Final_Project.Entity.ElasticSearch;
import com.example.Final_Project.Repository.ElasticSearchRepository;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.MatchQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // CORS 설정
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

        try {
//            // Elasticsearch에서 데이터를 검색하는 쿼리를 작성
//            SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
//            sourceBuilder.query(QueryBuilders.matchQuery("titleKor", keyword)); // 여기서 "titleKor"는 Elasticsearch 인덱스의 필드 이름입니다.
//
//            // Elasticsearch에 쿼리를 실행할 SearchRequest를 생성
//            SearchRequest searchRequest = new SearchRequest(); // 인덱스를 지정하지 않은 경우 모든 인덱스에서 검색됩니다.
//            searchRequest.source(sourceBuilder);
//
//            // Elasticsearch에 쿼리를 실행
//            SearchResponse response = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);



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
                    .build();

            // Elasticsearch에서 Spring Data Elasticsearch의 NativeSearchQuery를 사용하여 검색합니다.
            SearchHits<ElasticSearch> searchHits = elasticsearchRestTemplate.search(searchQuery, ElasticSearch.class, IndexCoordinates.of("kci"));

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



//            // Elasticsearch에 검색 쿼리를 실행합니다.
//            SearchResponse response = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
//
//            // Elasticsearch의 응답에서 검색 결과를 가져와서 리스트에 추가
//            response.getHits().forEach(hit -> {
//                try {
//                    ElasticSearch elasticSearch = elasticSearchRepository.findById(hit.getId()).orElse(null);
//                    if (elasticSearch != null) {
//                        result.add(elasticSearch);
//                    }
//                } catch (Exception e) {
//                    e.printStackTrace();
//                }
//            });
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//
//        return result;
//    }
}
