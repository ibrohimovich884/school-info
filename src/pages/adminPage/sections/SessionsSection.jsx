import { useEffect, useState, useMemo, useCallback } from "react";
import { API_URL } from "../../../config.js";
import { getLocalEvents, clearLocalEvents } from "../../../utils/tracking.js";
import "./shared/AdminCard.css";

const EVENT_ICONS = {
    search_open: "🔍",
    viewStudentDetails: "📋",
    studentAction: "⚡",
    search: "🔎",
    viewStudent: "👤",
    pageView: "🌐",
    login: "🔐",
};

const EVENT_NAMES = {
    search_open: "Qidirib ochdi",
    viewStudentDetails: "Sinfda ma'lumot ko'rdi",
    studentAction: "Amal bajardi",
    search: "Qidiruv so'zi",
    viewStudent: "Profilni ochdi",
    pageView: "Sahifaga kirdi",
    login: "Kirish",
};

function SessionsSection({ showNotify }) {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterType, setFilterType] = useState("all");
    const [filterGrade, setFilterGrade] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedVisitor, setSelectedVisitor] = useState(null);
    const [autoRefresh, setAutoRefresh] = useState(true);

    const fetchAllEvents = useCallback((isManual = false) => {
        // Faqat birinchi marta yoki qo'lda tugma bosilganda indicator ko'rsatiladi
        if (isManual || events.length === 0) {
            setIsLoading(true);
        }
        
        fetch(`${API_URL}/track`)
            .then((res) => res.json())
            .then((data) => {
                const serverData = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
                const localData = getLocalEvents();

                const combined = [...localData, ...serverData];
                const seen = new Set();
                const unique = [];

                for (let i = 0; i < combined.length; i++) {
                    const item = combined[i];
                    if (!item) continue;
                    const key = `${item.visitorId}_${item.time}_${item.type}_${item.studentId || item.query || ""}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        unique.push(item);
                    }
                }

                unique.sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0));
                setEvents(unique);
            })
            .catch(() => {
                const localData = getLocalEvents();
                localData.sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0));
                setEvents(localData);
            })
            .finally(() => setIsLoading(false));
    }, [events.length]);

    useEffect(() => {
        fetchAllEvents(false);

        const handleNewEvent = (e) => {
            if (e?.detail) {
                setEvents((prev) => {
                    const newEv = e.detail;
                    const exists = prev.some(
                        (item) => item.visitorId === newEv.visitorId && item.time === newEv.time && item.type === newEv.type
                    );
                    if (exists) return prev;
                    return [newEv, ...prev];
                });
            }
        };

        window.addEventListener("tracked_event_recorded", handleNewEvent);

        let interval = null;
        if (autoRefresh) {
            // Avto-yangilash 12 soniyada fonsiz (silent) ishlaydi
            interval = setInterval(() => fetchAllEvents(false), 12000);
        }

        return () => {
            window.removeEventListener("tracked_event_recorded", handleNewEvent);
            if (interval) clearInterval(interval);
        };
    }, [fetchAllEvents, autoRefresh]);

    // Filtrlar
    const filteredEvents = useMemo(() => {
        let list = events;

        if (filterType !== "all") {
            list = list.filter((e) => e.type === filterType);
        }

        if (filterGrade !== "all") {
            const target = filterGrade.toLowerCase();
            list = list.filter((e) => (e.gradeId || "").toLowerCase() === target);
        }

        if (selectedVisitor) {
            list = list.filter((e) => e.visitorId === selectedVisitor);
        }

        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            list = list.filter((e) => {
                const name = (e.name || "").toLowerCase();
                const query = (e.query || "").toLowerCase();
                const vId = (e.visitorId || "").toLowerCase();
                const path = (e.path || "").toLowerCase();
                const action = (e.action || "").toLowerCase();
                const grade = (e.gradeId || "").toLowerCase();
                const fields = Array.isArray(e.fieldsViewed) ? e.fieldsViewed.join(" ") : "";
                
                return (
                    name.includes(q) ||
                    query.includes(q) ||
                    vId.includes(q) ||
                    path.includes(q) ||
                    action.includes(q) ||
                    grade.includes(q) ||
                    fields.toLowerCase().includes(q)
                );
            });
        }

        return list;
    }, [events, filterType, filterGrade, selectedVisitor, searchTerm]);

    // Asosiy ko'rsatkichlar (KPI)
    const stats = useMemo(() => {
        let total = 0;
        let searchOpens = 0;
        let detailViews = 0;
        let actions = 0;
        const visitorSet = new Set();

        for (let i = 0; i < events.length; i++) {
            const e = events[i];
            total++;
            if (e.visitorId) visitorSet.add(e.visitorId);
            if (e.type === "search_open") searchOpens++;
            else if (e.type === "viewStudentDetails") detailViews++;
            else if (e.type === "studentAction") actions++;
        }

        return { total, searchOpens, detailViews, actions, uniqueUsers: visitorSet.size };
    }, [events]);

    // Sinflar ro'yxati (filtrlash uchun)
    const availableGrades = useMemo(() => {
        const grades = new Set();
        for (let i = 0; i < events.length; i++) {
            if (events[i].gradeId) grades.add(events[i].gradeId.toLowerCase());
        }
        return Array.from(grades).sort();
    }, [events]);

    const handleClearLocal = () => {
        if (window.confirm("Mahalliy monitoring keshi tozalansinmi?")) {
            clearLocalEvents();
            fetchAllEvents(true);
            if (showNotify) showNotify("Mahalliy monitoring buferi tozalandi", "info");
        }
    };

    return (
        <div className="admin-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                <div style={{ flex: "1 1 260px" }}>
                    <h3 className="admin-section-title">Foydalanuvchi nazorati va qidiruv tahlili</h3>
                    <p className="admin-section-desc">
                        Foydalanuvchilar qidirib ochgan o'quvchilar va sinf sahifasida ko'rgan ma'lumotlarining jonli monitoringi.
                    </p>
                </div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                    <button
                        type="button"
                        onClick={() => fetchAllEvents(true)}
                        style={{ padding: "8px 12px", fontSize: "12px", background: "#f1f5f9", color: "#334155", borderRadius: "8px", minHeight: "36px" }}
                    >
                        🔄 Yangilash
                    </button>
                    <button
                        type="button"
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        style={{
                            padding: "8px 12px",
                            fontSize: "12px",
                            background: autoRefresh ? "#dcfce7" : "#fee2e2",
                            color: autoRefresh ? "#166534" : "#991b1b",
                            borderRadius: "8px",
                            minHeight: "36px",
                            fontWeight: 600,
                        }}
                    >
                        {autoRefresh ? "● Jonli (Har 12s)" : "○ To'xtatilgan"}
                    </button>
                    <button
                        type="button"
                        onClick={handleClearLocal}
                        title="Mahalliy keshni tozalash"
                        style={{ padding: "8px 10px", fontSize: "12px", background: "#fff1f2", color: "#be123c", borderRadius: "8px", minHeight: "36px" }}
                    >
                        🧹
                    </button>
                </div>
            </div>

            {/* KPI Vidjetlari */}
            <div className="stats-summary">
                <div className="stat-box" style={{ borderLeft: "3px solid #3b82f6" }}>
                    <span className="stat-number">{stats.uniqueUsers}</span>
                    <span className="stat-label">Noyob userlar</span>
                </div>
                <div className="stat-box" style={{ borderLeft: "3px solid #f59e0b" }}>
                    <span className="stat-number">{stats.searchOpens}</span>
                    <span className="stat-label">Qidirib ochilgan</span>
                </div>
                <div className="stat-box" style={{ borderLeft: "3px solid #10b981" }}>
                    <span className="stat-number">{stats.detailViews}</span>
                    <span className="stat-label">Sinfda ko'rilgan</span>
                </div>
                <div className="stat-box" style={{ borderLeft: "3px solid #8b5cf6" }}>
                    <span className="stat-number">{stats.actions}</span>
                    <span className="stat-label">Amallar</span>
                </div>
            </div>

            {/* Filtrlar paneli */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center", background: "#f8fafc", padding: "10px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <input
                    type="text"
                    className="logs-search"
                    style={{ flex: "1 1 180px", minHeight: "40px" }}
                    placeholder="Ism, qidiruv so'zi, Visitor ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    style={{ flex: "1 1 140px", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff", minHeight: "40px" }}
                >
                    <option value="all">Barcha amallar</option>
                    <option value="search_open">🔍 Qidirib ochilganlar</option>
                    <option value="viewStudentDetails">📋 Sinfda ma'lumot ko'rilganlar</option>
                    <option value="studentAction">⚡ Instagram / Amallar</option>
                    <option value="search">🔎 Qidiruv so'rovlari</option>
                </select>

                <select
                    value={filterGrade}
                    onChange={(e) => setFilterGrade(e.target.value)}
                    style={{ flex: "1 1 110px", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff", minHeight: "40px" }}
                >
                    <option value="all">Barcha sinflar</option>
                    {availableGrades.map((g) => (
                        <option key={g} value={g}>{g.toUpperCase()}-sinf</option>
                    ))}
                </select>

                {selectedVisitor && (
                    <button
                        type="button"
                        onClick={() => setSelectedVisitor(null)}
                        style={{ padding: "6px 10px", fontSize: "12px", background: "#e0e7ff", color: "#3730a3", borderRadius: "8px", minHeight: "40px" }}
                    >
                        User: {selectedVisitor.slice(0, 8)} ✕
                    </button>
                )}
            </div>

            {/* Asosiy Natijalar Lentalari */}
            {isLoading && events.length === 0 ? (
                <div className="admin-status">⏳ Yuklanmoqda...</div>
            ) : filteredEvents.length === 0 ? (
                <div className="admin-status">
                    Hozircha mos keluvchi foydalanuvchi harakati topilmadi.
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {filteredEvents.map((item, index) => {
                        const icon = EVENT_ICONS[item.type] || "📌";
                        const typeName = EVENT_NAMES[item.type] || item.type;
                        const isSearchOpen = item.type === "search_open";
                        const isDetailView = item.type === "viewStudentDetails";
                        const isAction = item.type === "studentAction";
                        const timeStr = item.time ? new Date(item.time).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "-";
                        const dateStr = item.time ? new Date(item.time).toLocaleDateString("uz-UZ") : "";

                        return (
                            <div
                                key={index}
                                style={{
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "12px",
                                    padding: "12px 14px",
                                    background: isSearchOpen
                                        ? "#fffdf5"
                                        : isDetailView
                                        ? "#f0fdf4"
                                        : isAction
                                        ? "#faf5ff"
                                        : "#ffffff",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "8px",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                                        <span style={{ fontSize: "16px" }}>{icon}</span>
                                        <span
                                            style={{
                                                fontSize: "11px",
                                                fontWeight: "700",
                                                padding: "3px 8px",
                                                borderRadius: "6px",
                                                background: isSearchOpen ? "#fef3c7" : isDetailView ? "#dcfce7" : isAction ? "#f3e8ff" : "#f1f5f9",
                                                color: isSearchOpen ? "#92400e" : isDetailView ? "#166534" : isAction ? "#6b21a8" : "#334155",
                                            }}
                                        >
                                            {typeName}
                                        </span>

                                        {item.gradeId && (
                                            <span style={{ fontSize: "11px", fontWeight: "600", color: "#475569", background: "#e2e8f0", padding: "2px 6px", borderRadius: "4px" }}>
                                                {item.gradeId.toUpperCase()}-sinf
                                            </span>
                                        )}
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748b", flexWrap: "wrap" }}>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedVisitor(item.visitorId)}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                padding: 0,
                                                minHeight: "auto",
                                                cursor: "pointer",
                                                textDecoration: "underline",
                                                color: "#3b82f6",
                                                fontSize: "12px",
                                                fontWeight: 500,
                                            }}
                                            title="Foydalanuvchining barcha harakatlarini saralash"
                                        >
                                            User: {(item.visitorId || "Noma'lum").slice(0, 8)}
                                        </button>
                                        <span>•</span>
                                        <span style={{ fontVariantNumeric: "tabular-nums" }}>{dateStr} {timeStr}</span>
                                    </div>
                                </div>

                                {/* Kontent qismi */}
                                <div style={{ fontSize: "13px", color: "#1e293b", wordBreak: "break-word" }}>
                                    {isSearchOpen && (
                                        <div>
                                            <span style={{ color: "#64748b" }}>Qidiruv so'zi: </span>
                                            <strong style={{ background: "#fef08a", padding: "2px 6px", borderRadius: "4px" }}>
                                                "{item.query || "(bo'sh)"}"
                                            </strong>
                                            <span style={{ margin: "0 6px" }}>➔</span>
                                            <span style={{ color: "#64748b" }}>Ochilgan o'quvchi: </span>
                                            <strong style={{ color: "#0f172a" }}>{item.name || item.studentId}</strong>
                                        </div>
                                    )}

                                    {isDetailView && (
                                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                            <div>
                                                <span style={{ color: "#64748b" }}>O'quvchi: </span>
                                                <strong style={{ color: "#0f172a" }}>{item.name || item.studentId}</strong>
                                                {item.durationSec > 0 && (
                                                    <span style={{ marginLeft: "10px", fontSize: "12px", color: "#059669", fontWeight: "600", fontVariantNumeric: "tabular-nums" }}>
                                                        ⏱ {item.durationSec}s ko'rildi
                                                    </span>
                                                )}
                                            </div>

                                            {Array.isArray(item.fieldsViewed) && item.fieldsViewed.length > 0 && (
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                                                    <span style={{ fontSize: "11px", color: "#64748b", alignSelf: "center", marginRight: "4px" }}>
                                                        Ko'rilgan ma'lumotlar:
                                                    </span>
                                                    {item.fieldsViewed.map((f, i) => (
                                                        <span
                                                            key={i}
                                                            style={{
                                                                background: "#e0f2fe",
                                                                color: "#0369a1",
                                                                fontSize: "11px",
                                                                padding: "2px 6px",
                                                                borderRadius: "4px",
                                                                border: "1px solid #bae6fd",
                                                            }}
                                                        >
                                                            {f}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {isAction && (
                                        <div>
                                            <span style={{ color: "#64748b" }}>Amal: </span>
                                            <strong style={{ color: "#7e22ce" }}>
                                                {item.action === "click_instagram"
                                                    ? `Instagram profiliga o'tdi (@${item.instagram || ""})`
                                                    : item.action === "navigate_grade"
                                                    ? `Sinf sahifasiga o'tdi (${item.targetGrade?.toUpperCase()})`
                                                    : item.action}
                                            </strong>
                                            <span style={{ margin: "0 8px", color: "#64748b" }}>|</span>
                                            <span>O'quvchi: <strong>{item.name}</strong></span>
                                        </div>
                                    )}

                                    {!isSearchOpen && !isDetailView && !isAction && (
                                        <div>
                                            {item.type === "search" ? (
                                                <>
                                                    <span style={{ color: "#64748b" }}>Qidiruv: </span>
                                                    <strong>"{item.query}"</strong>
                                                    <span style={{ color: "#64748b", marginLeft: "6px" }}>({item.resultCount ?? 0} ta natija)</span>
                                                </>
                                            ) : item.type === "pageView" ? (
                                                <>
                                                    <span style={{ color: "#64748b" }}>Sahifa: </span>
                                                    <code style={{ background: "#f1f5f9", padding: "2px 4px", borderRadius: "4px" }}>{item.path}</code>
                                                </>
                                            ) : (
                                                <span>{JSON.stringify(item)}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default SessionsSection;

