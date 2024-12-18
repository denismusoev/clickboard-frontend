import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import {useNavigate} from "react-router-dom";

function Signin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/authenticate', formData);
            localStorage.setItem('token', response.data.token); // Сохранение токена
            localStorage.setItem('username', response.data.username); // Сохранение токена
            localStorage.setItem('role', response.data.role); // Сохранение токена
            navigate("/home");
            setMessage('Авторизация прошла успешно!');
            setError(false);
        } catch (error) {
            setMessage(error.response.data.message || 'Ошибка при авторизации');
            setError(true);
        }
    };

    return (
        <Container>
            <h2 className="my-4">Авторизация</h2>
            {message && <Alert variant={error ? 'danger' : 'success'}>{message}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username">
                    <Form.Label>Логин</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                    Войти
                </Button>
            </Form>
        </Container>
    );
}

export default Signin;
