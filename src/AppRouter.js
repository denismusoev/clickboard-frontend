import React from 'react';
import {config, useTransition} from 'react-spring';
import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom';
import './transitions.css';
import './AppRouter.css';
import {AnimatePresence, motion} from 'framer-motion';
import AdList from './pages/AdList';
import AdDetail from './pages/AdDetail';
import {Footer, Header} from "./components/HeaderFooter";
import HomePage from "./pages/HomePage";

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
                    <Route path="/" element={<motion.div {...pageTransition}><AdList /></motion.div>}/>
                    <Route path="/ads/:id" element={<motion.div {...pageTransition}><AdDetail /></motion.div>}/>
                    <Route path="/home" element={<motion.div {...pageTransition}><HomePage /></motion.div>}/>
                </Routes>
                {/*</div>*/}
            </AnimatePresence>
        </>
    )
};

const AppRouter = () => {
    return (
        <div className="app-wrapper" style={{ backgroundColor: "#ffffff"}}>
            <Header />
            <div className="content">
                <Router>
                    <AnimatedRoutes />
                </Router>
            </div>
            <Footer />
        </div>
    );
};




























































export default AppRouter;
