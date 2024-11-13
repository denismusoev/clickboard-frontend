import React from 'react';
import {config, useTransition} from 'react-spring';
import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom';
import './transitions.css';
import {AnimatePresence, motion} from 'framer-motion';
import CategoryPage from "./components/home/CategoryPage";
import CatalogPage from "./components/catalog/CatalogPage";

const AnimatedRoutes = () => {
    const location = useLocation(); // Получаем текущее местоположение для ключа анимации

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
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<motion.div {...pageTransition}><CategoryPage/></motion.div>}/>
                    <Route path="/catalog" element={<motion.div {...pageTransition}><CatalogPage/></motion.div>}/>
                </Routes>
                {/*</div>*/}
            </AnimatePresence>
        </>
    )
};

const AppRouter = () => {
    return (
        <Router>
            <AnimatedRoutes/>
        </Router>
    );
};




























































export default AppRouter;
