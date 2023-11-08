import './css/Main.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EggMainNavbar from './MainNavbar';

function Main() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isShowInfo, setIsShowInfo] = useState(false);
    const [isShowInfo2, setIsShowInfo2] = useState(false);
    const navigate = useNavigate();
    // useNavigate 훅을 사용하여 네비게이션 함수를 가져옵니다.

    const handleShowButtonClick = () => {
        setIsShowInfo(!isShowInfo);
        if (isShowInfo2 === true) {
            setIsShowInfo2(!isShowInfo2)
        } else {
            setIsShowInfo2(isShowInfo2)
        }
        // 작은 페이지 가시성 상태를 토글
    };

    const handleShowButtonClick2 = () => {
        setIsShowInfo2(!isShowInfo2)
        if (isShowInfo === true) {
            setIsShowInfo(!isShowInfo)
        } else {
            setIsShowInfo(isShowInfo);
        }
        // 작은 페이지 가시성 상태를 토글
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            if (searchQuery.trim() === '') {
                window.alert('검색어를 입력하세요.');
            } else {
                console.log('검색어가 입력되었습니다.');
                navigate(`/search/${encodeURIComponent(searchQuery)}`);
                // 검색어를 포함하여 Search 페이지로 이동합니다.
            }
        }
    };
    const handleSearchClick = () => {
        if (searchQuery.trim() === '') {
            window.alert('검색어를 입력하세요.');
        } else {
            navigate(`/search/${encodeURIComponent(searchQuery)}`);
        }// 검색어를 포함하여 Search 페이지로 이동합니다.
    };

    return (
        <div style={{ fontFamily: 'MaruBuri-Regular' }}>
            <div className='Navbar'>
                <EggMainNavbar />
            </div>

            <div className='MainBody'>
                <div style={{height:"20px"}}></div>
                <h1>Explore Research Tree In a Visual Graph</h1><br />
                <h3>To start, enter a paper identifier</h3><br />

                {/* 검색창 */}
                <div className='search'>
                    <div className='searchInput'>
                        {/* <img src='/search_icon2.png' alt='돋보기 아이콘' className='searchIcon' /> */}
                        <input
                            className='search-input' type='search'
                            autoComplete='off'
                            aria-live='polite'
                            placeholder='논문 제목, 키워드를 입력하세요'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown} // 엔터 키 이벤트 처리
                            style={{borderRadius: "45px", textAlign:"center"}}
                        />
                        <button className='searchButton' type='button' onClick={handleSearchClick}><b>Search</b></button>
                    </div>
                </div>
                <div style={{ height: "30px" }}></div>
            </div>
            <div className='d-flex justify-content-center mt-3 mb-0'>
                <p>9,762 articles in Korean</p>
            </div>
            <div className='d-flex justify-content-center'>
                <a href="/About" style={{color: "#588157", textDecoration: "None"}}>How to Use it</a>
            </div>
        </div>
    );
}
export default Main;