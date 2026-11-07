import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useStudents } from "../../hooks/useStudents.js";
import StudentModal from "../../components/studentModal/StudentModal.jsx";
import {
    getPastThreeBirthdays,
    getUpcomingBirthdays,
    MONTH_NAMES_UZ
} from "../../utils/birthdayUtils.js";
import "./Birthdays.css";

const GRADES = ["8a", "8b", "9a", "9b", "10a", "10b", "10d"];

function Birthdays() {
    const { students, isLoading, dataAllowed, error, refetch } = useStudents();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGrade, setSelectedGrade] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);

    const navigate = useNavigate();
    const todayDate = useMemo(() => new Date(), []);

    // 1. Eng yaqin o'tib ketgan 3 ta tug'ilgan kun egasi (xira qilib ko'rsatiladi)
    const pastThreeBirthdays = useMemo(() => {
        if (!students || students.length === 0) return [];
        return getPastThreeBirthdays(students, todayDate);
    }, [students, todayDate]);

    // 2. Barcha yaqinlashayotgan tug'ilgan kunlar
    const allUpcoming = useMemo(() => {
        if (!students || students.length === 0) return [];
        return getUpcomingBirthdays(students, todayDate);
    }, [students, todayDate]);

    // Filterlangan yaqinlashayotgan tug'ilgan kunlar
    const filteredUpcoming = useMemo(() => {
        return allUpcoming.filter(item => {
            const student = item.student;

            // Sinf bo'yicha filter
            if (selectedGrade && student.gradeId !== selectedGrade) {
                return false;
            }

            // Oy bo'yicha filter
            if (selectedMonth !== "" && item.monthIndex !== Number(selectedMonth)) {
                return false;
            }

            // Qidiruv (ism yoki sinf)
            if (searchQuery.trim()) {
                const q = searchQuery.trim().toLowerCase();
                const fullName = (student["Full name"] || "").toLowerCase();
                const name = (student.Name || "").toLowerCase();
                const grade = (student.gradeId || "").toLowerCase();
                return fullName.includes(q) || name.includes(q) || grade.includes(q);
            }

            return true;
        });
    }, [allUpcoming, selectedGrade, selectedMonth, searchQuery]);

    // Bugungi tug'ilgan kunlar soni
    const todayBirthdaysCount = useMemo(() => {
        return allUpcoming.filter(item => item.isToday).length;
    }, [allUpcoming]);

    // Eng yaqin bo'ladigan tug'ilgan kun egasi
    const nearestUpcoming = useMemo(() => {
        return allUpcoming.length > 0 ? allUpcoming[0] : null;
    }, [allUpcoming]);

    const handleImgError = (e) => {
        e.target.src = "/students/default.jpg";
    };

    return (
        <div className="birthdays-page">
            {/* Header */}
            <div className="birthdays-header">
                <div className="birthdays-heading">
                    <p className="birthdays-eyebrow">40-MAKTAB · TUG'ILGAN KUNLAR TAQVIMI</p>
                    <h2 className="birthdays-title">Tug'ilgan kunlar 🎂</h2>
                    <p className="birthdays-subtitle">
                        Sinfdoshlar va o'quvchilarning yaqinlashayotgan hamda yaqinda o'tib ketgan tug'ilgan kunlari
                    </p>
                </div>

                <div className="birthdays-header-actions">
                    <button type="button" className="back-btn" onClick={() => navigate("/")}>
                        ← Orqaga
                    </button>
                </div>
            </div>

            {/* General status checks */}
            {error ? (
                <div className="birthdays-status-box">
                    <span>⚠️ Serverga ulanib bo‘lmadi.</span>
                    <button type="button" onClick={refetch} className="back-btn">
                        🔄 Qayta urinish
                    </button>
                </div>
            ) : !dataAllowed ? (
                <div className="birthdays-status-box">🔒 Ma'lumotlar vaqtincha berkitilgan</div>
            ) : isLoading ? (
                <div className="birthdays-status-box">⏳ Tug'ilgan kunlar yuklanmoqda...</div>
            ) : (
                <>
                    {/* Key Stats Bar */}
                    <div className="birthdays-stats-grid">
                        <div className="stat-card stat-today">
                            <div className="stat-icon">🎉</div>
                            <div className="stat-info">
                                <span className="stat-label">Bugun tug'ilganlar</span>
                                <span className="stat-value">{todayBirthdaysCount} ta</span>
                            </div>
                        </div>

                        {nearestUpcoming && (
                            <div className="stat-card stat-next">
                                <div className="stat-icon">⏰</div>
                                <div className="stat-info">
                                    <span className="stat-label">Eng yaqin tug'ilgan kun</span>
                                    <span className="stat-value-highlight">
                                        {nearestUpcoming.student.Name || nearestUpcoming.student["Full name"]}
                                    </span>
                                    <span className="stat-sub">
                                        {nearestUpcoming.isToday
                                            ? "Bugun! 🥳"
                                            : nearestUpcoming.isTomorrow
                                                ? "Ertaga"
                                                : `${nearestUpcoming.daysUntilNext} kundan keyin (${nearestUpcoming.formattedDate})`}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="stat-card stat-total">
                            <div className="stat-icon">🎈</div>
                            <div className="stat-info">
                                <span className="stat-label">Taqvimda mavjud</span>
                                <span className="stat-value">{allUpcoming.length} ta o'quvchi</span>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 1: O'TIB KETGAN 3 TA USER (XIRA QILIB KO'RSATILADI) */}
                    {pastThreeBirthdays.length > 0 && (
                        <div className="birthdays-section past-section">
                            <div className="section-header">
                                <div className="section-title-wrap">
                                    <h3 className="section-title">
                                        ⏳ Yaqinda o'tib ketgan tug'ilgan kunlar
                                    </h3>
                                    <span className="section-badge past-badge">3 ta user · Xira holatda</span>
                                </div>
                                <p className="section-desc">
                                    Yaqinda bo'lib o'tgan tug'ilgan kunlar ro'yxati (oxirgi 3 ta)
                                </p>
                            </div>

                            <div className="past-cards-grid">
                                {pastThreeBirthdays.map((item) => {
                                    const { student, formattedDate, daysSinceLast } = item;
                                    const gradeLabel = student.gradeId ? `${student.gradeId.toUpperCase()}-sinf` : "";
                                    const fullName = student["Full name"] || student.Name || "O'quvchi";

                                    return (
                                        <div
                                            key={`past-${student.id || student.Name}`}
                                            className="birthday-card past-dimmed"
                                            onClick={() => setSelectedStudent(student)}
                                            role="button"
                                            tabIndex={0}
                                        >
                                            <div className="card-photo-wrap">
                                                <img
                                                    src={student.Image || "/students/default.jpg"}
                                                    alt={fullName}
                                                    onError={handleImgError}
                                                    className="card-photo"
                                                />
                                                <span className="past-tag-overlay">O'tib ketdi</span>
                                            </div>

                                            <div className="card-details">
                                                <div className="card-top">
                                                    <h4 className="student-name">{student.Name || fullName}</h4>
                                                    {gradeLabel && <span className="grade-badge">{gradeLabel}</span>}
                                                </div>
                                                <p className="student-fullname">{fullName}</p>
                                                <div className="card-footer-info">
                                                    <span className="bday-date">🗓️ {formattedDate}</span>
                                                    <span className="days-ago-badge">
                                                        {daysSinceLast === 1 ? "Kecha o'tdi" : `${daysSinceLast} kun oldin`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* SECTION 2: YAQINLASHAYOTGAN TUG'ILGAN KUNLAR */}
                    <div className="birthdays-section upcoming-section">
                        <div className="section-header">
                            <div className="section-title-wrap">
                                <h3 className="section-title">
                                    🎂 Yaqinlashayotgan tug'ilgan kunlar
                                </h3>
                                <span className="section-count">{filteredUpcoming.length} ta o'quvchi</span>
                            </div>
                            <p className="section-desc">
                                Eng yaqin kundan boshlab tartiblangan tug'ilgan kunlar ro'yxati
                            </p>
                        </div>

                        {/* Search & Filters */}
                        <div className="birthday-filters">
                            <div className="search-box">
                                <span className="search-icon">🔍</span>
                                <input
                                    type="text"
                                    placeholder="O'quvchi ismi yoki sinfini qidirish..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        className="clear-search-btn"
                                        onClick={() => setSearchQuery("")}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            <div className="filter-group">
                                <select
                                    value={selectedGrade}
                                    onChange={(e) => setSelectedGrade(e.target.value)}
                                    aria-label="Sinf bo'yicha saralash"
                                    className="filter-select"
                                >
                                    <option value="">Barcha sinflar</option>
                                    {GRADES.map(g => (
                                        <option key={g} value={g}>{g.toUpperCase()}-sinf</option>
                                    ))}
                                </select>

                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    aria-label="Oy bo'yicha saralash"
                                    className="filter-select"
                                >
                                    <option value="">Barcha oylar</option>
                                    {MONTH_NAMES_UZ.map((m, idx) => (
                                        <option key={m} value={idx}>{m}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Upcoming Grid */}
                        {filteredUpcoming.length === 0 ? (
                            <div className="no-results-box">
                                <span>😕 Mos keladigan tug'ilgan kunlar topilmadi</span>
                            </div>
                        ) : (
                            <div className="upcoming-cards-grid">
                                {filteredUpcoming.map((item) => {
                                    const { student, formattedDate, daysUntilNext, isToday, isTomorrow } = item;
                                    const gradeLabel = student.gradeId ? `${student.gradeId.toUpperCase()}-sinf` : "";
                                    const fullName = student["Full name"] || student.Name || "O'quvchi";

                                    return (
                                        <div
                                            key={`upcoming-${student.id || student.Name}`}
                                            className={`birthday-card upcoming-card ${isToday ? "card-today" : isTomorrow ? "card-tomorrow" : ""}`}
                                            onClick={() => setSelectedStudent(student)}
                                            role="button"
                                            tabIndex={0}
                                        >
                                            <div className="card-photo-wrap">
                                                <img
                                                    src={student.Image || "/students/default.jpg"}
                                                    alt={fullName}
                                                    onError={handleImgError}
                                                    className="card-photo"
                                                />
                                                {isToday && (
                                                    <span className="today-ribbon">🥳 BUGUN!</span>
                                                )}
                                                {isTomorrow && (
                                                    <span className="tomorrow-ribbon">⭐ ERTAGA!</span>
                                                )}
                                            </div>

                                            <div className="card-details">
                                                <div className="card-top">
                                                    <h4 className="student-name">{student.Name || fullName}</h4>
                                                    {gradeLabel && <span className="grade-badge">{gradeLabel}</span>}
                                                </div>
                                                <p className="student-fullname">{fullName}</p>
                                                
                                                <div className="card-footer-info">
                                                    <span className="bday-date">🗓️ {formattedDate}</span>
                                                    <span className={`days-until-badge ${isToday ? "is-today" : isTomorrow ? "is-tomorrow" : ""}`}>
                                                        {isToday
                                                            ? "Bugun!"
                                                            : isTomorrow
                                                                ? "Ertaga"
                                                                : `${daysUntilNext} kundan keyin`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Student Detail Modal */}
            {selectedStudent && (
                <StudentModal
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                    dataAllowed={dataAllowed}
                />
            )}
        </div>
    );
}

export default Birthdays;
