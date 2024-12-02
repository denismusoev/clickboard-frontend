import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Container, Row, Col, Form } from 'react-bootstrap';
import {useNavigate} from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();
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
        navigate(`/ads?title=${encodeURIComponent(title)}`);
    };

    return (
        <Container>
            <h1 className="my-4 text-center" style={{ color: '#494949' }}>Найдите то, что вам нужно</h1>

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
                        <Button type="submit" style={{ backgroundColor: "#d08b92", color: "#000000", border: 'none' }} className="w-100">Поиск</Button>
                    </Col>
                </Row>
            </Form>

            <h2 className="my-4" style={{ color: '#494949' }}>Категории</h2>
            <Row className="mb-4">
                {categories.map((category) => (
                    <Col key={category.id} xs={6} sm={4} md={3} lg={2} className="mb-4">
                        <Card className="shadow-sm border-0 h-100 text-center" style={{ cursor: "pointer", backgroundColor: '#eae8e8' }}
                            onClick={() => navigate(`/ads?categoryId=${category.id}`)}>
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
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <h2 className="my-4" style={{color: '#000000', width: "fit-content"}}>Результаты поиска</h2>
                    <Row style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                        {ads.map((ad) => (
                            <Col key={ad.id} xs={10} sm={6} md={4} lg={3} className="mb-4">
                                <Card onClick={() => navigate(`/ads/${ad.id}`)}
                                      style={{width: "100%", cursor: 'pointer', backgroundColor: "#ffffff"}}
                                      className="shadow-sm border-0">
                                    <Row style={{margin: "0px"}}>
                                        <Card.Img
                                            style={{padding: "0px", width: "100%", height: '100%', objectFit: 'cover'}}
                                            variant="top"
                                            src={ad.photoUrls[0] || 'placeholder.jpg'}
                                        />
                                    </Row>
                                    <Row style={{margin: "0px"}}>
                                        <Card.Body>
                                            <Card.Title className="text-truncate">{ad.title}</Card.Title>
                                            <Card.Text className="text-muted">{ad.description}</Card.Text>
                                            <Card.Text><strong>{ad.price} ₽</strong></Card.Text>
                                        </Card.Body>
                                    </Row>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            ) : (
                <>
                </>
            )}
        </Container>
    );
}

export default HomePage;
