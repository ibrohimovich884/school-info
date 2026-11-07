import { useEffect, useRef } from "react";
import { trackStudentDetailView, trackStudentAction } from "../../utils/tracking.js";
import "./StudentCard.css";

/**
 * YAGONA KARTA KOMPONENTI.
 */
function StudentCard({
	student,
	variant = "detailed",
	dataAllowed = true,
	isActive = false,
	onToggle,
	onSelect,
	id,
}) {
	const isInactive = student.Status && student.Status !== "Active";
	const openTimeRef = useRef(null);

	// Kartani ochganda qaysi maydonlar ko'ringanini aniqlash va vaqtni hisoblash
	useEffect(() => {
		if (variant !== "detailed") return;

		const fieldsViewed = [
			"Ism: " + (student.Name || "-"),
			"To'liq ism: " + (student["Full name"] || "-"),
			student.Birthday ? `Tug'ilgan kun: ${student.Birthday}` : null,
			student.Talked ? `Gaplashgan: ${student.Talked}` : null,
			student.Instagram ? `Instagram: @${student.Instagram}` : "Instagram: Yo'q",
			student.updateTime ? `Yangilanish: ${student.updateTime}` : null,
			isInactive ? `Status: ${student.Status || "Arxiv"} (${student.StatusReason || "Sababsiz"})` : null,
			isInactive && student.TransferredTo ? `Ketgan joyi: ${student.TransferredTo}` : null,
		].filter(Boolean);

		if (isActive) {
			openTimeRef.current = Date.now();
			// Kartani ochgani va qaysi ma'lumotlar ochilgani
			trackStudentDetailView(student, fieldsViewed, 0, "grade_page_card_open");
		} else if (openTimeRef.current) {
			// Kartani yopganda qancha vaqt ko'rganini qayd etish
			const durationSec = (Date.now() - openTimeRef.current) / 1000;
			if (durationSec >= 0.8) {
				trackStudentDetailView(student, fieldsViewed, durationSec, "grade_page_card_closed");
			}
			openTimeRef.current = null;
		}

		return () => {
			if (openTimeRef.current) {
				const durationSec = (Date.now() - openTimeRef.current) / 1000;
				if (durationSec >= 0.8) {
					trackStudentDetailView(student, fieldsViewed, durationSec, "grade_page_card_unmount");
				}
				openTimeRef.current = null;
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isActive, variant]);

	if (!dataAllowed) {
		return (
			<div className={`student-card ${variant} locked`}>
				<img src="/students/default.jpg" alt="Error!" />
				<p>Ma'lumot topilmadi!</p>
			</div>
		);
	}

	const handleImgError = (e) => {
		e.target.src = "/students/default.jpg";
	};

	// ---- Compact: "Barcha o'quvchilar" ro'yxati uchun ----
	if (variant === "compact") {
		return (
			<div id={id} className="student-card compact" onClick={() => onSelect?.(student)}>
				<div className="student-card-photo">
					<img
						src={student.Image || "/students/default.jpg"}
						alt={student["Full name"] || "avatar"}
						onError={handleImgError}
					/>
				</div>
				<p className="student-card-name">{student["Full name"] || "Noma'lum"}</p>
				<span className="student-card-tag">
					{student.gradeId ? `${student.gradeId.toUpperCase()}-sinf` : ""}
				</span>
			</div>
		);
	}

	// ---- Detailed: Sinf sahifasi uchun (bosilganda ochiladi) ----
	const instagramValid = isValidInstagram(student.Instagram);

	const handleKeyDown = (e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			onToggle?.();
		}
	};

	return (
		<div
			id={id}
			className={`student-card detailed ${isActive ? "open" : ""} ${isInactive ? "status-inactive" : ""}`}
			onClick={onToggle}
			onKeyDown={handleKeyDown}
			role="button"
			tabIndex={0}
			aria-expanded={isActive}
		>
			<img
				src={student.Image || "/students/default.jpg"}
				alt={student.Name}
				onError={handleImgError}
			/>

			<div className="student-card-info">
				<h2>{student.Name}</h2>

				{isActive ? (
					<div className="details">
						<p><strong>Full name:</strong> {student["Full name"]}</p>
						<p><strong>Birthday:</strong> {student.Birthday}</p>
						<p><strong>Gaplashgan:</strong> {student.Talked}</p>
						<p>
							<strong>Instagram:</strong>{" "}
							{instagramValid ? (
								<a
									href={`https://instagram.com/${student.Instagram}`}
									target="_blank"
									rel="noreferrer"
									onClick={(e) => {
										e.stopPropagation();
										trackStudentAction("click_instagram", student, { instagram: student.Instagram });
									}}
								>
									{student.Instagram}
								</a>
							) : (
								"Unknown"
							)}
						</p>
						<p><strong>Yangilanish:</strong> {student.updateTime || "2025-09-03"}</p>

						{isInactive && (
							<>
								<p><strong>Status:</strong> {student.Status}{student.StatusReason ? ` (${student.StatusReason})` : ""}</p>
								<p><strong>Ketgan joyi:</strong> {student.TransferredTo || "Aniqlanmagan"}</p>
								<p><strong>Ketgan vaqti:</strong> {student.StatusChangedAt || "Noma'lum"}</p>
							</>
						)}
					</div>
				) : (
					<p className="hint">Batafsil ko'rish uchun bos 👆</p>
				)}
			</div>
		</div>
	);
}

function isValidInstagram(handle) {
	if (!handle || handle === "Unknown") return false;
	const cleaned = handle.trim();
	if (cleaned.length < 5) return false;
	return true;
}

export default StudentCard;
