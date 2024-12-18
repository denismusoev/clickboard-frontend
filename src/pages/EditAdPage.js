import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner, Button, Form, Container } from 'react-bootstrap';

const EditAdPage = () => {
    const { id } = useParams(); // ID объявления из URL
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]); // Список категорий
    const [attributes, setAttributes] = useState([]); // Доступные атрибуты для категории
    const [attributeValues, setAttributeValues] = useState({}); // Текущие значения атрибутов
    const [photos, setPhotos] = useState([]); // Фото объявления
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Загружаем данные объявления и категории
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Получаем список категорий
                const categoriesResponse = await axios.get('http://localhost:8080/categories');
                setCategories(categoriesResponse.data);

                // Получаем данные объявления
                const adResponse = await axios.get(`http://localhost:8080/ads/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });

                const ad = adResponse.data;
                setTitle(ad.title);
                setDescription(ad.description);
                setPrice(ad.price);
                setCategoryId(ad.categoryId); // Устанавливаем текущую категорию
                setPhotos(ad.photoUrls || []);
                setAttributeValues(ad.attributes || {});
            } catch (err) {
                setError('Ошибка при загрузке данных объявления.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Загружаем атрибуты при смене категории
    useEffect(() => {
        const fetchAttributes = async () => {
            if (categoryId && categoryId !== undefined) {
                try {
                    console.log(`http://localhost:8080/attributes/category/${categoryId}`);
                    console.log(categoryId);
                    const response = await axios.get(`http://localhost:8080/attributes/category/${categoryId}`);
                    const fetchedAttributes = response.data;

                    // Обновляем атрибуты, используя текущие значения (если есть)
                    const updatedAttributes = fetchedAttributes.map((attr) => ({
                        ...attr,
                        value: attributeValues[attr.name] || '', // Если есть значение, берем его
                    }));
                    console.log(updatedAttributes);
                    console.log(response.data);
                    console.log(attributeValues['Пробег']);
                    setAttributes(updatedAttributes);
                } catch (err) {
                    setError('Ошибка при загрузке характеристик категории.');
                }
            }
        };
        fetchAttributes();
    }, [categoryId, attributeValues]);

    // Обновление значений характеристик
    const handleAttributeChange = (id, value) => {
        setAttributeValues((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalAttributeValues = {};
        attributes.forEach((attr) => {
            // Если attributeValues хранит по name, а нам нужен id
            if (attributeValues.hasOwnProperty(attr.name)) {
                finalAttributeValues[attr.id] = attributeValues[attr.name];
            }
        });

        const adData = {
            title,
            description,
            price: parseFloat(price),
            categoryId: parseInt(categoryId, 10),
            attributes: finalAttributeValues, // Отправляем атрибуты как ключ:значение
            photos,
        };

        try {
            await axios.put(`http://localhost:8080/ads/${id}`, adData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            alert('Объявление успешно обновлено!');
            navigate(`/ads/${id}`);
        } catch (err) {
            setError('Ошибка при обновлении объявления.');
        }
    };

    if (isLoading) {
        return <Spinner animation="border" className="d-flex justify-content-center m-5" />;
    }

    return (
        <Container className="mt-5">
            <h1 className="mb-4 text-center">Редактировать объявление</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Заголовок</Form.Label>
                    <Form.Control
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Описание</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Цена</Form.Label>
                    <Form.Control
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Категория</Form.Label>
                    <Form.Select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                    >
                        <option value="">Выберите категорию</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {attributes.length > 0 && (
                    <>
                        <h5>Характеристики</h5>
                        {attributes.map((attribute) => (
                            <Form.Group className="mb-3" key={attribute.id}>
                                <Form.Label>{attribute.name}</Form.Label>
                                <Form.Control
                                    type={attribute.valueType === 'number' ? 'number' : 'text'}
                                    value={attributeValues[attribute.name] || ''}
                                    onChange={(e) => handleAttributeChange(attribute.id, e.target.value)}
                                />
                            </Form.Group>
                        ))}
                    </>
                )}

                <Button variant="primary" type="submit">
                    Сохранить изменения
                </Button>
            </Form>
        </Container>
    );
};

export default EditAdPage;
