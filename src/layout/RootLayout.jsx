import Header from "../components/header/Header.jsx"
import Footer from "../components/footer/Footer.jsx"
import { Outlet } from "react-router"
function RootLayout() {
    return (
        <>
            <header><Header /></header> 
            <main><Outlet/></main>
            <footer> <Footer /></footer>
        </>
    )
}

export default RootLayout