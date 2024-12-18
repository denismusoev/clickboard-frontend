import React, {useEffect, useState} from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import {Navbar, Nav, Container, Button, Row, Col, Dropdown} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


function Header() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Проверяем роль пользователя из токена
        if (role) {
            try {
                if (role.includes("ADMIN")) {
                    setIsAdmin(true);
                }
            } catch (err) {
                console.error("Ошибка декодирования токена:", err);
            }
        }
    }, [role]);

    useEffect(() => {
        if (!isAdmin) { // Уведомления не нужны для админа
            const fetchNotifications = () => {
                fetch(`http://localhost:8080/api/notifications/unread`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                    .then((res) => res.json())
                    .then((data) => setNotifications(data))
                    .catch((error) => console.error("Ошибка получения уведомлений:", error));
            };

            fetchNotifications();
            const intervalId = setInterval(fetchNotifications, 5000);

            return () => clearInterval(intervalId);
        }
    }, [token, isAdmin]);

    const markAsRead = (id) => {
        fetch(`http://localhost:8080/api/notifications/read/${id}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(() => {
            setNotifications((prev) => prev.filter((note) => note.id !== id));
        });
    };

    const handleLogout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        navigate("/signin");
    };

    return (
        <Navbar style={{ backgroundColor: "#fefdfd" }} variant="light" expand="lg" className="shadow-sm">
            <Container>
                <Navbar.Brand href="/home">Сервис объявлений PostHub</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {username ? (
                            <>
                                {/* Уведомления, профиль и создание объявления только для обычных пользователей */}
                                {!isAdmin && (
                                    <>
                                        {/* Иконка уведомлений */}
                                        <Dropdown
                                            align="end"
                                            show={showNotifications}
                                            onToggle={() => setShowNotifications(!showNotifications)}
                                        >
                                            <Dropdown.Toggle
                                                variant="light"
                                                id="dropdown-notifications"
                                                className="border-0 me-3"
                                            >
                                                🔔
                                                {notifications.length > 0 && (
                                                    <span
                                                        style={{
                                                            color: "red",
                                                            fontWeight: "bold",
                                                            marginLeft: "5px"
                                                        }}
                                                    >
                    {notifications.length}
                </span>
                                                )}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu style={{ maxHeight: "300px", overflowY: "auto" }}>
                                                {notifications.length > 0 ? (
                                                    notifications.map((note) => (
                                                        <Dropdown.Item
                                                            key={note.id}
                                                            className="text-wrap"
                                                            onClick={() => markAsRead(note.id)}
                                                        >
                                                            <div>
                                                                <strong>{note.message}</strong>
                                                            </div>
                                                            <div style={{ fontSize: "12px", color: "gray" }}>
                                                                {new Date(note.createdAt).toLocaleString()}
                                                            </div>
                                                            <a
                                                                href={`/ads/${note.adId}`}
                                                                style={{ fontSize: "12px", color: "#007bff" }}
                                                            >
                                                                Перейти к объявлению
                                                            </a>
                                                        </Dropdown.Item>
                                                    ))
                                                ) : (
                                                    <Dropdown.Item disabled>Уведомлений нет</Dropdown.Item>
                                                )}
                                            </Dropdown.Menu>
                                        </Dropdown>

                                        <Button variant="success" href="/create-ad" className="me-2 border-0">
                                            Создать объявление
                                        </Button>

                                        <Button variant="outline-dark" href="/profile" className="me-2 border-0">
                                            Профиль
                                        </Button>

                                        <Button variant="outline-dark" href="/saved-ads" className="me-2 border-0">
                                            Избранное
                                        </Button>
                                    </>
                                )}
                                <Button variant="outline-danger" onClick={handleLogout} className="border-0">
                                    Выйти
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="light" href="/signin" className="me-2 border-0">
                                    Авторизация
                                </Button>
                                <Button variant="light" href="/register" className="border-0">
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
