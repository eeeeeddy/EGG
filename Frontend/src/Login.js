import React, { useState } from 'react';
import { Form, Row, Col, Container, Button } from 'react-bootstrap';
import axios from 'axios';

function Login(props) {
    const { email: initialEmail } = props;
    const [email, setEmail] = useState(props.email || '');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleLoginClick = async () => {
        try {
            if (!email || !password) {
                setLoginError('Email and password are required.'); // 이메일과 비밀번호 필수 입력 항목입니다.
                return; // 이메일 또는 비밀번호가 누락된 경우 로그인 중지
            }
            // 서버로 로그인 요청을 보냄
            const response = await axios.post('/api/v1/users/login', {
                email,
                password,
            });

            // 여기에서 로그인 성공 여부를 확인
            if (response.status === 200) {
                console.log(response.data.message);
                // 로그인 성공 시 부모 컴포넌트로 이메일과 비밀번호 전달

                localStorage.setItem('accessToken', response.data.accessToken)
                props.onLoginSuccess(email, response.data, password);
            } else {
                // 서버 응답이 성공(200 OK)이 아닌 경우 오류 메시지 표시
                setLoginError('Invalid email or password');
            }

        } catch (error) {
            console.error('Error logging in', error);
            if (error.response && error.response.status === 400) {
                // 서버에서 400 Bad Request를 반환하는 경우 (잘못된 이메일 또는 비밀번호)
                setLoginError('Invalid email or password'); // 오류 메시지 설정
            } else if (error.response && error.response.status === 404) {
                // 서버에서 404 Not Found를 반환하는 경우 (등록되지 않은 이메일)
                setLoginError('Email not found. Please check your email.'); // 다른 오류 메시지 설정
            } else if (error.response && error.response.status === 401) {
                // 서버에서 401 Unauthorized를 반환하는 경우 (비밀번호가 일치하지 않음)
                setLoginError('Invalid email or password'); // 오류 메시지 설정
            } else {
                // 다른 모든 오류
                console.log('Unknown error');
                setLoginError('An unknown error occurred. Please try again later.');
            }
            setPassword('');
        };
    };

    const handleEmailKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Enter 키의 기본 동작(새 줄 추가)을 방지합니다.
            handleLoginClick(); // "Continue with Email" 버튼을 클릭합니다.
        }
    };

    return (
        <div style={{ fontFamily: 'MaruBuri-Regular' }}>
            <Container className="panel">
                <Form>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                        <Col sm>
                            <Form.Control
                                type="email"
                                placeholder="E-mail"
                                onChange={handleEmailChange}
                                onKeyDown={handleEmailKeyPress}
                                value={email}
                            />
                        </Col>
                    </Form.Group>
                    <div>
                        <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                            <Col sm>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    onChange={handlePasswordChange}
                                    onKeyDown={handleEmailKeyPress}
                                    value={password}
                                />
                            </Col>
                        </Form.Group>
                        <br />
                        <div className="d-grid gap-1">
                            <Button
                                variant="secondary"
                                type="button"
                                onClick={handleLoginClick}
                                onKeyDown={handleEmailKeyPress}
                            >
                                Login
                            </Button>
                        </div>
                        {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
                    </div>
                </Form>
            </Container>
        </div>
    );
}

export default Login;