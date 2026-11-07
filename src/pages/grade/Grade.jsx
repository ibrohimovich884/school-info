import { useParams, useSearchParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useStudents } from "../../hooks/useStudents.js";
import StudentCard from "../../components/studentCard/StudentCard.jsx";
import StudentSearch from "../../components/studentSearch/StudentSearch.jsx";
import "../Grade.css";

function GradePage() {
	const { gradeId } = useParams();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [activeIndex, setActiveIndex] = useState(null);
	const { getByGrade, isLoading, dataAllowed, error, refetch } = useStudents();

	const students = getByGrade(gradeId);
	const studentTarget = searchParams.get("student");

	// Agar URL orqali o'quvchi ko'rsatilgan bo'lsa (masalan qidiruvdan yoki modal orqali),
	// o'sha o'quvchini avtomatik ochib, sahifani unga qarab aylantiramiz
	useEffect(() => {
		if (!studentTarget || !students || students.length === 0) return;

		const target = decodeURIComponent(studentTarget).toLowerCase().trim();
		const idx = students.findIndex((s) => {
			const sId = String(s.id || "").toLowerCase();
			const sFullName = (s["Full name"] || "").toLowerCase();
			const sName = (s.Name || "").toLowerCase();
			return (
				sId === target ||
				sFullName === target ||
				sName === target ||
				sFullName.includes(target) ||
				sName.includes(target)
			);
		});

		if (idx !== -1) {
			setActiveIndex(idx);
			setTimeout(() => {
				const el = document.getElementById(`student-card-${idx}`);
				if (el) {
					el.scrollIntoView({ behavior: "smooth", block: "center" });
					el.classList.add("highlight-pulse");
					setTimeout(() => el.classList.remove("highlight-pulse"), 2500);
				}
			}, 160);
		}
	}, [studentTarget, students]);

	if (isLoading) return <p style={{ textAlign: "center", padding: "40px" }}>⏳ Yuklanmoqda...</p>;

	if (error) {
		return (
			<div className="grade" style={{ textAlign: "center", padding: "30px 15px" }}>
				<h2>{gradeId ? gradeId.toUpperCase() : ""} sinfi</h2>
				<p style={{ color: "#b91c1c", margin: "16px 0" }}>⚠️ Serverga ulanib bo‘lmadi (server uyg‘onmoqda).</p>
				<button
					type="button"
					onClick={refetch}
					style={{
						padding: "10px 20px",
						borderRadius: "8px",
						border: "none",
						background: "#facc15",
						fontWeight: "600",
						cursor: "pointer"
					}}
				>
					🔄 Qayta urinish
				</button>
			</div>
		);
	}

	const handleStudentSelect = (student) => {
		// Agar tanlangan o'quvchi shu sinfda bo'lsa, uni ochamiz va scroll qilamiz
		if (student.gradeId === gradeId) {
			const idx = students.findIndex((s) => (s.id && s.id === student.id) || s["Full name"] === student["Full name"]);
			if (idx !== -1) {
				setActiveIndex(idx);
				const el = document.getElementById(`student-card-${idx}`);
				if (el) {
					el.scrollIntoView({ behavior: "smooth", block: "center" });
					el.classList.add("highlight-pulse");
					setTimeout(() => el.classList.remove("highlight-pulse"), 2500);
				}
			}
		}
	};

	return (
		<div className="grade">
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
				<h2 style={{ margin: 0 }}>{gradeId.toUpperCase()} sinf o‘quvchilari</h2>
				<button
					type="button"
					onClick={() => navigate("/")}
					style={{
						padding: "6px 14px",
						borderRadius: "16px",
						border: "1px solid var(--line, #ddd)",
						background: "#fff",
						color: "var(--ink, #333)",
						cursor: "pointer",
						fontWeight: "600",
						fontSize: "0.85rem"
					}}
				>
					← Sinflar
				</button>
			</div>

			<div style={{ maxWidth: "440px", margin: "0 auto 24px" }}>
				<StudentSearch
					students={students}
					isLoading={isLoading}
					placeholder={`${gradeId.toUpperCase()}-sinfdan qidirish...`}
					onSelect={handleStudentSelect}
					autoOpenModal={false}
				/>
			</div>

			<div className="card-list">
				{students.map((student, idx) => (
					<StudentCard
						key={student.id ?? idx}
						id={`student-card-${idx}`}
						student={student}
						variant="detailed"
						dataAllowed={dataAllowed}
						isActive={activeIndex === idx}
						onToggle={() => setActiveIndex(activeIndex === idx ? null : idx)}
					/>
				))}
			</div>
		</div>
	);
}

export default GradePage;
