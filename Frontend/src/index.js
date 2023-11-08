import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import reportWebVitals from './umm/reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // 부트스트랩의 JavaScript 파일을 로드
import { UserProvider } from './UserContext'; // UserProvider를 import


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode> // 페이지가 두 번씩 렌더링되서 주석처리함.
    <UserProvider> {/* UserProvider로 App을 감싸기 */}
      <App />
    </UserProvider>
    // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();