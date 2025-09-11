import Header from "../components/header/Header.jsx"
import Footer from "../components/footer/Footer.jsx"
import { Outlet } from "react-router"
function RootLayout() {
    return (
        <>
            <div className="layout">
                <header><Header /></header>
                <main><Outlet /></main>
                <footer><Footer /></footer>
            </div>
        </>
    )
}

export default RootLayout