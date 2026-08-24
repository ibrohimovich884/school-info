import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { API_URL } from "../../config.js";
import StudentSearch from "../../components/studentSearch/StudentSearch.jsx";
import "./Home.css";

const GRADES = ["8a", "8b", "9a", "9b", "10a", "10b", "10d"];

function Home() {
    const [allStudents, setAllStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAllStudents, setShowAllStudents] = useState(false);
    const navigate = useNavigate();

    // Barcha o'quvchilarni bir marta yuklab olamiz
    // (StudentSearch shu ro'yxatdan foydalanadi, qayta so'rov yubormaydi)
    useEffect(() => {
        setIsLoading(true);
        fetch(`${API_URL}/all-students`)
            .then(res => res.json())
            .then(data => setAllStudents(Array.isArray(data) ? data : []))
            .catch(err => console.error("O'quvchilarni yuklashda xato:", err))
            .finally(() => setIsLoading(false));
    }, []);

    const goToStudent = (student) => {
        if (student?.gradeId) navigate(`/grade/${student.gradeId}`);
    };

    return (
        <div className="container">
            <StudentSearch students={allStudents} isLoading={isLoading} onSelect={goToStudent} />

            {!showAllStudents ? (
                <>
                    <h2 className="grade-title">Sinfingizni tanlang!</h2>
                    <div className="grade-list">
                        {GRADES.map(grade => (
                            <NavLink
                                key={grade}
                                to={`/grade/${grade}`}
                                className={({ isActive }) => `grade-card${isActive ? " active" : ""}`}
                            >
                                {grade.toUpperCase().replace('A', '-A').replace('B', '-B').replace('D', '-D')}
                            </NavLink>
                        ))}

                        <button
                            type="button"
                            className="grade-card all-card"
                            onClick={() => setShowAllStudents(true)}
                        >
                            Hammasi
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="all-students-header">
                        <h2 className="grade-title">Barcha o'quvchilar</h2>
                        <button
                            type="button"
                            className="back-btn"
                            onClick={() => setShowAllStudents(false)}
                        >
                            ← Orqaga
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="all-students-status">⏳ Yuklanmoqda...</div>
                    ) : allStudents.length === 0 ? (
                        <div className="all-students-status">😕 O'quvchilar topilmadi</div>
                    ) : (
                        <div className="all-students-grid">
                            {allStudents.map((student, index) => (
                                <div
                                    key={index}
                                    className="student-card"
                                    onClick={() => goToStudent(student)}
                                >
                                    <img
                                        src={student.Image || "/students/default.jpg"}
                                        alt={student["Full name"] || "avatar"}
                                        onError={(e) => { e.target.src = "/students/default.jpg"; }}
                                    />
                                    <p className="student-card-name">{student["Full name"] || "Noma'lum"}</p>
                                    <span className="student-card-grade">
                                        {student.gradeId ? `${student.gradeId.toUpperCase()}-sinf` : ""}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Home;