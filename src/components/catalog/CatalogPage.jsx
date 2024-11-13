import React, { useState } from 'react';
import Filters from './Filters';
import ProductList from './ProductList';
import SortBar from './SortBar';
import {Col, Container, Row} from "react-bootstrap";
import Header from "../home/Header";

function CatalogPage() {
    const handleSortChange = (sort) => {
        console.log('Сортировка:', sort);
    };

    return (
        <Container>
            <Header />
            <Row className={"mt-5"}>
                <SortBar onSortChange={handleSortChange} />
                <Col md={3}>
                    <Filters />
                </Col>
                <Col md={9}>
                    <ProductList />
                </Col>
            </Row>
        </Container>
    );
}
export default CatalogPage;