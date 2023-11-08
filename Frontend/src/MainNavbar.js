import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Modal, Dropdown, Form, Row, Col, Container, Button } from 'react-bootstrap';
import Login from './Login';
import SignUp from './SignUp';
import { useUser } from './UserContext';
import { Link } from 'react-router-dom';
import axios from './AxiosConfig';

function EggMainNavbar() {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const navigate = useNavigate();
    const { updateEmail } = useUser();

    const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem('accessToken')));
    const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');
    const [isRegistering, setIsRegistering] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [email, setEmail] = useState('');
    const [showEmailInput, setShowEmailInput] = useState(true);
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || '');
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || '');
    const [showLogoutSuccessMessage, setShowLogoutSuccessMessage] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);

    useEffect(() => {
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedUserEmail = localStorage.getItem('userEmail');
        if (storedAccessToken && storedRefreshToken) {
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
            setLoggedIn(true);
            setUserEmail(storedUserEmail);
        }
    }, []);

    const handleLoginClick = () => {
        setEmail('');
        setIsRegistering(false);
        setIsEmailValid('');
        setLoginError('');
        setShowEmailInput(false);
        setShowLoginModal(true);
    };

    const handleClose = () => {
        setShowLoginModal(false);
        setEmail('');
    };

    const handleLoginSuccess = (email, tokens) => {
        setUserEmail(email);
        setShowLoginModal(true);
        setAccessToken(tokens.accessToken);
        localStorage.setItem('accessToken', tokens.data.accessToken);
        localStorage.setItem('userEmail', email);
        setLoggedIn(true);
        updateEmail(email);
        handleClose();
    };

    const handleSignUpSuccess = (tokens) => {
        setShowLoginModal(false);
        setLoggedIn(true);
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        localStorage.setItem('userEmail', email);
        setLoggedIn(true);
        setUserEmail(email);
        updateEmail(email);
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleContinueClick = async () => {
        try {
            if (!isValidEmail(email)) {
                window.alert('Please enter a valid email address.');
                return;
            }
            const response = await axios.get(`/api/v1/users/checkEmail?email=${email}`);
            if (response.data === true) {
                setIsEmailValid(true);
                setIsRegistering(false);
                setLoginError('');
            } else {
                setIsEmailValid(false);
                setIsRegistering(true);
                setLoginError('');
            }
        } catch (error) {
            console.error('Error checking email', error);
            setLoginError('Error checking email');
        }
    };

    const handleEmailKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleContinueClick();
        }
    };

    const handleLogout = async () => {
        try {
            const response = await axios.post('/api/v1/users/logout', null, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                setShowLogoutSuccessMessage(true);
                setTimeout(() => {
                    setShowLogoutSuccessMessage(false);
                    navigate('/');
                }, 1000);
            } else {
                console.error('로그아웃 실패');
            }
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userEmail');
            setEmail('');
            setShowLoginModal(false);
            setLoggedIn(false);
            setUserEmail('');
            navigate('/');
        } catch (error) {
            console.error('로그아웃 오류', error);
        }
    };

    const handleSaveClick = () => {
        navigate('/SavePaper');
    };

    return (
        <div style={{ fontFamily: 'MaruBuri-Regular' }}>
            <nav className="navbar navbar-expand-lg" style={{backgroundColor:"#dad7cd",boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.1)"}}>
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">
                        <img src="/EGG_logo.png" alt="" width="32" height="32" className="d-inline-block align-text-top" />
                    </a>
                    <a className="navbar-brand" href="/">E G G</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                            <Nav>
                                <Nav.Link style={{ color: 'black' }} href="/Dashboard">Dashboard</Nav.Link>
                                <Nav.Link style={{ color: 'black' }} href="/About">About</Nav.Link>
                                <Nav.Link style={{ color: 'black' }} href="/Pricing">Pricing</Nav.Link>
                                <Dropdown align="end" show={showProfileMenu} onToggle={(isOpen) => setShowProfileMenu(isOpen)}>
                                    <Dropdown.Toggle variant="link" id="profile-dropdown">
                                        <svg width="24" height="24" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                                        </svg>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {loggedIn ? (
                                            <>
                                                <Dropdown.Item><span style={{ color: "gray" }}>{userEmail}</span></Dropdown.Item>
                                                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                                <Dropdown.Item onClick={handleSaveClick}>Save</Dropdown.Item>
                                                <Dropdown.Item as={Link} to="/history"> History </Dropdown.Item>
                                            </>
                                        ) : (
                                            <Dropdown.Item onClick={handleLoginClick}>Login <span style={{ color: "gray", fontSize: "medium" }}>or</span> Signup</Dropdown.Item>
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </div>

                    {showLogoutSuccessMessage && (
                        <div className="logout-popup">
                            <p>로그아웃 완료</p>
                        </div>
                    )}
                </div>
            </nav>
            <Modal show={showLoginModal} onHide={handleClose} style={{ fontFamily: 'MaruBuri-Regular' }}>
                <Modal.Header closeButton>
                    <Modal.Title>Log in <span style={{ color: "gray", fontSize: "medium" }}>or</span> Sign up</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container className="panel">
                        <Form>
                            {!isRegistering ? (
                                <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail" style={{ display: isEmailValid ? 'none' : 'block' }}>
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
                            ) : null}
                        </Form>
                        {isEmailValid ? (
                            <div>
                                <Login email={email} onLoginSuccess={handleLoginSuccess} />
                            </div>
                        ) : (
                            <div>
                                {isRegistering ? (
                                    <div>
                                        <p style={{ color: 'gray' }}>
                                            This email is not registered.<br />
                                            Please proceed with membership registration.
                                        </p>
                                        <SignUp email={email} onSignUpSuccess={handleSignUpSuccess} setShowLoginModal={setShowLoginModal} />
                                    </div>
                                ) : (
                                    <div>
                                        <br />
                                        <div className="d-grid gap-1">
                                            <Button
                                                variant="secondary"
                                                type="button"
                                                onClick={handleContinueClick}
                                                onKeyDown={handleEmailKeyPress}
                                            >
                                                Continue with Email
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </Container>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default EggMainNavbar;