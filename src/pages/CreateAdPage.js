import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateAdPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [attributeValues, setAttributeValues] = useState({});
    const [photos, setPhotos] = useState([]); // Для фотографий
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Загрузка категорий
        axios.get('http://localhost:8080/categories')
            .then((response) => setCategories(response.data))
            .catch(() => setError('Ошибка при загрузке категорий'));
    }, []);

    useEffect(() => {
        // Загрузка атрибутов при изменении категории
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
        const files = Array.from(e.target.files); // Преобразуем FileList в массив
        const fileReaders = [];

        files.forEach((file) => {
            const reader = new FileReader();
            const promise = new Promise((resolve) => {
                reader.onload = () => {
                    resolve(reader.result.split(',')[1]); // Сохраняем Base64 без заголовка
                };
                reader.readAsDataURL(file);
            });
            fileReaders.push(promise);
        });

        // Ждём, пока все файлы будут обработаны
        const base64Files = await Promise.all(fileReaders);
        setPhotos((prevPhotos) => [...prevPhotos, ...base64Files]); // Добавляем файлы в массив
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const adData = {
            title,
            description,
            price: parseFloat(price),
            categoryId: parseInt(categoryId, 10),
            attributes: attributeValues,
            photos,
        };

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/ads', adData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert('Объявление успешно создано!');
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось создать объявление');
        }
    };


    const clearForm = () => {
        setTitle('');
        setDescription('');
        setPrice('');
        setCategoryId('');
        setAttributes([]);
        setAttributeValues({});
        setPhotos([]);
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Создать объявление</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">Объявление успешно создано!</div>}
            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Заголовок</label>
                    <input
                        type="text"
                        id="title"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Введите заголовок"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Описание</label>
                    <textarea
                        id="description"
                        className="form-control"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Введите описание"
                        required
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Цена</label>
                    <input
                        type="number"
                        id="price"
                        className="form-control"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Введите цену"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="categoryId" className="form-label">Категория</label>
                    <select
                        id="categoryId"
                        className="form-select"
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
                    </select>
                </div>
                {attributes.length > 0 && (
                    <div className="mb-3">
                        <label className="form-label">Дополнительные атрибуты</label>
                        {attributes.map((attribute) => (
                            <div key={attribute.id} className="mb-2">
                                <label className="form-label">{attribute.name}</label>
                                <input
                                    type={attribute.valueType === 'number' ? 'number' : 'text'}
                                    className="form-control"
                                    onChange={(e) =>
                                        handleAttributeChange(attribute.id, e.target.value)
                                    }
                                    placeholder={`Введите ${attribute.name}`}
                                />
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
                    <button type="submit" className="btn btn-primary">Создать</button>
                </div>
            </form>
        </div>
    );
};

export default CreateAdPage;
