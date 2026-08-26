import { useEffect } from "react";
import { trackEvent } from "../../utils/tracking.js";
import "./StudentCard.css";

/**
 * YAGONA KARTA KOMPONENTI.
 *
 * Ilgari bitta o'quvchi ma'lumoti ikki xil joyda, ikki xil komponentda
 * (ProfileCard.jsx va AllStudents.jsx ichidagi "student-badge" divi) alohida
 * render qilinardi. Maydon nomi o'zgarsa yoki yangi logika (masalan
 * dataAllowed tekshiruvi) qo'shilsa, ikkalasini ham qo'lda yangilash kerak
 * bo'lardi — bu xatoga olib keluvchi manba edi.
 *
 * Endi bitta komponent, ikkita ko'rinish (variant):
 *   - variant="compact"  -> "Barcha o'quvchilar" ro'yxati uchun (rasm+ism+sinf)
 *   - variant="detailed" -> Sinf sahifasi uchun (bosilganda batafsil ochiladi)
 *
 * Ikkala variant ham BIR XIL dataAllowed tekshiruvidan o'tadi, shuning uchun
 * admin ma'lumotlarni berkitsa, bu BARCHA ko'rinishlarda bir vaqtda amal qiladi.
 */
function StudentCard({
	student,
	variant = "detailed",
	dataAllowed = true,
	isActive = false,
	onToggle,
	onSelect,
}) {
	const isInactive = student.Status && student.Status !== "Active";

	useEffect(() => {
		if (variant === "detailed" && isActive) {
			trackEvent("viewStudent", {
				studentId: student.id,
				name: student["Full name"] || student.Name,
				gradeId: student.gradeId,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isActive]);

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
			<div className="student-card compact" onClick={() => onSelect?.(student)}>
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
									onClick={(e) => e.stopPropagation()}
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
