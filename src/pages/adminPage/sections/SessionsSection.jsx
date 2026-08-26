import { useEffect, useState, useMemo } from "react";
import { API_URL } from "../../../config.js";

function SessionsSection() {
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        setIsLoading(true);
        setLoadError(false);
        fetch(`${API_URL}/logs/session`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setSessions(Array.isArray(data.data) ? data.data : []);
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

    const filteredSessions = useMemo(() => {
        if (!search.trim()) return sessions;
        const q = search.toLowerCase();
        return sessions.filter((s) =>
            [s.sessionId, s.role, s.ip, s.userAgent].some((value) =>
                String(value ?? "").toLowerCase().includes(q)
            )
        );
    }, [sessions, search]);

    // Eng so'ngi kirishlar tepada
    const sortedSessions = useMemo(() => {
        return [...filteredSessions].sort(
            (a, b) => new Date(b.loggedInAt) - new Date(a.loggedInAt)
        );
    }, [filteredSessions]);

    return (
        <div className="admin-section">
            <h3 className="admin-section-title">Kirish tarixi</h3>
            <p className="admin-section-desc">
                Saytga qaysi qurilma/brauzer, qaysi IP manzildan, qachon va admin sifatidami yoki
                oddiy foydalanuvchi sifatida kirgani shu yerda ko'rinadi.
            </p>

            <input
                type="text"
                className="logs-search"
                placeholder="IP, sessiya yoki brauzer bo'yicha qidirish..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {isLoading ? (
                <div className="admin-status">⏳ Yuklanmoqda...</div>
            ) : loadError ? (
                <div className="admin-status">
                    ⚠️ Kirish tarixini olib bo'lmadi. Backendda /logs/session yo'li ishlayotganini tekshiring.
                </div>
            ) : sortedSessions.length === 0 ? (
                <div className="admin-status">😕 Hozircha kirish qayd etilmagan</div>
            ) : (
                <div className="logs-table-wrap">
                    <table className="logs-table">
                        <thead>
                            <tr>
                                <th>Sessiya</th>
                                <th>Turi</th>
                                <th>IP manzil</th>
                                <th>Brauzer</th>
                                <th>Vaqt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedSessions.map((s, index) => (
                                <tr key={index}>
                                    <td>{(s.sessionId || "-").slice(0, 8)}</td>
                                    <td>{s.role === "admin" ? "Admin" : "Foydalanuvchi"}</td>
                                    <td>{s.ip || "-"}</td>
                                    <td>{s.userAgent || "-"}</td>
                                    <td>
                                        {s.loggedInAt
                                            ? new Date(s.loggedInAt).toLocaleString("uz-UZ")
                                            : "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default SessionsSection;