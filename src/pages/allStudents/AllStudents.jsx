import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { API_URL } from "../../config.js";
import StudentSearch from "../../components/studentSearch/StudentSearch.jsx";
import "./AllStudents.css";

const GRADES = ["8a", "8b", "9a", "9b", "10a", "10b", "10d"];

function AllStudents() {
    const [allStudents, setAllStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [gradeFilter, setGradeFilter] = useState("");
    const navigate = useNavigate();

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

    // Sinf tartib raqami bo'yicha saralangan va (tanlangan bo'lsa) filterlangan ro'yxat
    const sortedFilteredStudents = useMemo(() => {
        const filtered = gradeFilter
            ? allStudents.filter(s => s.gradeId === gradeFilter)
            : allStudents;

        return [...filtered].sort((a, b) => {
            const aIndex = GRADES.indexOf(a.gradeId);
            const bIndex = GRADES.indexOf(b.gradeId);
            const aPos = aIndex === -1 ? GRADES.length : aIndex;
            const bPos = bIndex === -1 ? GRADES.length : bIndex;
            if (aPos !== bPos) return aPos - bPos;
            return (a["Full name"] || "").localeCompare(b["Full name"] || "");
        });
    }, [allStudents, gradeFilter]);

    return (
        <div className="roster-page">
            <div className="roster-header">
                <div className="roster-heading">
                    <p className="roster-eyebrow">40-MAKTAB · TO'LIQ RO'YXAT</p>
                    <h2 className="roster-title">Barcha o'quvchilar</h2>
                </div>

                <div className="roster-header-actions">
                    {!isLoading && (
                        <span className="roster-count">{sortedFilteredStudents.length} ta</span>
                    )}
                    <button type="button" className="back-btn" onClick={() => navigate("/")}>
                        ← Orqaga
                    </button>
                </div>
            </div>

            <StudentSearch students={allStudents} isLoading={isLoading} onSelect={goToStudent} />

            <div className="grade-filter-bar">
                <button
                    type="button"
                    className={`grade-filter-btn${gradeFilter === "" ? " active" : ""}`}
                    onClick={() => setGradeFilter("")}
                >
                    Barchasi
                </button>
                {GRADES.map(grade => (
                    <button
                        key={grade}
                        type="button"
                        className={`grade-filter-btn${gradeFilter === grade ? " active" : ""}`}
                        onClick={() => setGradeFilter(grade)}
                    >
                        {grade.toUpperCase()}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="roster-status">⏳ Yuklanmoqda...</div>
            ) : sortedFilteredStudents.length === 0 ? (
                <div className="roster-status">😕 O'quvchilar topilmadi</div>
            ) : (
                <div className="roster-grid">
                    {sortedFilteredStudents.map((student, index) => (
                        <div
                            key={index}
                            className="student-badge"
                            onClick={() => goToStudent(student)}
                        >
                            <div className="student-badge-photo">
                                <img
                                    src={student.Image || "/students/default.jpg"}
                                    alt={student["Full name"] || "avatar"}
                                    onError={(e) => { e.target.src = "/students/default.jpg"; }}
                                />
                            </div>
                            <p className="student-badge-name">{student["Full name"] || "Noma'lum"}</p>
                            <span className="student-badge-tag">
                                {student.gradeId ? `${student.gradeId.toUpperCase()}-sinf` : ""}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AllStudents;