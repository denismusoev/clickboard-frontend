import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, Container, Row, Col, Badge, Spinner, Button, ListGroup } from 'react-bootstrap';

function AdDetail() {
    const { id } = useParams();
    const [ad, setAd] = useState(null);

    useEffect(() => {
        fetchAd();
    }, []);

    const fetchAd = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/ads/${id}`);
            setAd(response.data);
        } catch (error) {
            console.error('Error fetching ad details:', error);
        }
    };

    if (!ad) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <Spinner animation="border" variant="primary" />
                <p className="ms-3">Загрузка данных...</p>
            </Container>
        );
    }

    return (
        <Container className="my-4">
            <Row>
                <Col md={12}>
                    <h1 className="mb-4">{ad.title}</h1>
                    <p className="text-muted">Категория: <Badge bg="secondary">{ad.categoryId}</Badge></p>
                </Col>
                <Col md={8}>
                    <Card className="mb-4">
                        <Card.Img
                            variant="top"
                            src={ad.photoUrls[0] || 'placeholder.jpg'}
                            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                        />
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
                            <p><strong>Имя:</strong> {ad.sellerName || 'Кристина'}</p>
                            <p><strong>Телефон:</strong> {ad.sellerPhone || 'Не указан'}</p>
                            <Button variant="secondary" className="w-100 mt-3">Показать телефон</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AdDetail;
