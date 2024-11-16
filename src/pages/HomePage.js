import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Container, Row, Col, Form } from 'react-bootstrap';

function HomePage() {
    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState('');
    const [ads, setAds] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const response = await axios.get('http://localhost:8080/categories');
        setCategories(response.data);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:8080/ads', {
                params: { title },
            });
            setAds(response.data.content);
        } catch (error) {
            console.error('Error fetching ads:', error);
        }
    };

    return (
        <Container>
            <h1 className="my-4 text-center" style={{ color: '#006fff' }}>Найдите то, что вам нужно</h1>

            <Form onSubmit={handleSearch} className="mb-4">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Form.Control
                            type="text"
                            placeholder="Поиск объявлений"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="shadow-sm"
                            style={{ borderColor: '#94A3B8', backgroundColor: '#F1F5F9' }}
                        />
                    </Col>
                    <Col md={2}>
                        <Button type="submit" style={{ backgroundColor: '#2563EB', border: 'none' }} className="w-100 shadow-sm">Поиск</Button>
                    </Col>
                </Row>
            </Form>

            <h2 className="my-4" style={{ color: '#006fff' }}>Категории</h2>
            <Row className="mb-4">
                {categories.map((category) => (
                    <Col key={category.id} xs={6} sm={4} md={3} lg={2} className="mb-4">
                        <Card className="shadow-sm border-0 h-100 text-center" style={{ backgroundColor: '#F1F5F9' }}>
                            <div className="d-flex justify-content-center align-items-center">
                                <Card.Img
                                    variant="top"
                                    src={category.photoUrl || 'placeholder.jpg'}
                                    style={{ maxWidth:"100px", width: '100%', objectFit: 'contain', padding: "10px" }}
                                />
                            </div>
                            <Card.Body>
                                <Card.Title style={{ color: '#1E293B' }}>{category.name}</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {ads.length > 0 ? (
                <>
                    <h2 className="my-4" style={{color: '#006fff'}}>Результаты поиска</h2>
                    <Row>
                        {ads.map((ad) => (
                            <Col key={ad.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                                <Card className="shadow-sm border-0 h-100" style={{backgroundColor: '#0F172A'}}>
                                    <Card.Img
                                        variant="top"
                                        src={ad.photoUrls[0] || 'placeholder.jpg'}
                                        style={{height: '150px', objectFit: 'contain'}}
                                    />
                                    <Card.Body>
                                        <Card.Title style={{color: '#FFFFFF'}}>{ad.title}</Card.Title>
                                        <Card.Text style={{color: '#94A3B8'}}>{ad.price} руб.</Card.Text>
                                        <Button href={`/ads/${ad.id}`}
                                                style={{backgroundColor: '#2563EB', border: 'none', color: '#FFFFFF'}}
                                                className="w-100 shadow-sm">Подробнее</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </>
            ) : (
                <>
                </>
            )}
        </Container>
    );
}

export default HomePage;
