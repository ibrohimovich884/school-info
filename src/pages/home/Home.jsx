import { NavLink } from "react-router";
import "./home.css";

const GRADES = ["8a", "8b", "9a", "9b", "10a", "10b", "10d"];

function parseGrade(grade) {
    const match = grade.match(/^(\d+)([a-z])$/i);
    if (!match) return { number: grade, letter: "" };
    return { number: match[1], letter: match[2].toUpperCase() };
}

function Home() {
    return (
        <div className="home-page">
            <p className="home-eyebrow">40-MAKTAB · SINFLAR RO'YXATI</p>
            <h2 className="home-title">Sinfingizni tanlang</h2>

            <div className="ticket-grid">
                {GRADES.map(grade => {
                    const { number, letter } = parseGrade(grade);
                    return (
                        <NavLink
                            key={grade}
                            to={`/grade/${grade}`}
                            className={({ isActive }) => `ticket-card${isActive ? " active" : ""}`}
                        >
                            <span className="ticket-eyebrow">SINF</span>
                            <span className="ticket-code">{number}-{letter}</span>
                        </NavLink>
                    );
                })}

                <NavLink
                    to="/allStudents"
                    className={({ isActive }) => `ticket-card ticket-card-all${isActive ? " active" : ""}`}
                >
                    <span className="ticket-eyebrow">RO'YXAT</span>
                    <span className="ticket-code ticket-code-all">
                        <span className="dot" />
                        <span className="dot" />
                        <span className="dot" />
                        <span className="dot" />
                    </span>
                    <span className="ticket-label">Hammasi</span>
                </NavLink>
            </div>
        </div>
    );
}

export default Home;