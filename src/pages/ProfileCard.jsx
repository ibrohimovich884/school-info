import { useEffect, useState } from "react";
import { trackEvent } from "../utils/tracking.js";
import "./Grade.css";

function isValidInstagram(handle) {
	if (!handle || handle === "Unknown") return false;
	const cleaned = handle.trim();
	if (cleaned.length < 5) return false;
	return true;
}

function ProfileCard({ info, index, activeIndex, setActiveIndex, dataAllowed }) {

	const isActive = activeIndex === index;
	const isInactive = info.Status !== "Active";
	const [cachedInfo, setCachedInfo] = useState(() => info);

	// Karta ochilib, batafsil ma'lumot ko'rsatilganda kuzatuvga yozamiz
	useEffect(() => {
		if (isActive) {
			trackEvent("viewStudent", {
				studentId: info.id,
				name: info["Full name"] || info.Name,
				gradeId: info.gradeId,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isActive]);

	useEffect(() => {
		const cacheKey = `profile-${info.id}`;
		const cached = sessionStorage.getItem(cacheKey);
		const freshString = JSON.stringify(info);

		if (cached) {
			try {
				const parsed = JSON.parse(cached);
				// Agar backenddan kelgan info eskirgan keshdan farq qilsa, keshni yangilaymiz
				if (JSON.stringify(parsed) !== freshString) {
					sessionStorage.setItem(cacheKey, freshString);
					setCachedInfo(info);
				} else {
					setCachedInfo(parsed);
				}
			} catch {
				// Kesh buzilgan bo'lsa, uni tashlab, yangi ma'lumotni saqlaymiz
				sessionStorage.setItem(cacheKey, freshString);
				setCachedInfo(info);
			}
		} else {
			sessionStorage.setItem(cacheKey, freshString);
			setCachedInfo(info);
		}
	}, [info]);

	if (!dataAllowed) {
		return (
			<div className="profile-card locked">
				<img src="/students/default.jpg" alt="Error!" />
				<p>Ma’lumot topilmadi!</p>
			</div>
		);
	}

	const handleToggle = () => setActiveIndex(isActive ? null : index);

	const handleKeyDown = (e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleToggle();
		}
	};

	const instagramValid = isValidInstagram(cachedInfo.Instagram);

	return (
		<div
        className={`profile-card ${isActive ? "open" : ""} ${isInactive ? "status-inactive" : ""}`}			onClick={handleToggle}
			onKeyDown={handleKeyDown}
			role="button"
			tabIndex={0}
			aria-expanded={isActive}
		>
			<img
				src={cachedInfo?.Image || "/students/default.jpg"}
				alt={cachedInfo.Name}
			/>

			<div className="profile-info">
				<h2>{cachedInfo.Name}</h2>

				{isActive ? (
					<div className="details">
						<p><strong>Full name:</strong> {cachedInfo["Full name"]}</p>
						<p><strong>Birthday:</strong> {cachedInfo.Birthday}</p>
						<p><strong>Gaplashgan:</strong> {cachedInfo.Talked}</p>
						<p>
							<strong>Instagram:</strong>{" "}
							{instagramValid ? (
								<a
									href={`https://instagram.com/${cachedInfo.Instagram}`}
									target="_blank"
									rel="noreferrer"
									onClick={(e) => e.stopPropagation()}
								>
									{cachedInfo.Instagram}
								</a>
							) : (
								"Unknown"
							)}
						</p>
						<p><strong>Yangilanish:</strong> {cachedInfo.updateTime || "2025-09-03"}</p>

						{cachedInfo.Status !== "Active" && (
							<>
								<p><strong>Status:</strong> {cachedInfo.Status}{cachedInfo.StatusReason ? ` (${cachedInfo.StatusReason})` : ""}</p>
								<p><strong>Ketgan joyi:</strong> {cachedInfo.TransferredTo || "Aniqlanmagan"}</p>
								<p><strong>Ketgan vaqti:</strong> {cachedInfo.StatusChangedAt || "Noma'lum"}</p>
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

export default ProfileCard;	