import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Container, Row, Col, Spinner, Button, Pagination } from "react-bootstrap";

const ProfilePage = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0); // Текущая страница
    const [totalPages, setTotalPages] = useState(0); // Общее количество страниц

    useEffect(() => {
        fetchUserAds(currentPage);
    }, [currentPage]);

    const fetchUserAds = (page) => {
        const token = localStorage.getItem("token");
        axios
            .get(`http://localhost:8080/ads/my-ads?page=${page}&size=6`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setAds(response.data.content); // Содержимое страницы
                setTotalPages(response.data.totalPages); // Общее количество страниц
                setLoading(false);
            })
            .catch(() => {
                setError("Ошибка при загрузке ваших объявлений.");
                setLoading(false);
            });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <Spinner animation="border" variant="primary" />
                <p className="ms-3">Загрузка данных...</p>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Мои объявления</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            {!ads || ads.length === 0 ? (
                <p className="text-center">У вас пока нет объявлений.</p>
            ) : (
                <>
                    <Row>
                        {ads.map((ad) => (
                            <Col md={4} key={ad.id} className="mb-4">
                                <Card className="shadow-sm">
                                    <Card.Img
                                        variant="top"
                                        src={ad.photoUrls[0] || "placeholder.jpg"}
                                        alt={ad.title}
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                    <Card.Body>
                                        <Card.Title>{ad.title}</Card.Title>
                                        <Card.Text>
                                            <strong>Цена:</strong> {ad.price} ₽
                                        </Card.Text>
                                        <Card.Text>
                                            <strong>Статус:</strong>{" "}
                                            <span
                                                className={
                                                    ad.status === "APPROVED"
                                                        ? "text-success"
                                                        : ad.status === "PENDING"
                                                            ? "text-warning"
                                                            : "text-danger"
                                                }
                                            >
                            {ad.status === "APPROVED"
                                ? "Одобрено"
                                : ad.status === "PENDING"
                                    ? "На модерации"
                                    : ad.status === "REJECTED"
                                        ? "Отклонено"
                                        : ad.status === "ARCHIVED"
                                            ? "Архивировано"
                                            : ad.status === "BLOCKED"
                                                ? "Заблокировано"
                                                    : "Неизвестно"}
                        </span>
                                        </Card.Text>
                                        <Button variant="primary" href={`/ads/${ad.id}`}>
                                            Подробнее
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Пагинация */}
                    <Pagination className="justify-content-center">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <Pagination.Item
                                key={index}
                                active={index === currentPage}
                                onClick={() => handlePageChange(index)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </>
            )}
        </Container>
    );
};

export default ProfilePage;
