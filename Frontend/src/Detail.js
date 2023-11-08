import './css/Detail.css';
import React, { useState, useEffect, useRef } from 'react';
import EggNavbar from './Navbar';
import * as d3 from 'd3';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from './UserContext';
import axios from 'axios';

function Detail() {
    const [searchQuery, setSearchQuery] = useState('');
    const [detailQuery, setDetailQuety] = useState('');
    const [isLeftPageOpen, setIsLeftPageOpen] = useState(true);
    const [selectedAuthorId, setSelectedAuthorId] = useState([]);
    const [highlightedText, setHighlightedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isShowHelp, setIsShowHelp] = useState(false);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const svgRef = useRef(null);
    const [selectedNode, setSelectedNode] = useState(null); // 선택한 노드 정보를 저장할 상태 변수
    const [fixedNode, setFixedNode] = useState(null); // 고정된 노드 정보를 저장할 상태 변수
    const navigate = useNavigate();
    const [selectedPaper, setSelectedPaper] = useState(null);
    const { userEmail, updateHistory } = useUser();
    const params = useParams();
    const [graphData, setGraphData] = useState(null);
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);
    const [publishYear, setPublishYear] = useState(2024);
    const [mainAuthor, setMainAuthor] = useState("default");
    const [category, setCategory] = useState("default");
    const [journalName, setjournalName] = useState("default");
    const [citation, setCitation] = useState(-1);
    const [sortedNode, setSortedNode] = useState([]);

    // 그래프 색상 관련 변수
    const defaultEdgeColor = 'rgba(0, 0, 0, 0.2)';
    const defaultNodeColor = 'rgba(88, 129, 87, 0.7)';
    const selectedNodeColor = 'rgba(255, 159, 28, 0.8)';
    const hoverDefaultNodeColor = 'rgba(8, 28, 21, 0.8)';
    const hoverSelectedNodeColor = 'rgba(232, 93, 4, 0.8)';
    const filteredNodeColor = 'rgba(255, 51, 51, 0.7)';
    const yearColor = ['rgba(88, 129, 87, 0.1)', 'rgba(88, 129, 87, 0.3)', 'rgba(88, 129, 87, 0.5)', 'rgba(58, 90, 64, 0.6)', 'rgba(58, 90, 64, 0.9)'];

    useEffect(() => {
        // URL 파라미터로부터 검색어를 가져옵니다.
        // const { detailQuery } = params;

        if (detailQuery === 'loading') {
            setIsLoading(true);
            return; // 데이터를 불러오지 않고 로딩 상태로 남김
        }
        setIsLoading(true);

        // article_id가 배열이면 문자열로 결합
        const articleIds = Array.isArray(params.article_id) ? params.article_id.join('+') : params.article_id;

        // Fast API 엔드포인트에 GET 요청을 보냅니다.
        axios.get(`http://15.165.247.85/Detail/${articleIds}`)
            .then((response) => {
                // 데이터 불러오기 완료 후 로딩 상태 변경
                setIsLoading(false);
                // API 응답으로 받은 데이터를 검색 결과로 설정합니다.
                console.log("서버에서 받아온 결과", response.data);

                const temp = response.data
                setGraphData(temp)

                const temp1 = response.data.nodes
                setNodes(temp1)

                const temp2 = response.data.links
                setLinks(temp2)

                const sorted = [...temp1];
                sorted.sort((a, b) => b.origin_check - a.origin_check);
                setSortedNode(sorted);
            })
            .catch((error) => {
                setIsLoading(false);
                console.error('FastAPI 요청 중 오류 발생:', error);
            });
    }, [params.article_id]); // 배열 안의 값이 변하면 통신하면서 화면을 렌더링함.

    useEffect(() => {
        console.log("graphData", graphData);
        console.log("nodes", nodes)
        console.log("links", links)
    }, [graphData, nodes, links])

    useEffect(() => {
        console.log("mainAuthor", mainAuthor);
        console.log("citation", citation);
        console.log("publishYear", publishYear);
        console.log("category", category);
        console.log("journalName", journalName);
    }, [mainAuthor, citation, journalName, category, publishYear])

    useEffect(() => {
        console.log('User Email 변경:', userEmail);
        // userEmail 상태가 변경될 때 실행할 코드를 이 곳에 추가할 수 있습니다.
    }, [userEmail]);

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
        console.log("현재 연도", currentYear)
    }, []);

    const toggleLeftPage = () => {
        setIsLeftPageOpen(!isLeftPageOpen);
    };

    const clickHelp = () => {
        setIsShowHelp(!isShowHelp)
    }

    const AuthorClick = (authorId) => {
        if (authorId !== 'None') {
            setSelectedAuthorId(authorId);
            navigate(`/Author/${authorId}`);
        } else {
            alert("KCI 내에 등록된 저자 아이디가 없습니다.")
        }
    }

    const handleMainAuthor = (event) => {
        const temp = event.target.value;
        setMainAuthor(temp);
    }

    const handlePublishYear = (event) => {
        const temp = event.target.value;
        setPublishYear(parseInt(temp));
    }

    const handleCategory = (event) => {
        const temp = event.target.value;
        setCategory(temp);
    }

    const handleJournalName = (event) => {
        const temp = event.target.value;
        setjournalName(temp);
    }

    const handleCitation = (event) => {
        const temp = event.target.value;
        setCitation(parseInt(temp));
    }

    const handleGraphFilter = () => {

        const width = 900;
        const height = 700;
        const minZoom = 0.75;
        const maxZoom = 1.5;

        // 해당 코드 추가: 이전 노드와 링크를 제거
        d3.select(svgRef.current).selectAll('.node').remove();
        d3.select(svgRef.current).selectAll('.link').remove();
        d3.select(svgRef.current).selectAll('.label').remove();

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .call(d3.zoom()
                .scaleExtent([minZoom, maxZoom]) // 최소 및 최대 줌 레벨 설정
                .translateExtent([[0, 0], [width + 90, height + 90]]) // 이동 가능 범위 설정
                .on('zoom', zoomed)); // 줌 이벤트 핸들러 추가

        // SVG 영역에 테두리 추가
        svg.append('rect')
            .attr('width', width)
            .attr('height', height)
            .style('fill', 'none')
            .style('stroke', 'black')
            .style('stroke-width', 0);

        const simulation = d3.forceSimulation(graphData.nodes)
            .force('link', d3.forceLink(graphData.links).distance(d => d.distance))
            .force('charge', d3.forceManyBody().strength(-1700))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collide', d3.forceCollide().radius(20));

        const link = svg.selectAll('.link')
            .data(links)
            .enter().append('line')
            .attr('class', 'link')
            .style('stroke', defaultEdgeColor)  // 간선 색상
            .style('stroke-width', 1); // 간선 두께

        const node = svg.selectAll('.node')
            .data(nodes)
            .enter().append('circle')
            .attr('class', 'node')
            .attr('r', d => (d.citation + 5) * 3)
            .style('fill', (d) => { // 노드 색상
                if (d.origin_check != 0) {
                    return selectedNodeColor;
                } else if (d.pub_year >= 2000 && d.pub_year <= 2005) {
                    return yearColor[0]
                } else if (d.pub_year > 2005 && d.pub_year <= 2010) {
                    return yearColor[1]
                } else if (d.pub_year > 2010 && d.pub_year <= 2015) {
                    return yearColor[2]
                } else if (d.pub_year > 2015 && d.pub_year <= 2020) {
                    return yearColor[3]
                } else {
                    return yearColor[4]
                }
            })
            .style('stroke', (d) => {
                if (d.pub_year > publishYear || d.category == category || d.author_name == mainAuthor || d.citation == citation || d.journal_name == journalName) {
                    return filteredNodeColor; // 조건이 모두 충족될 때의 테두리 색상
                } else if (d.origin_check != 0) {
                    return selectedNodeColor; // 조건이 충족되지 않을 때의 테두리 색상
                } else {
                    return defaultNodeColor;
                }
            })
            .style('stroke-width', (d) => {
                if (d.pub_year > publishYear || d.category == category || d.author_name == mainAuthor || d.citation == citation || d.journal_name == journalName) {
                    return 3; // 조건이 모두 충족될 때의 테두리 색상
                } else {
                    return 0;
                }
            })

        const label = svg.selectAll('.label')
            .data(graphData.nodes)
            .enter().append('text')
            .attr('class', 'label')
            .attr('text-anchor', 'middle')
            .attr('dy', -10) // 이 부분을 음수 값으로 설정하여 텍스트를 상단으로 올릴 수 있음
            .style('font-size', '12px') // 텍스트의 크기를 10px로 설정 (원하는 크기로 변경)
            .text(d => (d.author_name.split(',')[0] + ", " + d.pub_year));

        // 노드 위에 마우스를 올렸을 때 hover 효과 및 노드 정보 표시
        node.on('mouseover', (event, d) => {
            setFixedNode(null)
            setSelectedNode(d);
            d3.select(event.currentTarget)
                .attr('r', (d.citation + 5) * 3 + 5) // 노드 크기를 키워 hover 효과 표시
                .style('fill', d => {
                    if (d.origin_check != 0) { // 색상 및 투명도(0.5)
                        return hoverSelectedNodeColor;
                    } else {
                        return hoverDefaultNodeColor;
                    }
                })
        });

        node.on('mouseout', (event, d) => {
            if (d !== fixedNode) {
                setSelectedNode(null);
                d3.select(event.currentTarget)
                    .attr('r', (d.citation + 5) * 3) // 노드 크기 원래대로 복원
                    .style('fill', (d) => { // 노드 색상
                        if (d.origin_check != 0) {
                            return selectedNodeColor;
                        } else if (d.pub_year >= 2000 && d.pub_year <= 2005) {
                            return yearColor[0]
                        } else if (d.pub_year > 2005 && d.pub_year <= 2010) {
                            return yearColor[1]
                        } else if (d.pub_year > 2010 && d.pub_year <= 2015) {
                            return yearColor[2]
                        } else if (d.pub_year > 2015 && d.pub_year <= 2020) {
                            return yearColor[3]
                        } else {
                            return yearColor[4]
                        }
                    })
            }
        });

        // 노드 클릭 시 고정된 노드 정보 업데이트
        node.on('click', (event, d) => {
            setFixedNode(d);
        });

        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);

            label
                .attr('x', d => d.x)
                .attr('y', d => d.y);
        });

        // 줌 이벤트 핸들러
        function zoomed(event) {
            const { transform } = event;
            svg.attr('transform', transform); // 현재 변환을 SVG에 적용

            // 현재 줌 레벨 가져오기
            const currentScale = transform.k;

            // 배율을 통해 원하는 작업을 수행할 수 있습니다.
            // 예: 노드와 연결된 요소 크기 조정
            // node.attr('r', d => d.size / currentScale);
            label.attr('font-size', 10 / currentScale);
        }

        console.log("필터링 적용")
    }

    const handleResetZoom = () => {
        // svg 요소를 선택하고 zoom 객체를 사용하여 초기 상태로 리셋
        d3.select(svgRef.current)
            .transition()
            .duration(750)
            .attr("transform", d3.zoomIdentity);
    }

    const ClickOpenKCI = (article_id) => {
        const kciUrl = `https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=` + article_id;
        console.log(kciUrl);

        // 선택한 논문 정보 가져오기
        const selectedPaper = fixedNode || selectedNode || nodes[0];

        setSelectedPaper(selectedPaper);
        const historyItem = {
            title: selectedPaper.title_ko,
            authors: selectedPaper.author_name,
            abstract: selectedPaper.abstract_ko,
            userEmail: userEmail, // 로그인한 사용자의 이메일
        };
        console.log(historyItem);
        updateHistory(historyItem);

        // 로컬 스토리지에서 이전 논문 히스토리 가져오기
        const previousHistoryJSON = localStorage.getItem('lastOpenedPaper');
        let previousHistory = JSON.parse(previousHistoryJSON);

        console.log("논문 정보:", selectedPaper);

        // 이전 히스토리가 배열이 아니면 빈 배열로 초기화
        if (!Array.isArray(previousHistory)) {
            previousHistory = [];
        }

        // 새로운 히스토리에 추가하고 최대 개수 제한
        const updatedHistory = [selectedPaper, ...previousHistory.slice(0, 20)];

        // 로컬 스토리지에 업데이트된 히스토리 저장
        localStorage.setItem('lastOpenedPaper', JSON.stringify(updatedHistory));

        // 새 창으로 KCI 링크 열기
        window.open(kciUrl);
    }

    const ClickOpenDashboard = (article_id) => {
        const dashboardUrl = 'http://3.35.150.101:5601/app/dashboards#/view/c3722570-674b-11ee-9c7c-191f0524dd00?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-15m,to:now))'
        window.open(dashboardUrl)
    }

    // graph 생성
    useEffect(() => {
        const width = 900;
        const height = 700;
        const minZoom = 0.75;
        const maxZoom = 1.5;

        // SVG 요소 초기화
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .call(d3.zoom()
                .scaleExtent([minZoom, maxZoom]) // 최소 및 최대 줌 레벨 설정
                .translateExtent([[0, 0], [width + 90, height + 90]]) // 이동 가능 범위 설정
                .on('zoom', zoomed)); // 줌 이벤트 핸들러 추가

        svg.selectAll(".nodes").remove();
        svg.selectAll(".links").remove();

        // SVG 영역에 테두리 추가
        svg.append('rect')
            .attr('width', width)
            .attr('height', height)
            .style('fill', 'none')
            .style('stroke', 'black')
            .style('stroke-width', 0);

        // node size = (d.citation + 5) * 3
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).distance(d => d.distance))
            .force('charge', d3.forceManyBody().strength(-1700)) // 그래프 퍼진 정도
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collide', d3.forceCollide().radius(20));

        const link = svg.selectAll('.link')
            .data(links)
            .enter().append('line')
            .attr('class', 'link')
            .style('stroke', defaultEdgeColor)  // 간선 색상
            .style('stroke-width', 1); // 간선 두께

        const node = svg.selectAll('.node')
            .data(nodes)
            .enter().append('circle')
            .attr('class', 'node')
            .attr('r', d => (d.citation + 5) * 3)
            .style('fill', (d) => { // 노드 색상
                if (d.origin_check != 0) {
                    return selectedNodeColor;
                } else if (d.pub_year >= 2000 && d.pub_year <= 2005) {
                    return yearColor[0]
                } else if (d.pub_year > 2005 && d.pub_year <= 2010) {
                    return yearColor[1]
                } else if (d.pub_year > 2010 && d.pub_year <= 2015) {
                    return yearColor[2]
                } else if (d.pub_year > 2015 && d.pub_year <= 2020) {
                    return yearColor[3]
                } else {
                    return yearColor[4]
                }
            })

        const label = svg.selectAll('.label')
            .data(nodes)
            .enter().append('text')
            .attr('class', 'label')
            .attr('text-anchor', 'middle')
            .attr('dy', -10) // 이 부분을 음수 값으로 설정하여 텍스트를 상단으로 올릴 수 있음
            .style('font-size', '12px') // 텍스트의 크기를 10px로 설정 (원하는 크기로 변경)
            .text(d => (d.author_name.split(',')[0] + ", " + d.pub_year));

        // 노드 위에 마우스를 올렸을 때 hover 효과 및 노드 정보 표시
        node.on('mouseover', (event, d) => {
            setFixedNode(null)
            setSelectedNode(d);
            d3.select(event.currentTarget)
                .attr('r', (d.citation + 5) * 3 + 5) // 노드 크기를 키워 hover 효과 표시
                .style('fill', d => {
                    if (d.origin_check != 0) { // 색상 및 투명도(0.5)
                        return hoverSelectedNodeColor;
                    } else {
                        return hoverDefaultNodeColor;
                    }
                })
        });

        node.on('mouseout', (event, d) => {
            if (d !== fixedNode) {
                setSelectedNode(null);
                d3.select(event.currentTarget)
                    .attr('r', (d.citation + 5) * 3) // 노드 크기 원래대로 복원
                    .style('fill', (d) => { // 노드 색상
                        if (d.origin_check != 0) {
                            return selectedNodeColor;
                        } else if (d.pub_year >= 2000 && d.pub_year <= 2005) {
                            return yearColor[0]
                        } else if (d.pub_year > 2005 && d.pub_year <= 2010) {
                            return yearColor[1]
                        } else if (d.pub_year > 2010 && d.pub_year <= 2015) {
                            return yearColor[2]
                        } else if (d.pub_year > 2015 && d.pub_year <= 2020) {
                            return yearColor[3]
                        } else {
                            return yearColor[4]
                        }
                    })
            }
        });

        // 노드 클릭 시 고정된 노드 정보 업데이트
        node.on('click', (event, d) => {
            setFixedNode(d);
        });

        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);

            label
                .attr('x', d => d.x)
                .attr('y', d => d.y);
        });

        // 줌 이벤트 핸들러
        function zoomed(event) {
            const { transform } = event;
            svg.attr('transform', transform); // 현재 변환을 SVG에 적용

            // 현재 줌 레벨 가져오기
            const currentScale = transform.k;

            // 배율을 통해 원하는 작업을 수행할 수 있습니다.
            // 예: 노드와 연결된 요소 크기 조정
            node.attr('r', d => ((d.citation + 5) * 3) / currentScale);
            label.attr('font-size', 10 / currentScale);
        }

        console.log("초기 그래프")

    }, [fixedNode, links, nodes]);

    const addOrigin = (article_id) => {
        console.log(params.article_id + '+' + article_id)
        const newUrl = `/Detail/${params.article_id + '+' + article_id}`;
        window.open(newUrl, '_blank');
    }

    async function handleSaveNode(article_id, userEmail) {
        const selectedPaper = fixedNode || selectedNode || nodes[0];

        if (!selectedPaper || !selectedPaper.article_id) {
            console.error("유효하지 않은 논문 정보: selectedNode 또는 article_id가 없습니다.");
            // 선택한 논문 정보가 없음을 사용자에게 알릴 수 있습니다.
            return;
        }

        if (!userEmail) {
            console.error("유효하지 않은 사용자 이메일: userEmail이 없습니다.");
            alert("로그인 후 사용 가능한 서비스입니다."); // 로그인이 필요함을 알림
            // 사용자 이메일이 없음을 사용자에게 알릴 수 있습니다.
            return;
        }

        console.log("Node saved:", selectedPaper);
        console.log("User Email:", userEmail);

        // 논문 정보와 사용자 이메일을 요청 본문에 포함하여 서버에 전송
        const requestData = {
            articleId: selectedPaper.article_id,
            title_ko: selectedPaper.title_ko,
            title_en: selectedPaper.title_en,
            author_name: selectedPaper.author_name,
            author_id: selectedPaper.author_id,
            pub_year: selectedPaper.pub_year,
            journal_name: selectedPaper.journal_name,
            citation: selectedPaper.citation,
            abstract_ko: selectedPaper.abstract_ko,
            abstract_en: selectedPaper.abstract_en,
            userEmail: userEmail,
            category: selectedPaper.category,
        };
        console.log("articleid :", selectedPaper.article_id);
        console.log("userEmail:", userEmail);

        const accessToken = localStorage.getItem('accessToken');

        try {
            const response = await axios.post('/api/save/papers',
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })

            if (response.status === 201) {
                console.log('저장완료')
                alert("저장이 완료되었습니다.")
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert('이미 저장된 논문입니다.');
            } else {
                console.log(error);
            }
        }
    }

    return (
        <div style={{ fontFamily: 'MaruBuri-Regular' }}>
            <div className='Navbar'>
                <EggNavbar />
            </div>

            <div className='row mt-5'>
                {/* left-page */}
                <div className='col-md-2 mt-4'>
                    <div className={`leftPage ${isLeftPageOpen ? 'closed' : 'open'}`} style={{ width: "400px", height: "700px" }}>
                        <div className='pt-1' style={{ overflow: "scroll" }}>
                            <div className='d-flex'>
                                {/* 돋보기 이미지 */}
                                <div className='p-2 flex-fill'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="32" fill="currentColor" className="bi bi-search" viewBox="0 -3 16 16">
                                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                    </svg>
                                </div>
                                {/* 입력창 */}
                                <div className='p-2 flex-fill'>
                                    <input className='form-control me-2' type='search'
                                        autoComplete='off' spellCheck="false"
                                        role='combobox' aria-controls='matches'
                                        aria-expanded='false' aria-live='polite'
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setHighlightedText(e.target.value);
                                        }} />
                                </div>
                                {/* filter 버튼 */}
                                <div className='p-2 flex-fill'>
                                    <button className='btn btn-success' type="button" data-bs-toggle="collapse" data-bs-target="#filterBar" aria-expanded="false" aria-controls="filterBar">FILTER</button>
                                </div>
                            </div>
                            {/* 그래프 그려진 논문 리스트 */}
                            <div className='mt-2' style={{ maxHeight: '650px', overflowY: 'auto' }}>
                                {sortedNode.map((node) => {
                                    const author_group = Array.isArray(node.author2_name) ? node.author_name + ',' + node.author2_name.join(',') : node.author2_name;
                                    if (node.article_id) {
                                        const regex = new RegExp(`(${searchQuery})`, 'gi');
                                        const titleWithHighlight = node.title_ko.replace(regex, (match) => `<span class="highlighted">${match}</span>`);
                                        const authorWithHighlight = author_group.replace(regex, (match) => `<span class="highlited">${match}</span>`);
                                        const yearWithHighlight = node.pub_year.toString().replace(regex, (match) => `<span class="highlighted">${match}</span>`);
                                        const abstractWithHighlight = node.abstract_ko.replace(regex, (match) => `<span class="highlighted">${match}</span>`);
                                        const isHighlighted = node.origin_check !== 0;
                                        const articleStyle = isHighlighted ? { backgroundColor: 'rgba(163, 177, 138, 0.3)' } : {};
                                        return (
                                            <div className="articleList" key={node.article_id} style={articleStyle}>
                                                <p className='mt-3'>
                                                    <b>◼ <span dangerouslySetInnerHTML={{ __html: titleWithHighlight }}></span></b><br />
                                                    <span className='mt-2' id='left-page-author' dangerouslySetInnerHTML={{ __html: authorWithHighlight }}></span>
                                                    <span className='mt-2' id='left-page-year' dangerouslySetInnerHTML={{ __html: yearWithHighlight }}></span><br />
                                                    <span className='mt-3' id='paperbox-abs' dangerouslySetInnerHTML={{ __html: abstractWithHighlight }}></span>
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                        <button className='leftButton' onClick={toggleLeftPage}>
                            {isLeftPageOpen ? '◀' : '▶'}
                        </button>
                        <div className="bottomButtonGroup">
                            <div className="row ms-1">
                                <div className="text-center">
                                    <span className="position-relative" id="helpButton" onClick={clickHelp}>
                                        {isShowHelp && (
                                            <div className='card card-body position-absolute' id="helpModal">
                                                <p className='text-start'><strong>그래프 구성</strong></p>
                                                <hr className='mt-0' />
                                                <ul>
                                                <li className='text-start'>각 노드는 <span style={{color:'orange'}}>원본논문</span>과 관련된 학술 논문입니다.</li>
                                                    <li className='text-start'>논문들은 키워드 유사성에 따라 배치됩니다.</li>
                                                    <li className='text-start'>노드 크기는 인용 횟수를 나타냅니다.</li>
                                                    <li className='text-start'>노드 색상은 발행 연도를 나타냅니다.</li>
                                                </ul>
                                                <p>이 그래프를 통해 논문의 연관성을 시각적으로 파악할 수 있으며, 각 논문의 인용 수를 크기로 비교할 수 있습니다. </p>
                                            </div>
                                        )}
                                        <svg className='text-success' width="34" height="34" fill="currentColor" class="bi bi-question-circle" viewBox="0 0 16 16">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                                        </svg>
                                    </span>
                                    <div className='mt-2'></div> {/* 버튼 간격을 위한 div 태그 */}
                                    <span className='text-success' id="centerButton" onClick={handleResetZoom}>
                                        <svg className='text-success' width="38" height="38" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16" >
                                            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                                            <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* graph-section */}
                <div className='col-md-7'>
                    {/* filter */}
                    <div className='col-md-5 mt-4 collapse' id="filterBar" style={{ marginLeft: "12rem", zIndex: "2", position: "absolute" }}> {/* 마진 부여 수정 필요 */}
                        <div className='row g-2'>
                            <div className="col-md">
                                <input className="form-control form-control-sm" type="text" id="mainAuthor" placeholder="Main Author" onChange={handleMainAuthor} />
                            </div>
                            <div className='col-md'>
                                <input className="form-control form-control-sm" type="text" id="citationNumber" placeholder="Citation" onChange={handleCitation} />
                            </div>
                            <div className='col-md'>
                                <select class="form-select form-select-sm" id="publishYear" onChange={handlePublishYear} value={publishYear}>
                                    <option selected value={currentYear + 1000}>Publish Year</option>
                                    <option value={currentYear - 1}>최근 1년</option>
                                    <option value={currentYear - 5}>최근 5년</option>
                                    <option value={currentYear - 10}>최근 10년</option>
                                    <option value={currentYear - 20}>최근 20년</option>
                                </select>
                            </div>
                        </div>
                        <div className='row g-2 mt-2'>
                            <div className='col-md'>
                                <select class="form-select form-select-sm" id="category" onChange={handleCategory} value={category}>
                                    <option selected value="default">Category</option>
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
                            </div>
                            <div className='col-md'>
                                <select className="form-select form-select-sm" id="journalName" onChange={handleJournalName} value={journalName}>
                                    <option selected value="default">Journal Name</option>
                                    <option value="한국데이터정보과학회지">한국 데이터 정보 과학회지</option>
                                    <option value="정보과학회 컴퓨팅의 실제 논문지">정보과학회 컴퓨팅의 실제 논문지</option>
                                    <option value="정보과학회논문지">정보과학회논문지</option>
                                    <option value="정보과학회논문지 : 소프트웨어 및 응용">정보과학회논문지 : 소프트웨어 및 응용</option>
                                    <option value="정보과학회논문지 : 시스템 및 이론">정보과학회논문지 : 시스템 및 이론</option>
                                    <option value="정보과학회논문지 : 정보통신">정보과학회논문지 : 정보통신</option>
                                    <option value="정보과학회논문지 : 데이타베이스">정보과학회논문지 : 데이타베이스</option>
                                    <option value="데이타베이스연구">데이타베이스연구</option>
                                </select>
                            </div>
                            <div className='col-md'>
                                <button className='btn btn-success btm-sm' type='button' onClick={handleGraphFilter} style={{ height: "31px", display: 'flex', alignItems: 'center' }}>
                                    <span style={{ fontSize: '14px' }}>Apply</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* graph */}
                    {isLoading ? (
                        <div className="spinner-border text-success mt-5" role="status" style={{ marginLeft: "450px" }}></div>
                    ) : (
                        <div className="svg-container">
                            <div className='graph' style={{ marginLeft: "50px" }}>
                                <svg ref={svgRef} width="100%" height="100%"></svg>
                            </div>
                            <div className="publishYearBar">
                                <div className="publishYearBar-item" style={{ background: 'linear-gradient(to right, rgba(88, 129, 87, 0.3), rgba(58, 90, 64, 0.9))' }}></div>
                                <div className="publishYearBar-text-right" style={{ fontSize: '3px' }}>2000ㅤㅤㅤㅤㅤ2023</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* right-section */}
                <div className='col-md-3 mt-4 bg-white border-start' style={{ maxHeight: '700px', overflowY: 'auto' }}>
                    <div className="d-flex justify-content-center me-3">
                        {fixedNode || selectedNode ? (
                            <div className='' style={{ width: '450px' }}>
                                <h5 style={{ textAlign: 'left' }}><strong>{(fixedNode || selectedNode).title_ko}</strong></h5>
                                <a style={{ textAlign: 'left' }}>
                                    {(fixedNode || selectedNode).author_name.split(',').map((author, index) => (
                                        <button className="btn btn-outline-dark btn-sm mb-2 me-1" key={index} onClick={() => AuthorClick((fixedNode || selectedNode).author_id.split(',')[index])} style={{ cursor: 'pointer' }}>{author.trim()} </button>
                                    ))}
                                    {(fixedNode || selectedNode).author2_name.map((author, index) => (
                                        <button className="btn btn-outline-dark btn-sm mb-2 me-1" key={index} onClick={() => AuthorClick((fixedNode || selectedNode).author2_id[index])} style={{ cursor: 'pointer' }}>{author.trim()} </button>
                                    ))}
                                </a>
                                <br />
                                <a style={{ textAlign: 'left' }}>{(fixedNode || selectedNode).pub_year} {(fixedNode || selectedNode).journal_name}</a>
                                <br />
                                <a style={{ textAlign: 'left' }}>{(fixedNode || selectedNode).citation} citation</a>
                                <br />
                                <div className="d-flex mt-3 mb-3">
                                    <button className='btn btn-success btn-sm me-2' type='button' onClick={() => ClickOpenKCI((fixedNode || selectedNode).article_id)}>Open in KCI</button>
                                    <button className='btn btn-warning btn-sm me-2' type='button' onClick={() => addOrigin((fixedNode || selectedNode).article_id)}>+ Add Origin</button>
                                    <button className='btn btn-outline-danger btn-sm' type='button' onClick={() => handleSaveNode((fixedNode || selectedNode).article_id, userEmail)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmark-check-fill" viewBox="0 0 16 16">
                                            <path fillRule="evenodd"
                                                d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zm8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z" />
                                        </svg> Save
                                    </button>
                                </div>
                                <p className="abstract" style={{ textAlign: 'left' }}>{(fixedNode || selectedNode).abstract_ko}</p>
                                <hr />
                                <p>Keyword</p>
                                <p>{(fixedNode || selectedNode).keys.map((key, index) => (
                                    <button className='btn btn-primary btn-sm me-1 mt-1' style={{ backgroundColor: "#A3B18A", borderColor: "#A3B18A" }} key={index}>{key}</button>
                                ))}
                                </p>
                            </div>
                        ) : (sortedNode.length > 0 ? (
                            <div className='' style={{ width: '450px' }}>
                                <h5 style={{ textAlign: 'left' }}><strong>{sortedNode[0].title_ko}</strong></h5>
                                <a style={{ textAlign: 'left' }}>
                                    {sortedNode[0].author_name.split(',').map((author, index) => (
                                        <button className="btn btn-outline-dark btn-sm mb-2 me-1" key={index} onClick={() => AuthorClick(sortedNode[0].author_id.split(',')[index])} style={{ cursor: 'pointer' }}>
                                            {author.trim()}
                                        </button>
                                    ))}
                                    {sortedNode[0].author2_name.map((author, index) => (
                                        <button className="btn btn-outline-dark btn-sm mb-2 me-1" key={index} onClick={() => AuthorClick(sortedNode[0].author2_id[index])} style={{ cursor: 'pointer' }}>
                                            {author.trim()}
                                        </button>
                                    ))}
                                </a>
                                <br />
                                <a style={{ textAlign: 'left' }}>{sortedNode[0].pub_year} {sortedNode[0].journal_name}</a>
                                <br />
                                <a style={{ textAlign: 'left' }}>{sortedNode[0].citation} citation</a>
                                <div className="d-flex mt-3 mb-3">
                                    <button className='btn btn-success btn-sm me-2' type='button' onClick={() => ClickOpenKCI(sortedNode[0].article_id)}>Open in KCI</button>
                                    <button className='btn btn-outline-danger btn-sm' type='button' onClick={() => handleSaveNode(sortedNode[0].article_id, userEmail)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmark-check-fill" viewBox="0 0 16 16">
                                            <path fillRule="evenodd"
                                                d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zm8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z" />
                                        </svg> Save
                                    </button>
                                </div>
                                <p className="abstract" style={{ textAlign: 'left' }}>{sortedNode[0].abstract_ko}</p>
                                <hr />
                                <p>Keyword</p>
                                <p>{sortedNode[0].keys.map((key, index) => (
                                    <button className='btn btn-primary btn-sm me-1 mt-1' style={{ backgroundColor: "#A3B18A", borderColor: "#A3B18A" }} key={index}>{key}</button>
                                ))}
                                </p>
                            </div>
                        ) : null)}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Detail;