import { useEffect } from "react";
import Header from "../components/header/Header.jsx";
import Footer from "../components/footer/Footer.jsx";
import { Outlet, useLocation } from "react-router";
import { trackEvent } from "../utils/tracking.js";
import './Layout.css';

function RootLayout() {
    const location = useLocation();

    useEffect(() => {
        trackEvent("pageView");
    }, [location.pathname]);

    return (
        <div className="layout">
            <header><Header /></header>
            <main><Outlet /></main>
            <footer><Footer /></footer>
        </div>
    );
}

export default RootLayout;