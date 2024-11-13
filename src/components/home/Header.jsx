import React from 'react';
import { Navbar, Container, Form, FormControl, Nav, Button } from 'react-bootstrap';
import {useNavigate} from "react-router-dom";

function Header({ onLoginClick, onRegisterClick }) {
    const username = localStorage.getItem('username');
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        navigate("/");

    };
    return (
        <Navbar
            expand="lg"
            className="shadow-sm mb-5"
            style={{ background: 'linear-gradient(90deg, #ffffff, #f7f7f7)' }}
        >
            <Container fluid className="d-flex justify-content-between align-items-center">
                <Navbar.Brand
                    href="#"
                    style={{ fontSize: '1.8rem', color: '#373a40', fontWeight: 500 }}
                >
                    Доска объявлений
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse
                    id="navbarScroll"
                    className="d-flex justify-content-between align-items-center w-100"
                >
                    <Form className="d-flex" style={{ width: '500px' }}>
                        <FormControl
                            type="search"
                            placeholder="Искать объявления..."
                            style={{
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: '#f0f0f0',
                                fontSize: '1rem',
                                boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)',
                            }}
                        />
                        <Button
                            variant="outline-dark"
                            style={{
                                borderRadius: '8px',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                marginLeft: '1rem',
                            }}
                        >
                            Найти
                        </Button>
                    </Form>
                    <Nav className="d-flex align-items-center">
                        <Nav.Link
                            href="#"
                            className="me-4 text-dark"
                            style={{ fontSize: '1rem', fontWeight: '500' }}
                        >
                            Мои объявления
                        </Nav.Link>
                        <Nav.Link
                            href="#"
                            className="text-dark"
                            style={{ fontSize: '1rem', fontWeight: '500' }}
                        >
                            Профиль
                        </Nav.Link>
                        {username ? (
                            <>
                            {username}
                            <Button
                                variant="outline-primary"
                                className="me-2"
                                onClick={handleLogout}
                            >
                                Выйти
                            </Button>
                            </>
                        ) : (
                            <>
                            <Button
                                variant="outline-primary"
                                className="me-2"
                                onClick={onLoginClick}
                            >
                                Войти
                            </Button>
                            <Button
                            variant="primary"
                            onClick={onRegisterClick}
                            >
                                Регистрация
                            </Button>
                            </>
                        )
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
