import { NavLink } from "react-router";
import "./home.css"

function Home() {
    return (
        <>
            <div className="container">
                <h2 className="grade-title">Sinfingizni tanlang!</h2>
                <div className="grade-list">
                    <NavLink to="/grade/7a" className="grade-card">7-A</NavLink>
                    <NavLink to="/grade/7b" className="grade-card">7-B</NavLink>
                    <NavLink to="/grade/8a" className="grade-card">8-A</NavLink>
                    <NavLink to="/grade/8b" className="grade-card">8-B</NavLink>
                    <NavLink to="/grade/9a" className="grade-card">9-A</NavLink>
                    <NavLink to="/grade/9b" className="grade-card">9-B</NavLink>
                    <NavLink to="/grade/9d" className="grade-card">9-D</NavLink>
                </div>
            </div>  
        </>
    )
}

export default Home;
