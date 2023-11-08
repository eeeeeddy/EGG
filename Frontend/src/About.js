import React from 'react';
import EggNavbar from './Navbar';

function About() {

    return (
        <div style={{fontFamily:'MaruBuri-Regular'}}>
            <div className='Navbar'>
                <EggNavbar />
            </div>

            <div className='container mt-5'>
                <div className='row justify-content-center'>
                    <div className='col-md-8'>
                        <div className='mt-5'>
                            <p>Egg 는 연구자와 과학자들이 작업 분야와 관련된 논문을 찾고 탐색하는 데 도움을 주는 강력한 시각적 도구입니다.</p>
                            <hr />
                            {/* <p>Connected Papers is a unique, visual tool to help researchers and applied scientists find and explore papers relevant to their field of work.</p> */}
                            <h4>How does it work?</h4>
                            <ul>
                                <li>각 그래프를 생성하기 위해 약 <strong>10,000개</strong>의 논문을 분석하고, 원본 논문과 가장 강한 연결을 가진 몇 십 개의 논문을 선택합니다.</li>
                                <br/>
                                <li>그래프는 <strong>참조 논문을 바탕으로 연결성을 갖고, 논문들은 유사성</strong>에 따라 배열됩니다. 우리의 유사성 지표는 공인 및 키워드 결합의 개념에 기반합니다. 이 측정 방법에 따르면 서로 크게 중복되는 인용과 참고문헌을 가진 두 논문은 관련 주제를 다룰 가능성이 높다고 가정됩니다.</li>
                                <br/>
                                <li>알고리즘은 논문들을 <strong>시각적으로 유사한 논문들을 클러스터로 그룹화</strong>하고, 덜 유사한 논문들을 서로 멀리 밀어내도록 하는 방식으로 Force Directed Graph를 구축합니다.</li>
                                <br/>
                                <li>노드 선택 시 각 노드에서 원본 논문까지의 거리를 <strong>유사도 기반</strong>으로 연결합니다. 원본 논문과 직접적으로 연결된 논문 노드 외의 관계 또한 간선으로 표현되지만, 유사도는 특정되지 않습니다.</li>
                                <br/>
                                <li>우리는 논문 외에도 저자의 관계에도 주목했습니다. 논문처럼 유사도를 기반으로 연결성을 강조하지는 않았지만, 데이터를 바탕으로 연구자들의 커뮤니케이션 형태와 연구 기관(혹은 기업)간의 관계를 <strong>Force Directed Graph</strong>로 표현하며, <strong>Kibana</strong>의 강력한 시각화 도구를 사용한 대시보드를 제공합니다.</li>
                                <br/>
                                <li>우리의 데이터베이스는 <strong>KCI(한국 정보 과학회)</strong>에 연결되어 있습니다.</li>
                            </ul>
                            <br />
                            <h4>Our story</h4>
                            <p>Connected Papers started as a weekend side project between friends. We've been working with academic papers for years and felt a great need for better tools for science and research.</p>
                            <br />
                            <p>When we saw how much this tool improved our own literature search workflows - and got increasingly more requests from friends and colleagues to use it - we committed to release it to the public.</p>
                            <br />
                            <p>You know... for science.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default About;