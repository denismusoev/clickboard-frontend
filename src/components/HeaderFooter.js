import React from 'react';
import { Navbar, Nav, Container, Button, Row, Col } from 'react-bootstrap';

function Header() {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
            <Container>
                <Navbar.Brand href="/">
                    Сервис объявлений PostHub
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Button variant="outline-light" href="/login" className="me-2">Авторизация</Button>
                        <Button variant="light" href="/register">Регистрация</Button>
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
                        <h5>Мой Сервис</h5>
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
