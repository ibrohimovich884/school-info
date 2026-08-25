import { useState, useRef, useEffect } from "react";
import "./GradeFilter.css";

/**
 * Sinf bo'yicha filter — dropdown ko'rinishida.
 *
 * Props:
 *   grades   - filterlanadigan sinflar ro'yxati (masalan ["8a","8b",...])
 *   value    - hozir tanlangan gradeId, yoki "" (Barchasi)
 *   onChange - (gradeId) => void, tanlov o'zgarganda chaqiriladi
 */
function GradeFilter({ grades, value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (grade) => {
        onChange(grade);
        setIsOpen(false);
    };

    return (
        <div className="grade-filter" ref={wrapperRef}>
            <button
                type="button"
                className={`grade-filter-trigger${value ? " active" : ""}`}
                onClick={() => setIsOpen(o => !o)}
            >
                <span className="grade-filter-trigger-label">
                    Sinf: <strong>{value ? value.toUpperCase() : "Barchasi"}</strong>
                </span>
                <svg
                    className={`grade-filter-chevron${isOpen ? " open" : ""}`}
                    width="12" height="12" viewBox="0 0 24 24" fill="none"
                >
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {isOpen && (
                <div className="grade-filter-menu">
                    <button
                        type="button"
                        className={`grade-filter-option${value === "" ? " selected" : ""}`}
                        onClick={() => handleSelect("")}
                    >
                        Barchasi
                        {value === "" && <span className="grade-filter-check">✓</span>}
                    </button>
                    {grades.map(grade => (
                        <button
                            key={grade}
                            type="button"
                            className={`grade-filter-option${value === grade ? " selected" : ""}`}
                            onClick={() => handleSelect(grade)}
                        >
                            {grade.toUpperCase()}
                            {value === grade && <span className="grade-filter-check">✓</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default GradeFilter;