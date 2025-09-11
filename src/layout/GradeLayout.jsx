import Grade8a from "../pages/grade8a/Grade8a"
import { NavLink, Outlet } from "react-router"
import "../components/header/Header.css"

function GradeLayout() {
    return (
        <>
            <h2>Sinfingizni tanlang</h2>
            <nav className="nav">
                <ul>
                    <li><NavLink to="/grade8a">8-a</NavLink></li>
                    <li><NavLink to="/grade8b">8-b</NavLink></li>
                    <li><NavLink to="/grade9a">9-a</NavLink></li>
                    <li><NavLink to="/grade9b">9-b</NavLink></li>
                </ul>
            </nav>
            <Outlet />
        </>
    )
}

export default GradeLayout