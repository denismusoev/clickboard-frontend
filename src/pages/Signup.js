import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import {useNavigate} from "react-router-dom";

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/register', formData);
            setMessage(response.data.message);
            navigate("/signin");
            setError(false);
        } catch (error) {
            setMessage(error.response.data.message || 'Ошибка при регистрации');
            setError(true);
        }
    };

    return (
        <Container>
            <h2 className="my-4">Регистрация</h2>
            {message && <Alert variant={error ? 'danger' : 'success'}>{message}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="firstname">
                    <Form.Label>Имя</Form.Label>
                    <Form.Control
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="lastname">
                    <Form.Label>Фамилия</Form.Label>
                    <Form.Control
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
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
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="phone">
                    <Form.Label>Телефон</Form.Label>
                    <Form.Control
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                    Зарегистрироваться
                </Button>
            </Form>
        </Container>
    );
}

export default Signup;
