import React, { useEffect, useState } from 'react';
import './css/History.css';
import EggNavbar from './Navbar';
import { useNavigate } from 'react-router-dom';

function History() {
    const [userHistory, setUserHistory] = useState([]);
    const [category, setCategory] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // 로컬 스토리지에서 저장된 논문 히스토리 가져오기
        const lastOpenedPaperJSON = localStorage.getItem('lastOpenedPaper');
        const lastOpenedPaper = JSON.parse(lastOpenedPaperJSON) || [];
        console.log(lastOpenedPaper)
        // 데이터가 배열 형식인지 확인
        if (Array.isArray(lastOpenedPaper)) {
            // null 또는 undefined인 항목을 제거하고 최근 본 논문 10개를 유지하기 위해 배열로 변환하고 새 데이터를 추가
            const filteredHistory = lastOpenedPaper.filter(item => item && item.title_ko);
            setUserHistory(filteredHistory);
        } else {
            // 배열 형식이 아닌 경우, 기본값 또는 오류 처리를 수행
            setUserHistory([]);
            console.error('Invalid data in localStorage');
        }
    }, []); // 빈 배열을 의존성 배열로 지정하여 컴포넌트가 처음 마운트될 때만 실행

    // getCategoryColor 함수를 추가
    function getCategoryColor(category) {
        switch (category) {
            case "ML":
                return "#A3B18A";
            case "Network":
                return "#FF5733";
            case "Databases":
                return "#007ACC";
            case "Software":
                return "#8338ec";
            case "Operating System":
                return "#e63946";
            case "Computer Vision":
                return "#e5989b";
            case "Security":
                return "#fb5607";
            case "Graphics":
                return "#fca311";
            case "Computation":
                return "#000000";
            case "Hardware":
                return "#0077b6";
            case "Programming Language":
                return "#cdb4db";
            case "Data Structure":
                return "#bc6c25";
            case "Robotics":
                return "#4a4e69";
            case "Mathematics":
                return "#432818";
            default:
                return "#edede9"; // 기본 색상
        }
    }

    // Abstract 텍스트를 최대 3줄까지 보이도록 가공
    const formatAbstract = (text) => {
        const lines = text.split('\n');
        if (lines.length > 3) {
            // 텍스트가 3줄보다 많으면 최대 3줄까지만 보이도록 가공
            return lines.slice(0, 3).join('\n') + '...';
        }
        return text;
    };

    const ClickOpenKCI = (article_id) => {
        const kciUrl = `https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=` + article_id;
        console.log(kciUrl);
        // 새 창으로 KCI 링크 열기
        window.open(kciUrl);
    }

    const handleCategory = (event) => {
        setCategory(event.target.value);
    };

    const handleDetailPaper = (articleId) => {
        console.log(articleId)
        // navigate(`/Detail/${articleId}`)
    }

    return (
        <div style={{ fontFamily: 'MaruBuri-Regular' }}>
            <div className='App'>
                <EggNavbar />
            </div>
            <div className="history-container">
                <h2 className="history-title">History</h2>
                <select className="form-select form-select-sm ms-5" aria-label=".form-select-sm example" style={{ width: "300px" }} onChange={handleCategory}>
                    <option selected value="">ALL</option>
                    <option value="ML">Machine Learning</option>
                    <option value="Network">Network</option>
                    <option value="Databases">Databases</option>
                    <option value="Software">Software</option>
                    <option value="Operating System">Operating System</option>
                    <option value="Computer Vision">Computer Vision</option>
                    <option value="Security">Security</option>
                    <option value="Graphics">Graphics</option>
                    <option value="Computation">Computation</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Programming Language">Programming Language</option>
                    <option value="Data Structure">Data Structure</option>
                    <option value="Robotics">Robotics</option>
                    <option value="Mathematics">Mathematics</option>
                </select>
                <br />
                <ul className="history-list">
                    {userHistory
                        .filter(item => !category || item.category === category)
                        .map((item, index) => (
                            <li key={index} className="history-item">
                                <div className="item-container">
                                    <p className='save-item-title' onClick={() => ClickOpenKCI(item.articleId)}>{item.title_ko}</p>
                                    <button className='btn btn-primary btn-sm me-1 mt-1' style={{ backgroundColor: getCategoryColor(item.category), borderColor: getCategoryColor(item.category) }}>{item.category}</button>
                                </div>
                                <p className="history-item-author">{item.author_name}</p>
                                <p className="history-item-abstract">{formatAbstract(item.abstract_ko)}</p>
                                <button className='btn btn-outline-success rounded-pill me-2' type="submit" onClick={() => handleDetailPaper(item.articleId)}>Detail</button>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
}

export default History;