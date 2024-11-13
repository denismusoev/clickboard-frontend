import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import * as APIService from '../APIService';
import MyAlert from "../MyAlert";
import validator from 'validator';

const LoginModal = ({ show, onHide, onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [errorResponse, setErrorResponse] = useState(null);
    const [successResponse, setSuccessResponse] = useState(null);
    const [showReset, setShowReset] = useState(false);
    const [email, setEmail] = useState('');

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'username':
                if (!validator.isAlphanumeric(value, 'en-US')) {
                    error = 'Логин должен содержать только английские буквы и цифры';
                }
                break;
            case 'password':
                if (
                    !validator.isStrongPassword(value, {
                        minLength: 8,
                        minLowercase: 1,
                        minUppercase: 1,
                        minNumbers: 1,
                        minSymbols: 1,
                    })
                ) {
                    error = 'Пароль должен содержать хотя бы одну заглавную, одну строчную букву, одну цифру и символ.';
                }
                break;
            default:
                break;
        }
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        if (Object.values(errors).some((error) => error)) return;

        setLoading(true);
        try {
            const response = await APIService.authenticate(formData);
            if (response.success && response.message.includes("2FA")) {
                onLoginSuccess(`/two-factor-auth/${formData.username}`);
            } else {
                localStorage.setItem('username', response.username);
                localStorage.setItem('token', response.token);
                localStorage.setItem('isChildModeEnabled', JSON.stringify(response.isChildModeEnabled));
                localStorage.setItem('isVk', JSON.stringify(response.isVk));
                onLoginSuccess('/');
            }
        } catch (error) {
            setErrorResponse(error.message);
            setShowAlert(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal show={show} onHide={onHide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Войти</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleLogin}>
                        <Form.Group controlId="formUsername" className="mb-3">
                            <Form.Control
                                type="text"
                                name="username"
                                placeholder="Логин"
                                value={formData.username}
                                onChange={handleChange}
                                isInvalid={!!errors.username}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.username}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formPassword" className="mb-3">
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Пароль"
                                value={formData.password}
                                onChange={handleChange}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100"
                            disabled={loading}
                        >
                            {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Войти'}
                        </Button>
                        <Button
                            variant="link"
                            onClick={() => setShowReset(true)}
                            className="w-100 mt-3 text-decoration-none"
                        >
                            Забыли пароль?
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <MyAlert
                show={showAlert}
                variant={successResponse ? 'success' : 'danger'}
                handleHide={() => setShowAlert(false)}
                message={successResponse || errorResponse}
                header="Уведомление"
            />
        </>
    );
};

export default LoginModal;
