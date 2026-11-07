import { useState, useMemo } from "react";
import { useStudents } from "../../hooks/useStudents.js";
import StudentCard from "../../components/studentCard/StudentCard.jsx";
import StudentSearch from "../../components/studentSearch/StudentSearch.jsx";
import GradeFilter from "../../components/gradeFilter/GradeFilter.jsx";
import StudentModal from "../../components/studentModal/StudentModal.jsx";
import BackButton from "../../components/backButton/BackButton.jsx";
import "./AllStudents.css";

const GRADES = ["8a", "8b", "9a", "9b", "10a", "10b", "10d"];

function AllStudents() {
    const { students: allStudents, isLoading, dataAllowed, error, refetch } = useStudents();
    const [gradeFilter, setGradeFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);

    // O'quvchini bosganda sinfga otib ketmaydi — o'sha o'quvchining kartasini ochadi
    const handleStudentClick = (student) => {
        setSelectedStudent(student);
    };

    // Qidiruv va sinf filtrlari bo'yicha saralangan ro'yxat
    const sortedFilteredStudents = useMemo(() => {
        let list = allStudents || [];

        if (gradeFilter) {
            list = list.filter((s) => s.gradeId === gradeFilter);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            const normalizedQ = q.replace(/[\s-]+/g, "");
            list = list.filter((s) => {
                const fullName = (s?.["Full name"] || "").toLowerCase();
                const name = (s?.Name || "").toLowerCase();
                const grade = (s?.gradeId || "").toLowerCase();
                return (
                    fullName.includes(q) ||
                    name.includes(q) ||
                    grade.replace(/[\s-]+/g, "").includes(normalizedQ)
                );
            });
        }

        return [...list].sort((a, b) => {
            const aIndex = GRADES.indexOf(a.gradeId);
            const bIndex = GRADES.indexOf(b.gradeId);
            const aPos = aIndex === -1 ? GRADES.length : aIndex;
            const bPos = bIndex === -1 ? GRADES.length : bIndex;
            if (aPos !== bPos) return aPos - bPos;
            return (a["Full name"] || "").localeCompare(b["Full name"] || "");
        });
    }, [allStudents, gradeFilter, searchQuery]);

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
                </div>
            </div>

            <BackButton to="/" label="Orqaga" />

            <div className="roster-controls">
                <StudentSearch
                    students={allStudents}
                    isLoading={isLoading}
                    onSelect={handleStudentClick}
                    onSearchChange={setSearchQuery}
                    autoOpenModal={false}
                />
                <GradeFilter grades={GRADES} value={gradeFilter} onChange={setGradeFilter} />
            </div>

            {error ? (
                <div className="roster-status" style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
                    <span>⚠️ Serverga ulanib bo‘lmadi (server uyg‘onmoqda).</span>
                    <button type="button" onClick={refetch} className="retry-btn" style={{ cursor: "pointer" }}>
                        🔄 Qayta urinish
                    </button>
                </div>
            ) : !dataAllowed ? (
                <div className="roster-status">🔒 Ma'lumotlar vaqtincha berkitilgan</div>
            ) : isLoading ? (
                <div className="roster-status">⏳ Yuklanmoqda...</div>
            ) : sortedFilteredStudents.length === 0 ? (
                <div className="roster-status">😕 Hech qanday o'quvchi topilmadi</div>
            ) : (
                <div className="roster-grid">
                    {sortedFilteredStudents.map((student, index) => (
                        <StudentCard
                            key={student.id ?? index}
                            student={student}
                            variant="compact"
                            dataAllowed={dataAllowed}
                            onSelect={handleStudentClick}
                        />
                    ))}
                </div>
            )}

            {selectedStudent && (
                <StudentModal
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                    dataAllowed={dataAllowed}
                />
            )}
        </div>
    );
}

export default AllStudents;
