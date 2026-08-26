import { useEffect, useState, useMemo } from "react";
import { API_URL } from "../../../config.js";

// type qiymatiga qarab o'zbekcha yorliq
const TYPE_LABELS = {
    pageView: "Sahifa ko'rildi",
    login: "Kirdi",
    search: "Qidirdi",
    viewStudent: "O'quvchini ko'rdi",
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

    const visitTypes = useMemo(
        () => [...new Set(visits.map((v) => v.type).filter(Boolean))],
        [visits]
    );

    const filteredVisits = useMemo(() => {
        let result = visits;

        if (typeFilter) {
            result = result.filter((v) => v.type === typeFilter);
        }

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter((v) =>
                [v.visitorId, v.type, v.path, v.query, v.name, v.ip, v.userAgent].some((value) =>
                    String(value ?? "").toLowerCase().includes(q)
                )
            );
        }

        return result;
    }, [visits, search, typeFilter]);

    const sortedVisits = useMemo(() => {
        return [...filteredVisits].sort((a, b) => new Date(b.time) - new Date(a.time));
    }, [filteredVisits]);

    const uniqueVisitorCount = useMemo(
        () => new Set(visits.map((v) => v.visitorId)).size,
        [visits]
    );

    return (
        <div className="admin-section">
            <h3 className="admin-section-title">Tashriflar va kirish tarixi</h3>
            <p className="admin-section-desc">
                Saytga kim, qachon, qaysi qurilmadan kirgani (login), qaysi sahifani ko'rgani,
                nimani qidirgani va qaysi o'quvchini ko'rgani shu yerda ko'rinadi. Jami{" "}
                {uniqueVisitorCount} ta noyob tashrifchi.
            </p>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
                <input
                    type="text"
                    className="logs-search"
                    placeholder="Visitor ID, sahifa, qidiruv so'zi, IP..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
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
                    ⚠️ Tashriflarni olib bo'lmadi. Backendda /track yo'li ishlayotganini tekshiring.
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
                                    <td>{(v.visitorId || "-").slice(0, 8)}</td>
                                    <td>{TYPE_LABELS[v.type] || v.type || "-"}</td>
                                    <td>
                                        {v.type === "search" && v.query
                                            ? `"${v.query}" (${v.resultCount ?? "?"} natija)`
                                            : v.type === "viewStudent"
                                            ? v.name || v.studentId || "-"
                                            : v.type === "login"
                                            ? (v.role === "admin" ? "Admin sifatida" : "Foydalanuvchi sifatida")
                                            : v.path || "-"}
                                    </td>
                                    <td>{v.ip || "-"}</td>
                                    <td>{v.userAgent || "-"}</td>
                                    <td>{v.time ? new Date(v.time).toLocaleString("uz-UZ") : "-"}</td>
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
