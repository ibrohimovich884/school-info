import { useState, useEffect, useRef, useMemo } from "react";
import { useStudents } from "../../hooks/useStudents.js";
import { trackEvent, trackSearchOpen } from "../../utils/tracking.js";
import StudentModal from "../studentModal/StudentModal.jsx";
import "./StudentSearch.css";

/**
 * Qayta ishlatiladigan ixcham va sodda qidiruv komponenti.
 *
 * Biror o'quvchi qidirilganda uni sinfga emas, to'g'ridan-to'g'ri o'sha o'quvchini
 * batafsil ko'rish modalida (yoki berilgan onSelect orqali) topib beradi.
 *
 * Props:
 *   students       - ixtiyoriy o'quvchilar ro'yxati (berilmasa markaziy hookdan oladi)
 *   isLoading      - tashqaridan yuklanish holati
 *   onSelect       - tanlanganda chaqiriladi (student) => void.
 *   onSearchChange - input o'zgarganda chaqiriladi (query) => void (ro'yxatni sinxron filtrlash uchun)
 *   placeholder    - input matni
 *   autoOpenModal  - tanlanganda modalni avtomatik ochish (standart: true)
 */
function StudentSearch({
    students,
    isLoading: isLoadingProp,
    onSelect,
    onSearchChange,
    placeholder,
    autoOpenModal = true,
}) {
    const shouldFetch = students === undefined;
    const { students: hookStudents, isLoading: hookLoading, dataAllowed } = useStudents();
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const wrapperRef = useRef(null);
    const listRef = useRef(null);

    const allStudents = shouldFetch ? hookStudents : students;
    const isLoading = shouldFetch ? hookLoading : !!isLoadingProp;

    // Tashqariga bosilganda yopish
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false);
                setHighlightedIndex(-1);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Qidiruv algoritmi: Ism, to'liq ism, sinf (masalan "10a", "9-b") va instagram
    const filteredStudents = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return [];

        const normalizedQuery = query.replace(/[\s-]+/g, "");

        return (allStudents || []).filter((student) => {
            const fullName = (student?.["Full name"] || "").toLowerCase();
            const name = (student?.Name || "").toLowerCase();
            const grade = (student?.gradeId || "").toLowerCase();
            const instagram = (student?.Instagram || "").toLowerCase();

            const gradeClean = grade.replace(/[\s-]+/g, "");
            const gradeWithSinf = `${gradeClean}sinf`;

            return (
                fullName.includes(query) ||
                name.includes(query) ||
                instagram.includes(query) ||
                gradeClean.includes(normalizedQuery) ||
                gradeWithSinf.includes(normalizedQuery)
            );
        }).slice(0, 8); // Ixchamlik: bir vaqtning o'zida eng mos 8 ta natija
    }, [searchTerm, allStudents]);

    // Qidiruv statistikasi (debounce)
    useEffect(() => {
        const query = searchTerm.trim();
        if (!query) return;

        const timer = setTimeout(() => {
            trackEvent("search", { query, resultCount: filteredStudents.length });
        }, 500);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    const handleChange = (e) => {
        const val = e.target.value;
        setSearchTerm(val);
        setIsOpen(true);
        setHighlightedIndex(-1);
        if (onSearchChange) {
            onSearchChange(val);
        }
    };

    const clearSearch = () => {
        setSearchTerm("");
        setIsOpen(false);
        setHighlightedIndex(-1);
        if (onSearchChange) {
            onSearchChange("");
        }
    };

    const handleSelect = (student) => {
        setIsOpen(false);
        setHighlightedIndex(-1);

        // Qidirib ochilgan hodisasini yozamiz
        trackSearchOpen(searchTerm, student, "search_dropdown");

        if (onSelect) {
            onSelect(student);
        }

        if (autoOpenModal) {
            setSelectedStudent(student);
        }
    };

    const handleKeyDown = (e) => {
        if (!isOpen || filteredStudents.length === 0) {
            if (e.key === "Enter" && filteredStudents.length > 0) {
                e.preventDefault();
                handleSelect(filteredStudents[0]);
            }
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex((prev) =>
                prev < filteredStudents.length - 1 ? prev + 1 : 0
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((prev) =>
                prev > 0 ? prev - 1 : filteredStudents.length - 1
            );
        } else if (e.key === "Enter") {
            e.preventDefault();
            const target = highlightedIndex >= 0
                ? filteredStudents[highlightedIndex]
                : filteredStudents[0];
            if (target) {
                handleSelect(target);
            }
        } else if (e.key === "Escape") {
            setIsOpen(false);
        }
    };

    return (
        <>
            <div className="student-search" ref={wrapperRef}>
                <div className="student-search-input-wrapper">
                    <svg
                        className="student-search-icon"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                        <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>

                    <input
                        type="text"
                        placeholder={placeholder || "O'quvchini qidirish..."}
                        value={searchTerm}
                        onChange={handleChange}
                        onFocus={() => setIsOpen(true)}
                        onKeyDown={handleKeyDown}
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
                    <div className="student-search-results" ref={listRef}>
                        {isLoading ? (
                            <div className="student-search-status">⏳ Yuklanmoqda...</div>
                        ) : filteredStudents.length > 0 ? (
                            filteredStudents.map((student, index) => {
                                const isHighlighted = index === highlightedIndex;
                                const fullName = student["Full name"] || student.Name;
                                const grade = student.gradeId ? `${student.gradeId.toUpperCase()}-sinf` : "";
                                const isInactive = student.Status && student.Status !== "Active";

                                return (
                                    <div
                                        key={student.id ?? index}
                                        className={`student-search-item ${isHighlighted ? "active" : ""}`}
                                        onClick={() => handleSelect(student)}
                                        onMouseEnter={() => setHighlightedIndex(index)}
                                    >
                                        <img
                                            src={student.Image || "/students/default.jpg"}
                                            alt={fullName}
                                            onError={(e) => { e.target.src = "/students/default.jpg"; }}
                                        />
                                        <div className="student-search-info">
                                            <p className="student-search-name">{fullName}</p>
                                            <div className="student-search-meta">
                                                {grade && <span className="student-search-grade">{grade}</span>}
                                                {isInactive && (
                                                    <span className="student-search-status-tag">Arxiv</span>
                                                )}
                                            </div>
                                        </div>
                                        <span className="student-search-action-hint">Ko'rish →</span>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="student-search-status">Hech qanday o'quvchi topilmadi</div>
                        )}
                    </div>
                )}
            </div>

            {selectedStudent && (
                <StudentModal
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                    dataAllowed={dataAllowed}
                />
            )}
        </>
    );
}

export default StudentSearch;