import React, { useState } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import validator from 'validator';
import MyAlert from '../MyAlert';
import * as APIService from '../APIService';

const RegisterModal = ({ show, onHide, onRegisterSuccess }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        patronymic: '',
        username: '',
        password: '',
        email: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [errorResponse, setErrorResponse] = useState(null);

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'username':
                if (!validator.isAlphanumeric(value, 'en-US')) {
                    error = 'Логин должен содержать только английские буквы и цифры';
                }
                break;
            case 'password':
                if (!validator.isStrongPassword(value, {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1
                })) {
                    error = 'Пароль должен быть длиннее 8 символов и содержать хотя бы одну заглавную букву, одну строчную букву, одну цифру и один специальный символ';
                }
                break;
            case 'firstName':
            case 'lastName':
                if (!validator.matches(value, /^[A-Za-zА-Яа-яЁё\s-]+$/)) {
                    error = 'Должно содержать только буквы';
                }
                break;
            case 'email':
                if (!validator.isEmail(value)) {
                    error = 'Некорректный email';
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (Object.values(errors).some((err) => err)) return;

        setLoading(true);
        try {
            console.log(formData);
            const response = await APIService.register(formData);
            if (response.success) {
                onRegisterSuccess();
                onHide();
                console.log(response);
            } else {
                setErrorResponse(response.message);
                setShowAlert(true);
                console.log(response);
            }
        } catch (error) {
            setErrorResponse(error.message);
            setShowAlert(true);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal show={show} onHide={onHide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Регистрация</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formFirstName" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Имя"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                isInvalid={!!errors.firstName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.firstName}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formLastName" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Фамилия"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                isInvalid={!!errors.lastName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.lastName}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formPatronymic" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Отчество (необязательно)"
                                name="patronymic"
                                value={formData.patronymic}
                                onChange={handleChange}
                                isInvalid={!!errors.patronymic}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.patronymic}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formUsername" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Логин"
                                name="username"
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
                                placeholder="Пароль"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formEmail" className="mb-3">
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100"
                            disabled={loading || Object.values(errors).some((err) => err)}
                        >
                            {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Зарегистрироваться'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <MyAlert
                show={showAlert}
                variant="danger"
                handleHide={() => setShowAlert(false)}
                message={errorResponse}
                header="Уведомление"
            />
        </>
    );
};

export default RegisterModal;
