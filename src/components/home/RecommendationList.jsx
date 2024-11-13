import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';

const recommendations = [
    {
        title: 'Куртка на подростка',
        price: '2 999 ₽',
        condition: 'Б/У 158 р-р',
        location: 'Ульяновск, р-н Заволжский',
        image: 'https://via.placeholder.com/150', // Замени на нужный URL
    },
];

function RecommendationList() {
    return (
        <Row>
            {recommendations.map((item, index) => (
                <Col key={index} xs={6} md={3}>
                    <Card className="my-2">
                        <Card.Img variant="top" src={item.image} />
                        <Card.Body>
                            <Card.Title>{item.title}</Card.Title>
                            <Card.Text>{item.condition}</Card.Text>
                            <Card.Text>
                                <strong>{item.price}</strong>
                            </Card.Text>
                            <Card.Text>{item.location}</Card.Text>
                            <Button variant="outline-secondary">❤️</Button>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
}

export default RecommendationList;
