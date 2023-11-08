import './css/Search.css';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EggNavbar from './Navbar';

function Search() {
    const [searchResult, setSearchResult] = useState([]);
    const params = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const TextStyle = { textAlign: 'center' };

    useEffect(() => {
        // URL 파라미터로부터 검색어를 가져옵니다.
        const { searchQuery } = params;

        if (searchQuery === 'loading') {
            setIsLoading(false);
            return; // 데이터를 불러오지 않고 로딩 상태로 남김
        }
        setIsLoading(true);

        // Spring Boot API 엔드포인트에 GET 요청을 보냅니다.
        axios.get(`/search/_search/${encodeURIComponent(params.searchQuery)}`)
            .then((response) => {
                // 데이터 불러오기 완료 후 로딩 상태 변경
                setIsLoading(false);
                // API 응답으로 받은 데이터를 검색 결과로 설정합니다.
                setSearchResult(response.data);
                console.log("결과", response.data);
            })
            .catch((error) => {
                setIsLoading(false);
                console.error('API 요청 중 오류 발생:', error);
            });
    }, [setSearchResult, params]);

    // paper-box를 클릭했을 때 detail 페이지로 이동하는 함수
    const handlePaperBoxClick = (articleId) => {
        navigate(`/Detail/${articleId}`);
    };

    const [expandedAbstracts, setExpandedAbstracts] = useState([]);
    // 요약을 전환하기 위한 함수
    const toggleAbstract = (articleId) => {
        if (expandedAbstracts.includes(articleId)) {
            setExpandedAbstracts(expandedAbstracts.filter(id => id !== articleId));
        } else {
            setExpandedAbstracts([...expandedAbstracts, articleId]);
        }
    };

    // 요약이 확장되었는지 확인하기 위한 함수
    const isExpanded = (articleId) => {
        return expandedAbstracts.includes(articleId);
    };

    return (
        <div style={{ fontFamily: 'MaruBuri-Regular' }}>
            <div className='Navbar'>
                <EggNavbar />
            </div>

            <div className="paper-container">
                <div className="paper-text" style={{ float: 'left' }}>
                    <p style={TextStyle}>
                        {params.searchQuery
                            ? `Article search results for '${decodeURIComponent(params.searchQuery)}'`
                            : 'Article search results for'}</p>
                    <h3 style={TextStyle}><b>Choose An Article for Graph :</b></h3>
                    <br />
                </div>
                <div>
                    {isLoading ? (
                        <div className="spinner-border text-success" role="status"></div>
                    ) : (
                        <div className="paper-box-container">
                            {searchResult.length > 0 ? (
                                searchResult.map((result) => (
                                    // 검색 결과를 여기서 필요한대로 렌더링하세요.
                                    <div key={result.articleID} className="paper-box" onClick={() => handlePaperBoxClick(result.articleID)}>
                                        <h4 onClick={() => handlePaperBoxClick(result.articleID)}>{result.titleKor}</h4>
                                        <p>
                                            <span className='paperbox-author'>{result.authors}</span>
                                            <span className='paperbox-year'>{result.pubYear}</span><br /><br />
                                            {isExpanded(result.articleID) ? (
                                                <span className='paperbox-p'>"{result.abstractKor}"</span>
                                            ) : (
                                                <span className={`paperbox-p ${result.abstractKor.length > 130 ? 'faded' : ''}`}>
                                                    "{result.abstractKor.slice(0, 200)}...
                                                </span>)}
                                            {/* 요약이 3줄 이상인 경우 "더 읽기" 버튼을 표시합니다. */}
                                            {result.abstractKor.length > 3 && (
                                                <button className='abstracKorbutton' onClick={() => toggleAbstract(result.articleID)}>
                                                    {isExpanded(result.articleID) ? 'Show less' : 'Show more'}
                                                </button>
                                            )}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <h4>검색 결과가 없습니다.</h4>
                            )
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Search;