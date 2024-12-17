import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Card, Container, Row, Col, Badge, Spinner, Button, ListGroup } from 'react-bootstrap';

function AdDetail() {
    const { id } = useParams();
    const [ad, setAd] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAd();
    }, []);

    const fetchAd = async () => {
        axios.get(`http://localhost:8080/ads/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => {
                setAd(response.data);
            })
            .catch((error) => {
                setError('Доступ запрещен или объявление не найдено.');
            });
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
        dots: ad.photoUrls.length > 1, // Показывать точки только если больше 1 фото
        infinite: ad.photoUrls.length > 1, // Отключить бесконечный режим для 1 фото
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: ad.photoUrls.length > 1, // Стрелки только при наличии нескольких фото
    };


    return (
        <Container className="my-4">
            <Row>
                <Col md={12}>
                    <h1 className="mb-4">{ad.title}</h1>
                    <p className="text-muted">Категория: <Badge bg="secondary">{ad.categoryName}</Badge></p>
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
                            <Button variant="primary" className="w-100 mb-3">В избранное</Button>
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
