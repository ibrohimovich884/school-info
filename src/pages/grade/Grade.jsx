import { useParams } from "react-router";
import { useEffect, useState } from "react";
import ProfileCard from "../ProfileCard.jsx";
import "../Grade.css";

function GradePage() {
	const { gradeId } = useParams();
	const [gradeData, setGradeData] = useState(null);
	const [activeIndex, setActiveIndex] = useState(null);
	const [dataAllowed, setDataAllowed] = useState(false);

	useEffect(() => {
		// Ma'lumot ko‘rinishini tekshirish 
		fetch("https://four0-mak-server-3.onrender.com/hideData/hide")
			.then(res => res.json())
			.then(data => {
				console.log(data);
				setDataAllowed(data?.data?.students_data === true);
			})
			.catch(err => console.error("Visibility fetch xato:", err));

	}, []);

	useEffect(() => {
		fetch(`https://four0-mak-server-3.onrender.com/grades/${gradeId}`)
			.then(res => res.json())
			.then(data => setGradeData(data))
			.catch(err => console.error("Fetch error:", err));
	}, [gradeId]);

	if (!gradeData) return <p>⏳ Yuklanmoqda...</p>;

	const students = gradeData[`Grade${gradeId}`] || [];

	return (
		<div className="grade">
			<h2>{gradeId.toUpperCase()} sinf o‘quvchilari</h2>

			<div className="card-list">
				{students.map((student, idx) => (
					<ProfileCard
						key={idx}
						info={student}
						index={idx}
						activeIndex={activeIndex}
						setActiveIndex={setActiveIndex}
						dataAllowed={dataAllowed}
					/>
				))}
			</div>
		</div>
	);
}

export default GradePage;
