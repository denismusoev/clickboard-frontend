import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Container, Row, Col, Form, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AdList() {
    const [ads, setAds] = useState([]);
    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState(null);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        fetchAds();
    }, [title, categoryId, minPrice, maxPrice, page]);

    const fetchAds = async () => {
        try {
            const response = await axios.get('http://localhost:8080/ads', {
                params: {
                    title,
                    categoryId,
                    page,
                    size: 10
                }
            });
            setAds(response.data.content);
            setTotalPages(response.data.totalPages);

        } catch (error) {
            console.error('Error fetching ads:', error);
        }
    };

    const handleFilter = (e) => {
        e.preventDefault();
        setPage(0);
        fetchAds();
    };

    const handlePagination = (pageIndex) => {
        setPage(pageIndex);
    };

    const renderPagination = () => {
        let items = [];
        for (let i = 0; i < totalPages; i++) {
            items.push(
                <Pagination.Item
                    key={i}
                    active={i === page}
                    onClick={() => handlePagination(i)}
                >
                    {i + 1}
                </Pagination.Item>
            );
        }
        return items;
    };

    return (
        <Container>
            <Row className="my-4">
                {/* Sidebar filters */}
                <Col md={9} lg={3} style={{ height: "fit-content" }} className="bg-light p-3 mb-3 rounded shadow-sm">
                    <h5>Фильтры</h5>
                    <Form onSubmit={handleFilter}>
                        <Form.Group className="mb-3">
                            <Form.Label>Цена, ₽</Form.Label>
                            <Row>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="От"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="До"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                    />
                                </Col>
                            </Row>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Категория</Form.Label>
                            <Form.Select
                                value={categoryId || ''}
                                onChange={(e) => setCategoryId(e.target.value || null)}
                            >
                                <option value="">Все категории</option>
                                <option value="1">Автомобили</option>
                                <option value="2">Недвижимость</option>
                                <option value="3">Электроника</option>
                                {/* Добавьте больше категорий по необходимости */}
                            </Form.Select>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">Применить</Button>
                    </Form>
                </Col>

                {/* Ads listing */}
                <Col md={9} lg={9}>
                    <Form onSubmit={handleFilter} className="mb-4">
                        <Row className="g-2">
                            <Col md={8}>
                                <Form.Control
                                    type="text"
                                    placeholder="Поиск по названию"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="shadow-sm"
                                />
                            </Col>
                            <Col md={4}>
                                <Button type="submit" variant="primary" className="w-100 shadow-sm">Поиск</Button>
                            </Col>
                        </Row>
                    </Form>

                    <Row>
                        {ads.map((ad) => (
                            <Col key={ad.id} xs={12} className="mb-4">
                                <Card className="shadow-sm border-0">
                                    <Row className="g-0">
                                        <Col md={4}>
                                            <Card.Img
                                                style={{ height: '100%', objectFit: 'cover' }}
                                                variant="top"
                                                src={ad.photoUrls[0] || 'placeholder.jpg'}
                                            />
                                        </Col>
                                        <Col md={8}>
                                            <Card.Body>
                                                <Card.Title className="text-truncate">{ad.title}</Card.Title>
                                                <Card.Text className="text-muted">{ad.description}</Card.Text>
                                                <Card.Text><strong>{ad.price} ₽</strong></Card.Text>
                                                <Button variant="outline-primary" onClick={() => navigate(`/ads/${ad.id}`)}>Подробнее</Button>
                                            </Card.Body>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Modern Pagination */}
                    <Pagination className="custom-pagination justify-content-center mt-4">
                        {renderPagination()}
                    </Pagination>

                </Col>
            </Row>
        </Container>
    );
}

export default AdList;
