import React, { useState } from 'react';
import { Form, Button, Col, Row, InputGroup } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

function SignUp({ email: initialEmail, onSignUpSuccess, setShowLoginModal }) {
    const [email, setEmail] = useState(initialEmail || '');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [birth, setBirth] = useState(null);
    const [gender, setGender] = useState('male');
    const [formErrors, setFormErrors] = useState({});
    const [signUpError, setSignUpError] = useState(null);

    const validatePassword = () => {
        if (password !== confirmPassword) {
            setFormErrors({ confirmPassword: 'Passwords do not match' });
            return false;
        }
        if (password.length < 8 || !/\d/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            setFormErrors({ password: 'Password must be at least 8 characters long and include at least one number and one special character' });
            return false;
        }

        return true;
    };

    const handleSignUp = (e) => {
        e.preventDefault();

        if (!validatePassword()) {
            return;
        }

        if (!userName) {
            setFormErrors({ userName: 'Name Date is required' });
            return;
        }

        // Birth 필드가 비어 있는지 확인
        if (!birth) {
            setFormErrors({ birth: 'Birth Date is required' });
            return;
        }

        const userData = {
            email,
            userName,
            password,
            birth,
            gender,
        };

        axios
            .post('/api/v1/users/sign-up', userData)
            .then((response) => {
                console.log('Sign up success!');
                console.log(response.data.message);
                onSignUpSuccess(email);
                setShowLoginModal(false);
            })
            .catch((error) => {
                console.error('User registration failed:', error);
                setSignUpError('Failed to register user. Please try again.');
                setShowLoginModal(true);
            });
    };

    return (
        <div style={{ fontFamily: 'MaruBuri-Regular' }}>
            <Form onSubmit={handleSignUp}>
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isInvalid={!!formErrors.email}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        {formErrors.email}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="userName" className="mt-2">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        isInvalid={!!formErrors.userName}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        {formErrors.userName}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="password" className="mt-2">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        isInvalid={!!formErrors.password}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        {formErrors.password}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="confirmPassword" className="mt-2">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        isInvalid={!!formErrors.confirmPassword}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        {formErrors.confirmPassword}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="birth" className="mt-2 date-picker-container">
                    <Form.Label>Birth Day</Form.Label>
                    <Row>
                        <Col>
                            <InputGroup>
                                <DatePicker
                                    className="form-control custom-datepicker"
                                    selected={birth}
                                    onChange={(date) => setBirth(date)}
                                    dateFormat="yyyy-MM-dd"
                                    showYearDropdown
                                    yearDropdownItemNumber={10}
                                    minDate={new Date('1950-01-01')}
                                    maxDate={new Date()}
                                    placeholderText="YYYY-MM-DD"
                                />
                            </InputGroup>
                        </Col>
                    </Row>
                    <Form.Control.Feedback type="invalid">
                        {formErrors.birth}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="gender" className="mt-2">
                    <Form.Label>Gender</Form.Label>
                    <Row>
                        <Col>
                            <Form.Check
                                type="radio"
                                label="Male"
                                name="gender"
                                value="male"
                                checked={gender === 'male'}
                                onChange={() => setGender('male')}
                            />
                        </Col>
                        <Col>
                            <Form.Check
                                type="radio"
                                label="Female"
                                name="gender"
                                value="female"
                                checked={gender === 'female'}
                                onChange={() => setGender('female')}
                            />
                        </Col>
                    </Row>
                </Form.Group>

                <div className="d-grid gap-1 mt-3">
                    <Button variant="secondary" type="submit">
                        Sign Up
                    </Button>
                </div>

                {signUpError && (
                    <p style={{ color: 'red' }}>{signUpError}</p>
                )}
            </Form>
        </div>
    );
}

export default SignUp;
