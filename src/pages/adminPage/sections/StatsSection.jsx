import { useEffect, useState, useMemo } from "react";
import { API_URL } from "../../../config.js";

// AllStudents.jsx dagi ro'yxat bilan bir xil bo'lishi kerak
const GRADES = ["8a", "8b", "9a", "9b", "10a", "10b", "10d"];

function StatsSection() {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetch(`${API_URL}/all-students`)
            .then((res) => res.json())
            .then((data) => setStudents(Array.isArray(data) ? data : []))
            .catch((err) => console.error("Xatolik:", err))
            .finally(() => setIsLoading(false));
    }, []);

    const gradeCounts = useMemo(() => {
        return GRADES.map((grade) => ({
            grade,
            count: students.filter((s) => s.gradeId === grade).length
        }));
    }, [students]);

    const statusCounts = useMemo(() => {
        const active = students.filter((s) => s.Status === "Active").length;
        const inactive = students.filter((s) => s.Status === "Inactive").length;
        return { active, inactive };
    }, [students]);

    // DIQQAT: Gender maydoni saytda qanday qiymatlar bilan saqlanishiga
    // aniq ishonch hosil qilmadim ("male"/"female" deb faraz qildim) —
    // agar boshqacha bo'lsa (masalan "M"/"F"), shu joyni moslashtirish kerak bo'ladi.
    const genderCounts = useMemo(() => {
        const boys = students.filter((s) => s.Gender === "male").length;
        const girls = students.filter((s) => s.Gender === "female").length;
        return { boys, girls, other: students.length - boys - girls };
    }, [students]);

    const maxGradeCount = Math.max(1, ...gradeCounts.map((g) => g.count));

    if (isLoading) {
        return <div className="admin-status">⏳ Yuklanmoqda...</div>;
    }

    return (
        <div className="admin-section">
            <h3 className="admin-section-title">Statistika</h3>
            <p className="admin-section-desc">Jami {students.length} ta o'quvchi</p>

            <div className="stats-summary">
                <div className="stat-box">
                    <span className="stat-number">{statusCounts.active}</span>
                    <span className="stat-label">Faol</span>
                </div>
                <div className="stat-box">
                    <span className="stat-number">{statusCounts.inactive}</span>
                    <span className="stat-label">Faol emas</span>
                </div>
                <div className="stat-box">
                    <span className="stat-number">{genderCounts.boys}</span>
                    <span className="stat-label">O'g'il bola</span>
                </div>
                <div className="stat-box">
                    <span className="stat-number">{genderCounts.girls}</span>
                    <span className="stat-label">Qiz bola</span>
                </div>
            </div>

            <div className="grade-bars">
                {gradeCounts.map(({ grade, count }) => (
                    <div key={grade} className="grade-bar-row">
                        <span className="grade-bar-label">{grade.toUpperCase()}</span>
                        <div className="grade-bar-track">
                            <div
                                className="grade-bar-fill"
                                style={{ width: `${(count / maxGradeCount) * 100}%` }}
                            />
                        </div>
                        <span className="grade-bar-count">{count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StatsSection;
