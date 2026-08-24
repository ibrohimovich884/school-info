import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { API_URL } from "../../config.js";
import "./StudentSearch.css";

/**
 * Qayta ishlatiladigan qidiruv komponenti.
 *
 * Ishlatish:
 *   <StudentSearch />
 *   yoki agar ma'lumot boshqa joyda allaqachon yuklangan bo'lsa (qayta so'rov yubormaslik uchun):
 *   <StudentSearch students={allStudents} isLoading={isLoading} />
 *
 * Props (barchasi ixtiyoriy):
 *   students   - o'quvchilar ro'yxati oldindan berilsa, o'zi fetch qilmaydi
 *   isLoading  - tashqaridan loading holatini boshqarish uchun
 *   onSelect   - natija bosilganda chaqiriladi (student) => void. Berilmasa /grade/:gradeId ga o'tadi
 *   placeholder- input placeholder matni
 */
function StudentSearch({ students, isLoading: isLoadingProp, onSelect, placeholder }) {
    const shouldFetch = students === undefined;

    const [internalStudents, setInternalStudents] = useState([]);
    const [internalLoading, setInternalLoading] = useState(shouldFetch);
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const wrapperRef = useRef(null);

    const allStudents = shouldFetch ? internalStudents : students;
    const isLoading = shouldFetch ? internalLoading : !!isLoadingProp;

    // Faqat props berilmagan holatda o'zi yuklaydi
    useEffect(() => {
        if (!shouldFetch) return;

        setInternalLoading(true);
        fetch(`${API_URL}/all-students`)
            .then(res => res.json())
            .then(data => setInternalStudents(Array.isArray(data) ? data : []))
            .catch(err => console.error("Qidiruv ma'lumotlarini yuklashda xato:", err))
            .finally(() => setInternalLoading(false));
    }, [shouldFetch]);

    // Tashqariga bosilganda yopish
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredStudents = searchTerm.trim() === ""
        ? []
        : (allStudents || []).filter(student =>
            (student?.["Full name"] || "").toLowerCase().includes(searchTerm.toLowerCase())
          );

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
        setIsOpen(true);
    };

    const clearSearch = () => {
        setSearchTerm("");
        setIsOpen(false);
    };

    const handleSelect = (student) => {
        setIsOpen(false);
        if (onSelect) {
            onSelect(student);
        } else if (student?.gradeId) {
            navigate(`/grade/${student.gradeId}`);
        }
    };

    return (
        <div className="student-search" ref={wrapperRef}>
            <div className="student-search-input-wrapper">
                <input
                    type="text"
                    placeholder={placeholder || "O'quvchini qidirish... (masalan: ek)"}
                    value={searchTerm}
                    onChange={handleChange}
                    onFocus={() => setIsOpen(true)}
                    className="student-search-input"
                />
                {searchTerm && (
                    <button
                        type="button"
                        className="student-search-clear-btn"
                        onClick={clearSearch}
                        aria-label="Qidiruvni tozalash"
                    >
                        ✕
                    </button>
                )}
            </div>

            {isOpen && searchTerm.trim() !== "" && (
                <div className="student-search-results">
                    {isLoading ? (
                        <div className="student-search-status">⏳ Yuklanmoqda...</div>
                    ) : filteredStudents.length > 0 ? (
                        filteredStudents.map((student, index) => (
                            <div
                                key={index}
                                className="student-search-item"
                                onClick={() => handleSelect(student)}
                            >
                                <img
                                    src={student.Image || "/students/default.jpg"}
                                    alt="avatar"
                                    onError={(e) => { e.target.src = "/students/default.jpg"; }}
                                />
                                <div className="student-search-info">
                                    <p className="student-search-name">{student["Full name"]}</p>
                                    <p className="student-search-grade">
                                        {student.gradeId ? `${student.gradeId.toUpperCase()}-sinf` : ""}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="student-search-status">😕 Hech narsa topilmadi</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default StudentSearch;