import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Signin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateFields = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Введите ваш логин';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Введите ваш пароль';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateFields();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({}); // Очистим ошибки, если они были

        try {
            const response = await axios.post('http://localhost:8080/authenticate', formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('role', response.data.role);
            navigate("/home");
            setMessage('Авторизация прошла успешно!');
            setError(false);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Ошибка при авторизации');
            setError(true);
        }
    };

    return (
        <Container>
            <h2 className="my-4">Авторизация</h2>
            {message && <Alert variant={error ? 'danger' : 'success'}>{message}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username" className="mb-3">
                    <Form.Label>Логин</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        isInvalid={!!errors.username}
                    />
                    {errors.username && <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>}
                </Form.Group>
                <Form.Group controlId="password" className="mb-3">
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                    />
                    {errors.password && <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>}
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                    Войти
                </Button>
            </Form>
        </Container>
    );
}

export default Signin;
