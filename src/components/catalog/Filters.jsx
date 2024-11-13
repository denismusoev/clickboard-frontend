import React from 'react';
import { Accordion, Form, Button, Card } from 'react-bootstrap';

const Filters = ({ onApply }) => {
    return (
        <Card className="p-3">
            <h5>Фильтры</h5>
            <Accordion defaultActiveKey="0" flush>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Цена, ₽</Accordion.Header>
                    <Accordion.Body>
                        <Form>
                            <Form.Label>От</Form.Label>
                            <Form.Control type="number" placeholder="4500" />
                            <Form.Label className="mt-2">До</Form.Label>
                            <Form.Control type="number" placeholder="30500" />
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Встроенная память</Accordion.Header>
                    <Accordion.Body>
                        <Form.Check type="checkbox" label="32 ГБ" />
                        <Form.Check type="checkbox" label="64 ГБ" />
                        <Form.Check type="checkbox" label="128 ГБ" />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Бренд</Accordion.Header>
                    <Accordion.Body>
                        <Form.Check type="checkbox" label="Apple" />
                        <Form.Check type="checkbox" label="Samsung" />
                        <Form.Check type="checkbox" label="Huawei" />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <Button variant="primary" className="mt-3 w-100" onClick={onApply}>
                Применить фильтры
            </Button>
        </Card>
    );
};

export default Filters;
