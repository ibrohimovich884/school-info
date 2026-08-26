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

    // Jadval ustunlari log obyektining kalitlaridan avtomatik olinadi,
    // shuning uchun backend log formatini o'zgartirsa ham jadval buzilmaydi.
    const columns = useMemo(() => {
        if (logs.length === 0) return [];
        return Object.keys(logs[0]);
    }, [logs]);

    const filteredLogs = useMemo(() => {
        if (!search.trim()) return logs;
        const q = search.toLowerCase();
        return logs.filter((log) =>
            Object.values(log).some((value) =>
                String(value ?? "").toLowerCase().includes(q)
            )
        );
    }, [logs, search]);

    // Sana/vaqt maydoni topilsa, eng yangi loglar tepada chiqadi
    const sortedLogs = useMemo(() => {
        const dateKey = columns.find((c) => /date|time|vaqt|sana/i.test(c));
        if (!dateKey) return filteredLogs;
        return [...filteredLogs].sort(
            (a, b) => new Date(b[dateKey]) - new Date(a[dateKey])
        );
    }, [filteredLogs, columns]);

    return (
        <div className="admin-section">
            <h3 className="admin-section-title">Amallar tarixi (loglar)</h3>
            <p className="admin-section-desc">
                Admin tomonidan amalga oshirilgan barcha o'zgarishlar shu yerda ko'rinadi.
            </p>

            <input
                type="text"
                className="logs-search"
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
                                        <td key={col}>{String(log[col] ?? "-")}</td>
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
