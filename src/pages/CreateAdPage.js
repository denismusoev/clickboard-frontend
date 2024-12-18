import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

const CreateAdPage = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [attributeValues, setAttributeValues] = useState({});
    const [photos, setPhotos] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        axios.get('http://localhost:8080/categories')
            .then((response) => setCategories(response.data))
            .catch(() => setError('Ошибка при загрузке категорий'));
    }, []);

    useEffect(() => {
        if (categoryId) {
            axios.get(`http://localhost:8080/attributes/category/${categoryId}`)
                .then((response) => setAttributes(response.data))
                .catch(() => setError('Ошибка при загрузке атрибутов'));
        } else {
            setAttributes([]);
        }
    }, [categoryId]);

    const handleAttributeChange = (attributeId, value) => {
        setAttributeValues((prev) => ({ ...prev, [attributeId]: value }));
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        const fileReaders = [];

        files.forEach((file) => {
            const reader = new FileReader();
            const promise = new Promise((resolve) => {
                reader.onload = () => resolve(reader.result.split(',')[1]);
                reader.readAsDataURL(file);
            });
            fileReaders.push(promise);
        });

        const base64Files = await Promise.all(fileReaders);
        setPhotos((prevPhotos) => [...prevPhotos, ...base64Files]);
    };

    const validateFields = () => {
        const newErrors = {};

        if (!title.trim()) {
            newErrors.title = 'Введите заголовок';
        }

        if (!description.trim()) {
            newErrors.description = 'Введите описание';
        }

        if (!price) {
            newErrors.price = 'Укажите цену';
        } else if (isNaN(price) || parseFloat(price) <= 0) {
            newErrors.price = 'Цена должна быть числом больше 0';
        }

        if (!categoryId) {
            newErrors.categoryId = 'Выберите категорию';
        }

        // Если для атрибутов требуется обязательное значение, можно добавить их проверку здесь.
        // Допустим, что все атрибуты являются обязательными:
        attributes.forEach((attr) => {
            if (!attributeValues[attr.id] || !attributeValues[attr.id].trim()) {
                newErrors[`attribute_${attr.id}`] = `Введите значение для "${attr.name}"`;
            }
        });

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateFields();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({}); // Очистим ошибки, если они были

        const adData = {
            title,
            description,
            price: parseFloat(price),
            categoryId: parseInt(categoryId, 10),
            attributes: attributeValues,
            photos,
        };

        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/ads', adData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setSuccess(true);
            setTimeout(() => navigate('/home'), 2000);
        } catch (err) {
            console.error('Ошибка:', err);
            setError('Не удалось создать объявление. Попробуйте ещё раз.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Создать объявление</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">Объявление успешно создано! Перенаправление...</div>}

            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                <fieldset disabled={isLoading}>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Заголовок</label>
                        <input
                            type="text"
                            id="title"
                            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Введите заголовок"
                        />
                        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Описание</label>
                        <textarea
                            id="description"
                            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Введите описание"
                        ></textarea>
                        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="price" className="form-label">Цена</label>
                        <input
                            type="number"
                            id="price"
                            className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Введите цену"
                        />
                        {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="categoryId" className="form-label">Категория</label>
                        <select
                            id="categoryId"
                            className={`form-select ${errors.categoryId ? 'is-invalid' : ''}`}
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="">Выберите категорию</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
                    </div>

                    {attributes.length > 0 && (
                        <div className="mb-3">
                            <label className="form-label">Дополнительные атрибуты</label>
                            {attributes.map((attribute) => (
                                <div key={attribute.id} className="mb-2">
                                    <label className="form-label">{attribute.name}</label>
                                    <input
                                        type={attribute.valueType === 'number' ? 'number' : 'text'}
                                        className={`form-control ${errors[`attribute_${attribute.id}`] ? 'is-invalid' : ''}`}
                                        onChange={(e) =>
                                            handleAttributeChange(attribute.id, e.target.value)
                                        }
                                        placeholder={`Введите ${attribute.name}`}
                                    />
                                    {errors[`attribute_${attribute.id}`] && (
                                        <div className="invalid-feedback">{errors[`attribute_${attribute.id}`]}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mb-3">
                        <label htmlFor="photos" className="form-label">Фотографии</label>
                        <input
                            type="file"
                            id="photos"
                            className="form-control"
                            multiple
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    Создание...
                                </>
                            ) : (
                                "Создать"
                            )}
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
};

export default CreateAdPage;
