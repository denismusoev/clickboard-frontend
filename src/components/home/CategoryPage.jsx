import React, {useState} from 'react';
import Header from './Header';
import CategoryList from './CategoryList';
import RecommendationList from './RecommendationList';
import { Container } from 'react-bootstrap';
import LoginModal from "../auth/LoginModal";
import {useNavigate} from "react-router-dom";
import RegisterModal from "../auth/RegisterModal";

function CategoryPage() {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const navigate = useNavigate();
    return (
        <Container>
            <Header onRegisterClick={() => setShowRegister(true)} onLoginClick={() => setShowLogin(true)} />
            <h4>Категории</h4>
            <CategoryList />
            <h4>Рекомендации</h4>
            <RecommendationList />
            <LoginModal
                show={showLogin}
                onHide={() => setShowLogin(false)}
                onLoginSuccess={(path) => {
                    setShowLogin(false);
                    navigate(path);
                }}
            />
            <RegisterModal
                show={showRegister}
                onHide={() => setShowRegister(false)}
                onRegisterSuccess={() => {
                    navigate('/');
                }}
            />
        </Container>
    );
}

export default CategoryPage;
