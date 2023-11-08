import './css/Author.css'
import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import EggNavbar from './Navbar';
import * as d3 from 'd3';
import Chart from 'chart.js/auto';

function Author() {
    const [isLoading, setIsLoading] = useState(true);
    const contentToExportRef = useRef(null);
    const params = useParams();
    const navigate = useNavigate();
    const svgRef = useRef(null);
    const [selectedNode, setSelectedNode] = useState(null); // 선택한 노드 정보를 저장할 상태 변수
    const [fixedNode, setFixedNode] = useState(null); // 고정된 노드 정보를 저장할 상태 변수
    const [authorData, setAuthorData] = useState(null);
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);
    const [authorNode, setAuthorNode] = useState([]); // 저자 노드 선언
    const [pubYear, setPubYear] = useState([]);
    const pubYearCount = pubYear.reduce((count, year) => {
        count[year] = (count[year] || 0) + 1;
        return count;
    }, {});
    const [category, setCategory] = useState([]);
    const categoryCount = category.reduce((count, category) => {
        count[category] = (count[category] || 0) + 1;
        return count;
    }, {});

    // 그래프 색상 관련 변수
    const defaultEdgeColor = 'rgba(0, 0, 0, 0.2)';
    const defaultNodeColor = 'rgba(88, 129, 87, 0.7)';
    const selectedNodeColor = 'rgba(255, 159, 28, 0.8)';
    const hoverDefaultNodeColor = 'rgba(8, 28, 21, 0.8)';
    const hoverSelectedNodeColor = 'rgba(232, 93, 4, 0.8)';

    const pubYearLabels = Object.keys(pubYearCount);
    const pubYearData = Object.values(pubYearCount);

    const categoryLabels = Object.keys(categoryCount);
    const categoryData = Object.values(categoryCount);

    let pubYearBarChartData = {
        labels: pubYearLabels,
        datasets: [{
            label: 'Publication',
            data: pubYearData,
            backgroundColor: '#588157', // 막대 색상
        }],
    };

    let categoryBarChartData = {
        labels: categoryLabels,
        datasets: [{
            label: 'Category',
            data: categoryData,
            backgroundColor: '#588157', // 막대 색상
        }],
    };

    // 발행연도 막대그래프 참조
    const pubYearChartJsCanvasRef = useRef(null);
    let pubYearChartJsChart;

    // 발행연도 막대그래프 참조
    const categoryChartJsCanvasRef = useRef(null);
    let categoryChartJsChart;

    const baseURL1 = 'http://3.35.150.101:5601/app/dashboards#/view/6ab7fe60-6ca9-11ee-bcc4-15d4aa6898f0?embed=true&';
    const baseURL2 = 'http://3.35.150.101:5601/app/dashboards#/view/3b73c950-6cad-11ee-bcc4-15d4aa6898f0?embed=true&';

    // 동적으로 입력값을 사용하여 URL을 생성
    const kibanaDashboardURL1 = `${baseURL1}_g=(filters:!(('$state':(store:globalState),meta:(alias:!n,disabled:!f,index:'0c7b2e20-6caf-11ee-bcc4-15d4aa6898f0',key:author1ID,negate:!f,params:(query:${params.authorId}),type:phrase),query:(match_phrase:(author1ID:${params.authorId})))),refreshInterval:(pause:!t,value:0),time:(from:now-15m,to:now))`;
    const kibanaDashboardURL2 = `${baseURL2}_g=(filters:!(('$state':(store:globalState),meta:(alias:!n,disabled:!f,index:'0c7b2e20-6caf-11ee-bcc4-15d4aa6898f0',key:author2IDs,negate:!f,params:(query:${params.authorId}),type:phrase),query:(match_phrase:(author2IDs:${params.authorId})))),refreshInterval:(pause:!t,value:0),time:(from:now-15m,to:now))`;

    useEffect(() => {
        // URL 파라미터로부터 검색어를 가져옵니다.
        const { authorQuery } = params;

        if (authorQuery === 'loading') {
            setIsLoading(true);
            return;
        }
        setIsLoading(true);

        // Fast API 엔드포인트에 GET 요청을 보냅니다.
        axios.get(`http://15.165.247.85/Author/${params.authorId}`)
            .then((response) => {
                setIsLoading(false);
                console.log("서버에서 받아온 결과", response.data);

                const temp = response.data
                setAuthorData(temp)

                const temp1 = response.data.nodes
                setNodes(temp1)

                const temp2 = response.data.links
                setLinks(temp2)

                const temp3 = response.data.nodes.find(node => node.authorID === params.authorId);
                setAuthorNode(temp3)

                const temp4 = temp3.pubYears
                setPubYear(temp4)

                const temp5 = temp3.category
                setCategory(temp5)
            })
            .catch((error) => {
                setIsLoading(false);
                console.log('API 요청 중 오류 발생:', error);
            });
    }, [params.authorId]);

    // 발행연도 막대그래프 생성
    const createPubYearChartJsGraph = () => {
        // pubYearChartJsCanvasRef.current가 null이 아닌지 확인
        if (pubYearChartJsCanvasRef.current) {
            // 캔버스 요소를 가져와서 그래프 생성
            const pubYearChartJsChart = new Chart(pubYearChartJsCanvasRef.current, {
                type: 'bar',
                data: pubYearBarChartData,
            });
        }
    };

    useEffect(() => {
        createPubYearChartJsGraph();
    }, [pubYear]); // Chart.js 그래프 생성

    const createCategoryChartJsGraph = () => {
        // categoryChartJsCanvasRef.current가 null이 아닌지 확인
        if (categoryChartJsCanvasRef.current) {
            // 캔버스 요소를 가져와서 그래프 생성
            const categoryChartJsChart = new Chart(categoryChartJsCanvasRef.current, {
                type: 'bar',
                data: categoryBarChartData,
            });
        }
    };

    useEffect(() => {
        createCategoryChartJsGraph();
    }, [category]); // Chart.js 그래프 생성


    const handleExportToPDF = () => {
        const elementToExport = contentToExportRef.current;
        const pdf = new jsPDF('1', 'mm', [210, 297]);

        // 첫 번째 페이지 캡처
        html2canvas(elementToExport, {
            scale: 1,
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            // pdf.addImage(imgData, 'PNG', 10, 10, 0, 289);
            const pageWidth = pdf.internal.pageSize.getWidth(); // 페이지 폭
            const pageHeight = pdf.internal.pageSize.getHeight(); // 페이지 높이

            const imgWidth = canvas.width * (pageHeight / canvas.height); // 이미지의 폭을 조정하여 세로 부분이 페이지에 맞게 표시
            const imgHeight = pageHeight; // 페이지 높이와 일치

            const xPos = (pageWidth - imgWidth) / 2; // 수평 가운데 정렬
            const yPos = 0; // 페이지 상단에 위치

            pdf.addImage(imgData, 'PNG', xPos, yPos, imgWidth, imgHeight);

            // 두 번째 페이지 추가
            pdf.addPage();
            // 두 번째 페이지에 추가할 HTML 요소 캡처
            const elementToExport2 = document.getElementById('element2');

            if (elementToExport2) {
                html2canvas(elementToExport2, {
                    scale: 1,
                }).then((canvas2) => {
                    const imgData2 = canvas2.toDataURL('image/png');
                    pdf.addImage(imgData2, 'PNG', 3, 8, 210, 0);

                    // PDF 저장
                    pdf.save('exported-content.pdf');
                });
            } else {
                // elementToExport2가 존재하지 않을 때 오류 처리
                console.error('HTML element with id "element2" not found.');
            }
        });
    };

    // graph 생성
    useEffect(() => {
        const width = 900;
        const height = 1000;
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
            .force('link', d3.forceLink(links).distance(d => d.distance)) // 노드끼리 연결된 간선 길이
            .force('charge', d3.forceManyBody().strength(-2500)) // 그래프 퍼진 정도
            .force('center', d3.forceCenter(width / 2, height / 3))
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
            .attr('r', d => d.scaled_impactfactor) // 노드 크기
            .style('fill', (d) => { // 노드 색상
                if (d.authorID == authorNode.authorID) {
                    return selectedNodeColor;
                } else {
                    return defaultNodeColor
                }
            })

        const label = svg.selectAll('.label')
            .data(nodes)
            .enter().append('text')
            .attr('class', 'label')
            .attr('text-anchor', 'middle')
            .attr('dy', -10) // 이 부분을 음수 값으로 설정하여 텍스트를 상단으로 올릴 수 있음
            .style('font-size', '12px') // 텍스트의 크기를 10px로 설정 (원하는 크기로 변경)
            .text(d => (d.author1Name.split(',')[0] + ", " + d.author1Inst));

        // 노드 위에 마우스를 올렸을 때 hover 효과 및 노드 정보 표시
        node.on('mouseover', (event, d) => {
            setSelectedNode(d);
            d3.select(event.currentTarget)
                .attr('r', d.scaled_impactfactor + 5) // 노드 크기를 키워 hover 효과 표시
                .style('fill', d => {
                    if (d.authorID == authorNode.authorID) {
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
                    .attr('r', d.scaled_impactfactor) // 노드 크기 원래대로 복원
                    .style('fill', d => {
                        if (d.authorID == authorNode.authorID) {
                            return selectedNodeColor
                        } else {
                            return defaultNodeColor
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
            node.attr('r', d => ((d.scaled_impactfactor) / currentScale));
            label.attr('font-size', 10 / currentScale);
        }

    }, [links, nodes]);

    const ClickOpenKCI = (author_id) => {
        const kciUrl = `https://www.kci.go.kr/kciportal/po/citationindex/poCretDetail.kci?citationBean.cretId=` + author_id

        // 새 창으로 KCI 링크 열기
        window.open(kciUrl);
    }

    const ClickOpenKCI2 = (article_id) => {
        const kciUrl = `https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=` + article_id;

        // 새 창으로 KCI 링크 열기
        window.open(kciUrl);
    }

    const ClickOpenDashboard = (author_id) => {
        navigate(`/AuthorDashboard/${author_id}`);
    }

    function handleMouseEnter(event, index) {
        const button = event.target;
        button.style.color = 'orange'; // 마우스를 가져다 댔을 때 원하는 색상(예: 빨간색)으로 변경
    }

    function handleMouseLeave(event, index) {
        const button = event.target;
        button.style.color = 'black'; // 마우스가 벗어났을 때 원래 색상(파란색)으로 변경
    }

    const handleResetZoom = () => {
        // svg 요소를 선택하고 zoom 객체를 사용하여 초기 상태로 리셋
        d3.select(svgRef.current)
            .transition()
            .duration(750)
            .attr("transform", d3.zoomIdentity);
    }

    const [isShowHelp, setIsShowHelp] = useState(false);
    const clickHelp = () => {
        setIsShowHelp(!isShowHelp)
    }

    return (
        <div className="authorBody" style={{ fontFamily: 'MaruBuri-Regular', Height:'90vh', maxWidth:'100%' }}>
            <div className='Navbar' style={{ maxWidth:'100%', position:'fixed', zIndex: 7 }}>
                <EggNavbar />
            </div>

            <div className='row mt-5' id='body' style={{backgroundColor:'white'}}>
                {/* left section */}
                <div className='col-md-4 mt-4 border-end pl-5 pr-5' style={{ maxHeight: '90vh', overflowY: 'auto', maxWidth:'100%', backgroundColor:'white', position:'relative', zIndex:3}}>
                    <div className="ms-3" style={{ overflow: 'scroll'}}>
                        <button className='btn btn-success btn-sm ms-1' onClick={handleExportToPDF}>Export to PDF</button>
                        <button className='btn btn-success btn-sm ms-1' onClick={() => ClickOpenKCI(params.authorId)}>Open KCI</button>
                        <hr />
                        {isLoading ? (
                            <div className="spinner-border text-success" role="status"></div>
                        ) : (
                            // contentToExportRef에 ref를 추가하여 내용을 참조
                            <div className='contentToExport' ref={contentToExportRef}>
                                <h2>{authorNode.author1Name}</h2>
                                <a>{authorNode.author1Inst}</a>
                                <br />
                                <a>Total Cited: {authorNode.impactfactor}</a>
                                <br />
                                <a>Average Cited: {authorNode.articleIDs.length === 0 ? 0 : (authorNode.impactfactor / authorNode.articleIDs.length).toFixed(2)}</a>
                                <br />
                                <a>H-Index: {authorNode.H_index}</a>
                                <br />
                                <a>Total Paper: {authorNode.articleIDs.length}</a>
                                <hr />
                                <h5>Articles</h5>
                                <p>
                                    {[...new Set(authorNode.titleKor)].map((title, index) => {
                                        const articleIndex = authorNode.titleKor.indexOf(title);
                                        const articleId = authorNode.articleIDs[articleIndex];
                                        return (
                                            <React.Fragment key={index}>
                                                <span
                                                    className='btn btn-link'
                                                    style={{ padding: 0, margin: 0, fontSize: 'inherit', color: 'black', textDecoration: 'none', textAlign: 'left' }}
                                                    onMouseEnter={(e) => handleMouseEnter(e, index)}
                                                    onMouseLeave={(e) => handleMouseLeave(e, index)}
                                                    onClick={() => ClickOpenKCI2(articleId)}
                                                >
                                                    • {title}
                                                </span>
                                                {index < authorNode.titleKor.length - 1 && <br />}
                                            </React.Fragment>
                                        );
                                    })}
                                </p>
                                <hr />
                                <h5>Word Cloud</h5>
                                <p>
                                    {[...new Set(authorNode.word_cloud)].map((word, index) => (
                                        <button className='btn btn-primary btn-sm me-1 mt-1' style={{ backgroundColor: "#A3B18A", borderColor: "#A3B18A" }} key={index}>{word}</button>
                                    ))}
                                </p>
                                <hr />
                                <h5>Publish Year</h5>
                                <canvas ref={pubYearChartJsCanvasRef} style={{ maxWidth: '100vh' }}></canvas>
                                <hr />
                                <h5>Category</h5>
                                <canvas ref={categoryChartJsCanvasRef} style={{ maxWidth: '100vh' }}></canvas>
                                <hr />
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-md-8 mt-4" style={{ maxHeight:'80vh', maxWidth:'100%' }}>
                    <ul className="nav nav-tabs" id="myTab" role="tablist" style={{ position:'relative' , zIndex:5, backgroundColor:'white' }}>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="graph-tab" data-bs-toggle="tab" data-bs-target="#graph" type="button" role="tab" aria-controls="graph" aria-selected="true">Graph</button>
                        </li>
                        <li className="nav-item" role="presentation" >
                            <button className="nav-link" id="dashboard-tab" data-bs-toggle="tab" data-bs-target="#dashboard" type="button" role="tab" aria-controls="dashboard" aria-selected="false">Dashboard</button>
                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent"style={{ maxheight:'100%', width:'100%' }}>
                        <div className="tab-pane fade show active" id="graph" role="tabpanel" 
                        aria-labelledby="graph-tab" >
                            {isLoading ? (
                                    <div className="spinner-border text-success mt-5" role="status" style={{ marginLeft: "450px" }}></div>
                                ) : (
                                    <svg style={{ marginTop:0, position:'fixed', zIndex:0, height:'85vh', width:'100%' }} ref={svgRef}></svg>
                                )}
                            <div className="text-center" style={{ position: 'absolute', zIndex: 5, left: 0, bottom: 0, right: 420 ,top:700 }}>
                                <span className="position-relative" id="helpButton2" onClick={ clickHelp }>
                                    {isShowHelp && (
                                        <div className='card card-body position-absolute' id="helpModal" style={{ height:210, width:400, paddingLeft:'5px' }}>
                                            <p className='text-start'style={{paddingLeft:'15px'}}><strong>저자 그래프 구성</strong></p>
                                            <hr className='mt-0 ms-1' />
                                            <ul>
                                            <li className='text-start' >각 노드는 <strong style={{color:'orange'}}>선택한 저자</strong>와 함께 작업한 이력이 있는 다른 저자들의 정보를 나타냅니다.</li>
                                                <li className='text-start'>노드의 크기는 해당 저자의 영향력 지수를 나타냅니다.</li>
                                            </ul>
                                            <p>이 그래프를 통해 선택한 저자와의 협력 관계를 시각적으로 파악할 수 있으며, 각 저자의 영향력을 크기로 비교할 수 있습니다. </p>
                                        </div>
                                    )}
                                    <svg className='text-success' width="34" height="34" fill="currentColor" class="bi bi-question-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                        <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                                    </svg>
                                </span><br/>
                                <div style={{ marginTop:5 }}></div>
                                <span className='text-success' id="centerButton2" onClick={handleResetZoom} style={{ paddingBottom:'20px', paddingRight:'10px' }}>
                                    <svg className='text-success' width="34" height="34" fill="currentColor" class="bi bi-question-circle" viewBox="0 0 16 16" >
                                        <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                                        <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="dashboard" role="tabpanel" aria-labelledby="dashboard-tab">
                            <div className="main">
                                <iframe
                                    src={kibanaDashboardURL1}
                                    width="100%"
                                    height="400px"
                                    title="Kibana Dashboard"
                                ></iframe>
                                <iframe
                                    src={kibanaDashboardURL2}
                                    width="100%"
                                    height="400px"
                                    title="Kibana Dashboard"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Author;