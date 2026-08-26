import { useParams } from "react-router";
import { useState } from "react";
import { useStudents } from "../../hooks/useStudents.js";
import StudentCard from "../../components/studentCard/StudentCard.jsx";
import "../Grade.css";

function GradePage() {
	const { gradeId } = useParams();
	const [activeIndex, setActiveIndex] = useState(null);
	const { getByGrade, isLoading, dataAllowed } = useStudents();

	if (isLoading) return <p>⏳ Yuklanmoqda...</p>;

	const students = getByGrade(gradeId);

	return (
		<div className="grade">
			<h2>{gradeId.toUpperCase()} sinf o‘quvchilari</h2>

			<div className="card-list">
				{students.map((student, idx) => (
					<StudentCard
						key={student.id ?? idx}
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
