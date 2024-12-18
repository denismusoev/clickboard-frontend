import React, {useEffect, useState} from 'react';
import {config, useTransition} from 'react-spring';
import {BrowserRouter as Router, Navigate, Route, Routes, useLocation} from 'react-router-dom';
import './transitions.css';
import './AppRouter.css';
import {AnimatePresence, motion} from 'framer-motion';
import AdList from './pages/AdList';
import AdDetail from './pages/AdDetail';
import {Footer, Header} from "./components/HeaderFooter";
import HomePage from "./pages/HomePage";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import CreateAdPage from "./pages/CreateAdPage";
import ModerationPage from "./pages/ModerationPage";
import ProfilePage from "./pages/ProfilePage";
import SavedAdsPage from "./pages/SavedAdsPage";
import EditAdPage from "./pages/EditAdPage";

const AnimatedRoutes = () => {
    const location = useLocation(); // Получаем текущее местоположение для ключа анимации
    const role = localStorage.getItem("role");

    const transitions = useTransition(location, {
        from: {opacity: 0, transform: 'translate3d(10%,0,0)'},
        enter: {opacity: 1, transform: 'translate3d(0%,0,0)'},
        leave: {opacity: 0, transform: 'translate3d(-10%,0,0)'},

        config: config.stiff
    });

    const pageTransition = {
        initial: {opacity: 0},
        animate: {opacity: 1},
        exit: {opacity: 0},
        transition: {duration: 0.3, delay: 0}
    };

    return (
        <>
            <AnimatePresence mode="wait">
                {/*<div style={{position: 'absolute', width: '100%'}}>*/}
                <Routes>
                    {/* Общие маршруты */}
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/register" element={<Signup />} />

                    {/* Маршруты для пользователей */}
                    {role === 'USER' && (
                        <>
                            <Route path="/home" element={<HomePage />} />
                            <Route path="/create-ad" element={<CreateAdPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/ads" element={<AdList />} />
                            <Route path="/ads/:id" element={<AdDetail />} />
                            <Route path="*" element={<Navigate to="/home" />} />
                            <Route path="/saved-ads" element={<SavedAdsPage />} />
                            {/*<Route path="/edit-ad/:id" element={<EditAdPage />} />*/}
                        </>
                    )}

                    {/* Маршруты для админов */}
                    {role === 'ADMIN' && (
                        <>
                            <Route path="/moderation" element={<ModerationPage />} />
                            <Route path="/ads/:id" element={<AdDetail />} />
                            <Route path="*" element={<Navigate to="/moderation" />} />
                        </>
                    )}
                </Routes>
                {/*</div>*/}
            </AnimatePresence>
        </>
    )
};

const AppRouter = () => {
    return (
        <Router>
            <div className="app-wrapper" style={{backgroundColor: "#fcfcfd"}}>
                <Header/>
                <div className="content">
                    <AnimatedRoutes/>
                </div>
                <Footer/>
            </div>
        </Router>
    );
};


export default AppRouter;
