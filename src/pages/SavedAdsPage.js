import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';

function SavedAdsPage() {
    const [ads, setAds] = useState([]);

    useEffect(() => {
        fetchSavedAds();
    }, []);

    const fetchSavedAds = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/saved-ads', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setAds(response.data);
        } catch (err) {
            console.error('Ошибка загрузки избранных объявлений:', err);
        }
    };

    const removeFromSaved = async (adId) => {
        try {
            await axios.delete(`http://localhost:8080/api/saved-ads/${adId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setAds((prevAds) => prevAds.filter((ad) => ad.adId !== adId));
            alert('Объявление удалено из избранного.');
        } catch (err) {
            console.error('Ошибка при удалении объявления из избранного:', err);
            alert('Не удалось удалить объявление из избранного.');
        }
    };

    return (
        <Container className="my-4">
            <h1 className="mb-4">Избранные объявления</h1>
            <Row>
                {!ads || ads.length === 0 ? (
                    <p className="text-center">У вас пока нет избранных объявлений.</p>
                ) : (
                    ads.map((ad) => (
                        <Col key={ad.id} md={4}>
                            <Card className="mb-4">
                                {ad.photoUrls && ad.photoUrls.length > 0 ? (
                                    <Card.Img
                                        variant="top"
                                        src={ad.photoUrls[0]}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <Card.Img
                                        variant="top"
                                        src="placeholder.jpg"
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                )}
                                <Card.Body>
                                    <Card.Title>{ad.title}</Card.Title>
                                    <Card.Text>
                                        <strong>Цена:</strong> {ad.price} ₽
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Категория:</strong> {ad.categoryName}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Продавец:</strong> {`${ad.sellerFirstName} ${ad.sellerLastName}`}
                                    </Card.Text>
                                    <Button
                                        variant="primary"
                                        href={`/ads/${ad.adId}`}
                                        className="mb-2 w-100"
                                    >
                                        Перейти к объявлению
                                    </Button>
                                    <Button
                                        variant="danger"
                                        className="w-100"
                                        onClick={() => removeFromSaved(ad.adId)}
                                    >
                                        Удалить из избранного
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
        </Container>
    );
}

export default SavedAdsPage;
