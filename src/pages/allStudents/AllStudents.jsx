import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useStudents } from "../../hooks/useStudents.js";
import StudentCard from "../../components/studentCard/StudentCard.jsx";
import StudentSearch from "../../components/studentSearch/StudentSearch.jsx";
import GradeFilter from "../../components/gradeFilter/GradeFilter.jsx";
import "./AllStudents.css";

const GRADES = ["8a", "8b", "9a", "9b", "10a", "10b", "10d"];

function AllStudents() {
    const { students: allStudents, isLoading, dataAllowed } = useStudents();
    const [gradeFilter, setGradeFilter] = useState("");
    const navigate = useNavigate();

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

            <div className="roster-controls">
                <StudentSearch students={allStudents} isLoading={isLoading} onSelect={goToStudent} />
                <GradeFilter grades={GRADES} value={gradeFilter} onChange={setGradeFilter} />
            </div>

            {!dataAllowed ? (
                <div className="roster-status">🔒 Ma'lumotlar vaqtincha berkitilgan</div>
            ) : isLoading ? (
                <div className="roster-status">⏳ Yuklanmoqda...</div>
            ) : sortedFilteredStudents.length === 0 ? (
                <div className="roster-status">😕 O'quvchilar topilmadi</div>
            ) : (
                <div className="roster-grid">
                    {sortedFilteredStudents.map((student, index) => (
                        <StudentCard
                            key={student.id ?? index}
                            student={student}
                            variant="compact"
                            dataAllowed={dataAllowed}
                            onSelect={goToStudent}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default AllStudents;
