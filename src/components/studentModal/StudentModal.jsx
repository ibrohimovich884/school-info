import { useEffect } from "react";
import { useNavigate } from "react-router";
import { trackEvent } from "../../utils/tracking.js";
import "./StudentModal.css";

function isValidInstagram(handle) {
    if (!handle || handle === "Unknown") return false;
    const cleaned = handle.trim();
    return cleaned.length >= 4;
}

function StudentModal({ student, onClose, dataAllowed = true }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (!student) return;
        trackEvent("viewStudent", {
            studentId: student.id,
            name: student["Full name"] || student.Name,
            gradeId: student.gradeId,
        });

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [student, onClose]);

    if (!student) return null;

    const isInactive = student.Status && student.Status !== "Active";
    const instagramValid = isValidInstagram(student.Instagram);
    const gradeLabel = student.gradeId ? `${student.gradeId.toUpperCase()}-sinf` : "";
    const fullName = student["Full name"] || student.Name || "Noma'lum o'quvchi";

    const handleGoToClass = () => {
        onClose();
        if (student.gradeId) {
            const target = student.id || encodeURIComponent(fullName);
            navigate(`/grade/${student.gradeId}?student=${target}`);
        }
    };

    return (
        <div className="student-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
            <div
                className="student-modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className="student-modal-close"
                    onClick={onClose}
                    aria-label="Yopish"
                >
                    ✕
                </button>

                {!dataAllowed ? (
                    <div className="student-modal-locked">
                        <img src="/students/default.jpg" alt="Locked" />
                        <p>Ma'lumotlar vaqtincha berkitilgan</p>
                    </div>
                ) : (
                    <>
                        <div className="student-modal-header">
                            <div className="student-modal-avatar-wrapper">
                                <img
                                    src={student.Image || "/students/default.jpg"}
                                    alt={fullName}
                                    onError={(e) => { e.target.src = "/students/default.jpg"; }}
                                    className="student-modal-avatar"
                                />
                            </div>

                            <div className="student-modal-title-group">
                                <h3 className="student-modal-name">{student.Name || fullName}</h3>
                                <div className="student-modal-badges">
                                    {gradeLabel && (
                                        <span className="student-modal-badge grade">
                                            {gradeLabel}
                                        </span>
                                    )}
                                    <span className={`student-modal-badge status ${isInactive ? "inactive" : "active"}`}>
                                        {isInactive ? (student.Status || "Arxiv") : "Faol"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="student-modal-body">
                            <div className="student-modal-row">
                                <span className="modal-label">To'liq ism</span>
                                <span className="modal-val">{fullName}</span>
                            </div>

                            <div className="student-modal-row">
                                <span className="modal-label">Tug'ilgan kun</span>
                                <span className="modal-val">{student.Birthday || "Noma'lum"}</span>
                            </div>

                            <div className="student-modal-row">
                                <span className="modal-label">Gaplashgan</span>
                                <span className="modal-val">{student.Talked || "Noma'lum"}</span>
                            </div>

                            <div className="student-modal-row">
                                <span className="modal-label">Instagram</span>
                                <span className="modal-val">
                                    {instagramValid ? (
                                        <a
                                            href={`https://instagram.com/${student.Instagram.replace(/^@/, '')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="modal-link"
                                        >
                                            @{student.Instagram.replace(/^@/, '')}
                                        </a>
                                    ) : (
                                        <span className="modal-val-muted">Mavjud emas</span>
                                    )}
                                </span>
                            </div>

                            <div className="student-modal-row">
                                <span className="modal-label">Yangilanish</span>
                                <span className="modal-val modal-val-mono">{student.updateTime || "2025-09-03"}</span>
                            </div>

                            {isInactive && (
                                <div className="student-modal-inactive-box">
                                    <div className="student-modal-row">
                                        <span className="modal-label">Holat sababi</span>
                                        <span className="modal-val">{student.StatusReason || "Keltirilmagan"}</span>
                                    </div>
                                    <div className="student-modal-row">
                                        <span className="modal-label">Ketgan joyi</span>
                                        <span className="modal-val">{student.TransferredTo || "Aniqlanmagan"}</span>
                                    </div>
                                    <div className="student-modal-row">
                                        <span className="modal-label">Ketgan vaqti</span>
                                        <span className="modal-val">{student.StatusChangedAt || "Noma'lum"}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="student-modal-actions">
                            {student.gradeId && (
                                <button
                                    type="button"
                                    className="student-modal-btn primary"
                                    onClick={handleGoToClass}
                                >
                                    {gradeLabel} sahifasiga o'tish →
                                </button>
                            )}
                            <button
                                type="button"
                                className="student-modal-btn secondary"
                                onClick={onClose}
                            >
                                Yopish
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default StudentModal;
