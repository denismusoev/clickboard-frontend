import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, Container, Row, Col, Badge, Spinner } from 'react-bootstrap';

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
            <h1 className="text-center text-primary mb-4">{ad.title}</h1>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow-sm border-0">
                        <Card.Img
                            variant="top"
                            style={{ width: "500px", height: "auto", objectFit: "cover" }}
                            src={ad.photoUrls[0] || 'placeholder.jpg'}
                        />
                        <Card.Body>
                            <Card.Text>
                                <strong>Описание:</strong> {ad.description}
                            </Card.Text>
                            <Card.Text>
                                <strong>Категория:</strong> <Badge bg="info">{ad.categoryId}</Badge>
                            </Card.Text>
                            <ul className="list-group">
                                {Object.entries(ad.attributes).map(([key, value]) => (
                                    <li
                                        key={key}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                        <span className="fw-bold">{key}:</span>
                                        <span className="badge bg-success rounded-pill">{value}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                        <Card.Footer className="text-center text-muted">
                            Опубликовано: {new Date(ad.createdAt).toLocaleDateString()}
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AdDetail;
