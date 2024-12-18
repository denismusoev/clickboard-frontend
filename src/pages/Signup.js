import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        email: '',
        phone: ''
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateFields = () => {
        const newErrors = {};

        if (!formData.firstname.trim()) {
            newErrors.firstname = 'Введите ваше имя';
        }
        if (!formData.lastname.trim()) {
            newErrors.lastname = 'Введите вашу фамилию';
        }
        if (!formData.username.trim()) {
            newErrors.username = 'Введите ваш логин';
        }
        if (!formData.password.trim()) {
            newErrors.password = 'Введите пароль';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Введите ваш email';
        } else {
            // Простая проверка email-формата
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Некорректный формат email';
            }
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Введите ваш телефон';
        } else {
            // Простая проверка, что в телефоне только цифры и/или "+" и минимум 7 символов
            const phoneRegex = /^[+]?[\d\s-]{7,}$/;
            if (!phoneRegex.test(formData.phone)) {
                newErrors.phone = 'Некорректный формат телефона';
            }
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
            const response = await axios.post('http://localhost:8080/register', formData);
            setMessage(response.data.message);
            setError(false);
            navigate("/signin");
        } catch (err) {
            setMessage(err.response?.data?.message || 'Ошибка при регистрации');
            setError(true);
        }
    };

    return (
        <Container>
            <h2 className="my-4">Регистрация</h2>
            {message && <Alert variant={error ? 'danger' : 'success'}>{message}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="firstname" className="mb-3">
                    <Form.Label>Имя</Form.Label>
                    <Form.Control
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        isInvalid={!!errors.firstname}
                    />
                    {errors.firstname && <Form.Control.Feedback type="invalid">{errors.firstname}</Form.Control.Feedback>}
                </Form.Group>

                <Form.Group controlId="lastname" className="mb-3">
                    <Form.Label>Фамилия</Form.Label>
                    <Form.Control
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        isInvalid={!!errors.lastname}
                    />
                    {errors.lastname && <Form.Control.Feedback type="invalid">{errors.lastname}</Form.Control.Feedback>}
                </Form.Group>

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

                <Form.Group controlId="email" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                    />
                    {errors.email && <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>}
                </Form.Group>

                <Form.Group controlId="phone" className="mb-3">
                    <Form.Label>Телефон</Form.Label>
                    <Form.Control
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        isInvalid={!!errors.phone}
                    />
                    {errors.phone && <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>}
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                    Зарегистрироваться
                </Button>
            </Form>
        </Container>
    );
}

export default Signup;
