import React from 'react';
import { Navbar, Nav, Container, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('token'); // Удаление токена при выходе
        navigate('/signin'); // Перенаправление на страницу авторизации
    };

    return (
        <Navbar style={{ backgroundColor: "#fefdfd" }} variant="light" expand="lg" className="shadow-sm">
            <Container>
                <Navbar.Brand href="/home">
                    Сервис объявлений PostHub
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {username ? (
                            <>
                                <Button
                                    variant="outline-dark"
                                    href="/profile"
                                    className="me-2 border-0"
                                >
                                    Профиль
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    onClick={handleLogout}
                                    className="border-0"
                                >
                                    Выйти
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="light"
                                    href="/signin"
                                    className="me-2 border-0"
                                >
                                    Авторизация
                                </Button>
                                <Button
                                    variant="light"
                                    href="/register"
                                    className="border-0"
                                >
                                    Регистрация
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

function Footer() {
    return (
        <footer className="bg-dark text-white mt-5">
            <Container>
                <Row className="py-4">
                    <Col md={6} className="text-center text-md-start">
                        <h5>PostHub</h5>
                        <p>© {new Date().getFullYear()} Все права защищены.</p>
                    </Col>
                    <Col md={6} className="text-center text-md-end">
                        <Nav>
                            <Nav.Link href="/terms" className="text-white">Условия использования</Nav.Link>
                            <Nav.Link href="/privacy" className="text-white">Политика конфиденциальности</Nav.Link>
                        </Nav>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export { Header, Footer };
