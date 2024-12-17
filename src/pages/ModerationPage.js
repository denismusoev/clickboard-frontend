import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ModerationPage() {
    const [ads, setAds] = useState([]);

    // Загрузка объявлений, ожидающих модерации
    useEffect(() => {
        axios.get('http://localhost:8080/ads/pending', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => {
                setAds(response.data);
            })
            .catch((error) => {
                console.error('Ошибка загрузки объявлений:', error);
            });
    }, []);

    // Обработчик модерации
    const handleModerate = (adId, status) => {
        axios.post(`http://localhost:8080/ads/${adId}/moderate`, null, {
            params: { status },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(() => {
                setAds(ads.filter((ad) => ad.id !== adId)); // Удаляем объявление из списка
            })
            .catch((error) => {
                console.error('Ошибка модерации объявления:', error);
            });
    };

    return (
        <div className="container mt-5">
            <h1>Модерация объявлений</h1>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Заголовок</th>
                    <th>Описание</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {ads.map((ad, index) => (
                    <tr key={ad.id}>
                        <td>{index + 1}</td>
                        <td>{ad.title}</td>
                        <td>{ad.description}</td>
                        <td>
                            <Link to={`/ads/${ad.id}`}>
                                <Button variant="info" className="me-2">Просмотреть</Button>
                            </Link>
                            <Button
                                variant="success"
                                onClick={() => handleModerate(ad.id, 'APPROVED')}
                                className="me-2"
                            >
                                Одобрить
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => handleModerate(ad.id, 'REJECTED')}
                            >
                                Отклонить
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
}

export default ModerationPage;
