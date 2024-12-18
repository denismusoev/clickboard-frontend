import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Card, Container, Row, Col, ProgressBar, Spinner, Button, ListGroup } from 'react-bootstrap';

function AdDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ad, setAd] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAd();
    }, []);

    const fetchAd = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/ads/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setAd(response.data);
        } catch {
            setError('Доступ запрещен или объявление не найдено.');
        }
    };

    const archiveAd = async () => {
        try {
            await axios.put(`http://localhost:8080/ads/${id}/archive`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            alert('Объявление успешно переведено в архив.');
            fetchAd(); // Обновляем данные объявления после архивации
        } catch (err) {
            console.error('Ошибка при архивации объявления:', err);
            alert('Не удалось перевести объявление в архив.');
        }
    };

    const toggleSavedAd = async () => {
        try {
            const url = ad.isSaved
                ? `http://localhost:8080/api/saved-ads/${ad.id}`
                : `http://localhost:8080/api/saved-ads/${ad.id}`;
            const method = ad.isSaved ? 'DELETE' : 'POST';

            await axios({
                method,
                url,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setAd((prev) => ({
                ...prev,
                isSaved: !prev.isSaved,
            }));
        } catch (err) {
            console.error('Ошибка при изменении статуса избранного:', err);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'warning';
            case 'APPROVED':
                return 'success';
            case 'REJECTED':
                return 'danger';
            case 'ARCHIVED':
                return 'secondary';
            default:
                return 'dark';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING':
                return 'На модерации';
            case 'APPROVED':
                return 'Одобрено';
            case 'REJECTED':
                return 'Отклонено';
            case 'ARCHIVED':
                return 'В архиве';
            default:
                return 'Неизвестный статус';
        }
    };

    if (error) {
        return <div className="container mt-5"><h1>{error}</h1></div>;
    }

    if (!ad) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <Spinner animation="border" variant="primary" />
                <p className="ms-3">Загрузка данных...</p>
            </Container>
        );
    }

    const sliderSettings = {
        dots: ad.photoUrls.length > 1,
        infinite: ad.photoUrls.length > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: ad.photoUrls.length > 1,
    };

    return (
        <Container className="my-4">
            <Row>
                <Col md={12}>
                    <h1 className="mb-4">{ad.title}</h1>
                    <p className="text-muted">Категория: <span className="fw-bold">{ad.categoryName}</span></p>
                </Col>
                <Col md={8}>
                    <Card className="mb-4">
                        {ad.photoUrls && ad.photoUrls.length > 0 ? (
                            <Slider {...sliderSettings}>
                                {ad.photoUrls.map((url, index) => (
                                    <div key={index}>
                                        <img
                                            src={url}
                                            alt={`Фото ${index + 1}`}
                                            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                        />
                                    </div>
                                ))}
                            </Slider>
                        ) : (
                            <Card.Img
                                variant="top"
                                src="placeholder.jpg"
                                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                            />
                        )}
                    </Card>

                    <h4>Характеристики</h4>
                    <ListGroup>
                        {Object.entries(ad.attributes).map(([key, value]) => (
                            <ListGroup.Item key={key} className="d-flex justify-content-between">
                                <span>{key}:</span>
                                <span>{value}</span>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card className="mb-4 border-0 shadow-sm">
                        <Card.Body>
                            <h2 className="text-success">{ad.price} ₽</h2>
                            {!localStorage.getItem("role").includes('ADMIN') && (
                                <>
                                    {ad.ownedByCurrentUser ? (
                                        <>
                                            {ad.status === 'APPROVED' ? (
                                                <>
                                                    <Button
                                                        variant="danger"
                                                        className="w-100 mb-2"
                                                        onClick={archiveAd}
                                                    >
                                                        Перевести в архив
                                                    </Button>
                                                    {/*<Button*/}
                                                    {/*    variant="info"*/}
                                                    {/*    className="w-100 mb-2"*/}
                                                    {/*    onClick={() => navigate(`/edit-ad/${ad.id}`)}*/}
                                                    {/*>*/}
                                                    {/*    Редактировать*/}
                                                    {/*</Button>*/}
                                                </>
                                                ) : null}
                                            <div className="text-center mt-2">
                                                <ProgressBar
                                                    now={100}
                                                    label={getStatusText(ad.status)}
                                                    variant={getStatusColor(ad.status)}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <Button
                                            variant={ad.isSaved ? "secondary" : "primary"}
                                            className="w-100"
                                            onClick={toggleSavedAd}
                                        >
                                            {ad.isSaved ? "Удалить из избранного" : "Добавить в избранное"}
                                        </Button>
                                    )}
                                </>
                            )}
                        </Card.Body>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <h5>Контакт продавца</h5>
                            <p><strong>Имя:</strong> {`${ad.sellerFirstName} ${ad.sellerLastName}` || 'Не указано'}</p>
                            <p><strong>Телефон:</strong> {ad.sellerPhone || 'Не указан'}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AdDetail;
