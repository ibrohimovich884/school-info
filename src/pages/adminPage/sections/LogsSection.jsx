import { useEffect, useState, useMemo } from "react";
import { API_URL } from "../../../config.js";

function LogsSection() {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        setIsLoading(true);
        fetch(`${API_URL}/logs`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setLogs(Array.isArray(data.data) ? data.data : []);
                }
            })
            .catch((err) => console.error("Xatolik:", err))
            .finally(() => setIsLoading(false));
    }, []);

    // Ustunlar avtomatik
    const columns = useMemo(() => {
        if (logs.length === 0) return [];
        return Object.keys(logs[0]);
    }, [logs]);

    // Qidiruv va sana bo'yicha saralash bitta tezkor pass'da
    const sortedLogs = useMemo(() => {
        let result = logs;

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter((log) =>
                Object.values(log).some((val) =>
                    String(val ?? "").toLowerCase().includes(q)
                )
            );
        }

        const dateKey = columns.find((c) => /date|time|vaqt|sana/i.test(c));
        if (!dateKey) return result;

        return [...result].sort(
            (a, b) => new Date(b[dateKey] || 0) - new Date(a[dateKey] || 0)
        );
    }, [logs, search, columns]);

    return (
        <div className="admin-section">
            <h3 className="admin-section-title">Amallar tarixi (loglar)</h3>
            <p className="admin-section-desc">
                Admin tomonidan amalga oshirilgan barcha o'zgarishlar tarixi.
            </p>

            <input
                type="text"
                className="logs-search"
                style={{ minHeight: "40px" }}
                placeholder="Loglar ichidan qidirish..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {isLoading ? (
                <div className="admin-status">⏳ Yuklanmoqda...</div>
            ) : sortedLogs.length === 0 ? (
                <div className="admin-status">😕 Hozircha log topilmadi</div>
            ) : (
                <div className="logs-table-wrap">
                    <table className="logs-table">
                        <thead>
                            <tr>
                                {columns.map((col) => (
                                    <th key={col}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedLogs.map((log, index) => (
                                <tr key={index}>
                                    {columns.map((col) => (
                                        <td key={col} style={{ fontVariantNumeric: "tabular-nums" }}>
                                            {String(log[col] ?? "-")}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default LogsSection;

