import { useEffect, useState, useMemo } from "react";
import { API_URL } from "../../../config.js";

const TYPE_LABELS = {
    pageView: "Sahifa ko'rildi",
    login: "Kirdi",
    search: "Qidirdi",
    search_open: "Qidirib ochdi",
    viewStudent: "O'quvchini ko'rdi",
    viewStudentDetails: "Sinfda ma'lumot ko'rdi",
    studentAction: "Amal bajardi",
};

function VisitsSection() {
    const [visits, setVisits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");

    useEffect(() => {
        setIsLoading(true);
        setLoadError(false);
        fetch(`${API_URL}/track`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setVisits(Array.isArray(data.data) ? data.data : []);
                } else {
                    setLoadError(true);
                }
            })
            .catch((err) => {
                console.error("Xatolik:", err);
                setLoadError(true);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const visitTypes = useMemo(() => {
        const set = new Set();
        for (let i = 0; i < visits.length; i++) {
            if (visits[i].type) set.add(visits[i].type);
        }
        return Array.from(set);
    }, [visits]);

    // Filtr va tartiblash bitta muvozanatli pass'da
    const sortedVisits = useMemo(() => {
        let result = visits;

        if (typeFilter) {
            result = result.filter((v) => v.type === typeFilter);
        }

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter((v) => {
                const vId = (v.visitorId || "").toLowerCase();
                const type = (v.type || "").toLowerCase();
                const path = (v.path || "").toLowerCase();
                const query = (v.query || "").toLowerCase();
                const name = (v.name || "").toLowerCase();
                const ip = (v.ip || "").toLowerCase();
                const ua = (v.userAgent || "").toLowerCase();
                return (
                    vId.includes(q) ||
                    type.includes(q) ||
                    path.includes(q) ||
                    query.includes(q) ||
                    name.includes(q) ||
                    ip.includes(q) ||
                    ua.includes(q)
                );
            });
        }

        return [...result].sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0));
    }, [visits, search, typeFilter]);

    const uniqueVisitorCount = useMemo(() => {
        const set = new Set();
        for (let i = 0; i < visits.length; i++) {
            if (visits[i].visitorId) set.add(visits[i].visitorId);
        }
        return set.size;
    }, [visits]);

    return (
        <div className="admin-section">
            <h3 className="admin-section-title">Tashriflar va kirish tarixi</h3>
            <p className="admin-section-desc">
                Foydalanuvchilarning kirish, qidiruv va sahifalar tarixi. Jami{" "}
                <strong style={{ color: "#1e293b" }}>{uniqueVisitorCount}</strong> ta noyob tashrifchi.
            </p>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center", background: "#f8fafc", padding: "10px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <input
                    type="text"
                    className="logs-search"
                    style={{ flex: "1 1 200px", minHeight: "40px" }}
                    placeholder="Visitor ID, sahifa, qidiruv, IP..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    style={{ flex: "1 1 140px", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff", minHeight: "40px" }}
                >
                    <option value="">Barcha turlar</option>
                    {visitTypes.map((t) => (
                        <option key={t} value={t}>
                            {TYPE_LABELS[t] || t}
                        </option>
                    ))}
                </select>
            </div>

            {isLoading ? (
                <div className="admin-status">⏳ Yuklanmoqda...</div>
            ) : loadError ? (
                <div className="admin-status">
                    ⚠️ Tashriflarni olib bo'lmadi. Backend ulanishini tekshiring.
                </div>
            ) : sortedVisits.length === 0 ? (
                <div className="admin-status">😕 Hozircha tashrif qayd etilmagan</div>
            ) : (
                <div className="logs-table-wrap">
                    <table className="logs-table">
                        <thead>
                            <tr>
                                <th>Visitor ID</th>
                                <th>Turi</th>
                                <th>Sahifa / Tafsilot</th>
                                <th>IP</th>
                                <th>Brauzer</th>
                                <th>Vaqt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedVisits.map((v, index) => (
                                <tr key={index}>
                                    <td style={{ fontVariantNumeric: "tabular-nums" }}>{(v.visitorId || "-").slice(0, 8)}</td>
                                    <td>
                                        <span style={{ fontSize: "11px", fontWeight: "600", padding: "2px 6px", borderRadius: "4px", background: "#f1f5f9", color: "#334155" }}>
                                            {TYPE_LABELS[v.type] || v.type || "-"}
                                        </span>
                                    </td>
                                    <td>
                                        {v.type === "search_open"
                                            ? `"${v.query || ''}" ➔ ${v.name || v.studentId}`
                                            : v.type === "viewStudentDetails"
                                            ? `${v.name || v.studentId} (${(v.fieldsViewed || []).length} ta ma'lumot, ${v.durationSec || 0}s)`
                                            : v.type === "studentAction"
                                            ? `${v.action}: ${v.name || v.studentId}`
                                            : v.type === "search" && v.query
                                            ? `"${v.query}" (${v.resultCount ?? "?"} natija)`
                                            : v.type === "viewStudent"
                                            ? v.name || v.studentId || "-"
                                            : v.type === "login"
                                            ? (v.role === "admin" ? "Admin sifatida" : "Foydalanuvchi sifatida")
                                            : v.path || "-"}
                                    </td>
                                    <td style={{ fontVariantNumeric: "tabular-nums" }}>{v.ip || "-"}</td>
                                    <td style={{ maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis" }}>{v.userAgent || "-"}</td>
                                    <td style={{ fontVariantNumeric: "tabular-nums" }}>{v.time ? new Date(v.time).toLocaleString("uz-UZ") : "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default VisitsSection;

