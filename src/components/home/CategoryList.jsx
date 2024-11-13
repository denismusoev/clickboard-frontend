import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const categories = [
    { name: 'Электроника', icon: '📱' },
    { name: 'Авто', icon: '🚗' },
    { name: 'Работа', icon: '💼' },
    { name: 'Одежда', icon: '👕' },
    { name: 'Животные', icon: '🐱' },
    { name: 'Услуги', icon: '🛠️' },
    { name: 'Запчасти', icon: '⚙️' },
    { name: 'Красота и здоровье', icon: '💄' },
    { name: 'Хобби и отдых', icon: '🛴' },
    { name: 'Путешествия', icon: '🧳' },
];

function CategoryList() {
    return (
        <Row className="my-3">
            {categories.map((category, index) => (
                <Col key={index} xs={4} md={2} className="text-center">
                    <Card className="p-3">
                        <span style={{ fontSize: '2rem' }}>{category.icon}</span>
                        <Card.Text>{category.name}</Card.Text>
                    </Card>
                </Col>
            ))}
        </Row>
    );
}

export default CategoryList;
