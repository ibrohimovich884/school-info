import { useMemo } from "react";
import { useStudents } from "../../../hooks/useStudents.js";

const GRADES = ["8a", "8b", "9a", "9b", "10a", "10b", "10d"];

function StatsSection() {
    const { students, isLoading } = useStudents();

    // Bitta siklda barcha statistik ko'rsatkichlarni hisoblash (O(N) tezlikda)
    const { gradeCounts, statusCounts, genderCounts, maxGradeCount } = useMemo(() => {
        const gradeMap = {};
        GRADES.forEach((g) => (gradeMap[g] = 0));

        let active = 0;
        let inactive = 0;
        let boys = 0;
        let girls = 0;

        for (let i = 0; i < students.length; i++) {
            const s = students[i];

            // Sinflar
            if (s.gradeId && gradeMap[s.gradeId] !== undefined) {
                gradeMap[s.gradeId]++;
            }

            // Status
            if (s.Status === "Active") active++;
            else if (s.Status === "Inactive") inactive++;

            // Gender
            if (s.Gender === "male" || s.Gender === "M") boys++;
            else if (s.Gender === "female" || s.Gender === "F") girls++;
        }

        const countsList = GRADES.map((g) => ({
            grade: g,
            count: gradeMap[g] || 0,
        }));

        const maxCount = Math.max(1, ...countsList.map((g) => g.count));

        return {
            gradeCounts: countsList,
            statusCounts: { active, inactive },
            genderCounts: { boys, girls, other: Math.max(0, students.length - boys - girls) },
            maxGradeCount: maxCount,
        };
    }, [students]);

    if (isLoading) {
        return <div className="admin-status">⏳ Yuklanmoqda...</div>;
    }

    return (
        <div className="admin-section">
            <h3 className="admin-section-title">Statistika</h3>
            <p className="admin-section-desc">Jami {students.length} ta o'quvchi saqlangan</p>

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

