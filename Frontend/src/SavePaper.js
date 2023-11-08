import React, { useState, useEffect } from 'react';
import axios from './AxiosConfig';
import EggNavbar from './Navbar';
import './css/SavePaper.css';
import { useNavigate } from 'react-router-dom';

function SavePaper() {
    const [savedPapers, setSavedPapers] = useState([]);
    const [category, setCategory] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // 서버에서 저장된 논문을 가져오기 위해 HTTP GET 요청을 수행합니다.
        axios.get('/api/save/papers')
            .then((response) => {
                setSavedPapers(response.data);
            })
            .catch((error) => {
                console.error('저장된 논문을 가져오는 중 오류가 발생했습니다:', error);
            });
    }, []);

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

    const handleCategory = (event) => {
        setCategory(event.target.value);
    };

    const handleDeletePaper = (articleId) => {
        if (articleId) { // articleId가 유효한 경우에만 요청을 보내도록 수정
            console.log("article", articleId);
            axios
                .delete(`/api/save/papers/${articleId}`)
                .then((response) => {
                    // 성공적으로 삭제된 경우 클라이언트에서도 해당 항목을 제거
                    setSavedPapers(savedPapers.filter(paper => paper.articleId !== articleId)); // article_id -> articleId로 수정
                })
                .catch((error) => {
                    console.error('논문 삭제 중 오류가 발생했습니다:', error);
                });
        } else {
            console.error("articleId is undefined or not set.");
        }
    }

    const handleDetailPaper = (articleId) => {
        navigate(`/Detail/${articleId}`)
    }

    const ClickOpenKCI = (article_id) => {
        const kciUrl = `https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=` + article_id;
        console.log(kciUrl);
        // 새 창으로 KCI 링크 열기
        window.open(kciUrl);
    }

    return (
        <div style={{ fontFamily: 'MaruBuri-Regular' }}>
            <div className='App'>
                <EggNavbar />
            </div>
            <div className="save-container">
                <h2 className="save-title">Save Papers</h2>
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
                {savedPapers.length === 0 ? (
                    <h3 className="no-saved-papers" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',marginTop:85 }}>저장된 논문이 없습니다.</h3>
                ) : (
                    <ul className="save-list">
                        {savedPapers
                            .filter(paper => !category || paper.category === category)
                            .map((paper, idx) => (
                                <li key={idx} className="save-item">
                                    <div className="item-container">
                                        <p className='save-item-title' onClick={() => ClickOpenKCI(paper.articleId)}>{paper.title_ko}</p>
                                        <button className='btn btn-primary btn-sm me-1 mt-1' style={{ backgroundColor: getCategoryColor(paper.category), borderColor: getCategoryColor(paper.category) }}>{paper.category}</button>
                                    </div>
                                    <p className="save-item-author">{paper.author_name}</p>
                                    <p className="save-item-abstract">{paper.abstract_ko}</p>
                                    <button className='btn btn-outline-success rounded-pill me-2' type="submit" onClick={() => handleDetailPaper(paper.articleId)}>Detail</button>
                                    <button className="btn btn-outline-danger rounded-pill" type="submit" onClick={() => handleDeletePaper(paper.articleId)}>Delete</button>
                                </li>
                            ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default SavePaper;