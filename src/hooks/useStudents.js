import { useEffect, useState, useCallback, useMemo } from "react";
import { API_URL } from "../config.js";

/**
 * YAGONA MARKAZIY DATA MANBAI.
 *
 * Ilgari har bir sahifa (GradePage, AllStudents, StudentSearch) o'zi alohida
 * fetch qilardi — natijada:
 *   1) "Ma'lumotlarni berkitish" (dataAllowed) faqat GradePage'da tekshirilardi,
 *      AllStudents esa buni umuman bilmasdi (xavfsizlik teshigi edi).
 *   2) Bir xil ma'lumot ikki xil so'rovda ikki marta yuklanardi.
 *
 * Endi BARCHA sahifalar shu bitta hookdan foydalanadi. Shu tufayli:
 *   - Admin panelda bosilgan "berkitish/ko'rsatish" tugmasi darhol BARCHA
 *     sahifalarga (Grade ham, AllStudents ham) bir vaqtda ta'sir qiladi.
 *   - Ma'lumot faqat bir marta yuklanadi va keshda saqlanadi.
 */

let cachedStudents = null; // Modul darajasidagi kesh — sahifalar orasida qayta ishlatiladi

export function useStudents() {
	const [students, setStudents] = useState(cachedStudents || []);
	const [isLoading, setIsLoading] = useState(!cachedStudents);
	const [dataAllowed, setDataAllowed] = useState(true);
	const [error, setError] = useState(null);

	const loadStudents = useCallback((force = false) => {
		if (cachedStudents && !force) {
			setStudents(cachedStudents);
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		fetch(`${API_URL}/all-students`)
			.then((res) => res.json())
			.then((data) => {
				const list = Array.isArray(data) ? data : [];
				cachedStudents = list;
				setStudents(list);
				setError(null);
			})
			.catch((err) => {
				setError("Serverga ulanib bo‘lmadi");
				console.warn("O'quvchilarni yuklashda xato:", err?.message || err);
			})
			.finally(() => setIsLoading(false));
	}, []);

	const loadVisibility = useCallback(() => {
		fetch(`${API_URL}/hideData/hide`)
			.then((res) => res.json())
			.then((data) => setDataAllowed(data?.data?.students_data === true))
			.catch((err) => console.warn("Visibility fetch xato:", err?.message || err));
	}, []);

	useEffect(() => {
		loadStudents();
		loadVisibility();
	}, [loadStudents, loadVisibility]);

	// Sinf bo'yicha guruhlangan ma'lumot kerak bo'lgan joylar uchun (masalan GradePage)
	const getByGrade = useCallback(
		(gradeId) => students.filter((s) => s.gradeId === gradeId),
		[students]
	);

	const refetch = useCallback(() => {
		loadStudents(true);
		loadVisibility();
	}, [loadStudents, loadVisibility]);

	return useMemo(
		() => ({ students, isLoading, dataAllowed, error, getByGrade, refetch }),
		[students, isLoading, dataAllowed, error, getByGrade, refetch]
	);
}
