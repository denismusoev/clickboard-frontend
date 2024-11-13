import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';

const products = [
    {
        name: 'Смартфон Apple iPhone 14',
        price: '84 999 ₽',
        location: 'Ульяновск, р-н Заволжский',
        image: 'https://via.placeholder.com/200',
    },
    {
        name: 'Смартфон Huawei nova 11',
        price: '36 999 ₽',
        location: 'Ульяновск, р-н Заволжский',
        image: 'https://via.placeholder.com/200',
    },
    // Добавьте другие товары по аналогии
];

const ProductList = () => {
    return (
        <Row>
            {products.map((product, index) => (
                <Col key={index} xs={6} md={4} lg={3} className="mb-4">
                    <Card>
                        <Card.Img variant="top" src={product.image} />
                        <Card.Body>
                            <Card.Title className="fs-6">{product.name}</Card.Title>
                            <Card.Text className="text-muted">{product.price}</Card.Text>
                            <Card.Text className="text-muted" style={{ fontSize: '0.85rem' }}>
                                {product.location}
                            </Card.Text>
                            <Button variant="outline-secondary" className="w-100">
                                ❤️
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default ProductList;
