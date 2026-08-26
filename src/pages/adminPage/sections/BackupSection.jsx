import { useState } from "react";
import { API_URL } from "../../../config.js";

function BackupSection({ showNotify }) {
    const [isLoading, setIsLoading] = useState(false);

    const downloadBackup = async () => {
        setIsLoading(true);
        try {
            const [studentsRes, logsRes] = await Promise.all([
                fetch(`${API_URL}/all-students`).then((r) => r.json()),
                fetch(`${API_URL}/logs`).then((r) => r.json())
            ]);

            const backup = {
                exportedAt: new Date().toISOString(),
                students: Array.isArray(studentsRes) ? studentsRes : [],
                logs: logsRes?.success ? logsRes.data : []
            };

            const blob = new Blob([JSON.stringify(backup, null, 2)], {
                type: "application/json"
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            const dateStr = new Date().toISOString().slice(0, 10);
            link.href = url;
            link.download = `backup-${dateStr}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            showNotify("Zaxira fayli yuklandi!", "success");
        } catch (err) {
            console.error("Xatolik:", err);
            showNotify("Zaxira olishda xatolik yuz berdi!", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-section">
            <h3 className="admin-section-title">Ma'lumotlarni zaxiralash</h3>
            <p className="admin-section-desc">
                Barcha o'quvchilar va loglarni bitta JSON faylga yuklab oling. Sayt qayta ishga
                tushirilishidan oldin (masalan yangi deploy qilishdan avval) shu tugmani bosib,
                joriy holatni saqlab qo'ying — aks holda JSON fayllardagi ma'lumot restart bilan
                birga yo'qolib qolishi mumkin.
            </p>
            <button className="update-btn" onClick={downloadBackup} disabled={isLoading}>
                {isLoading ? "Tayyorlanmoqda..." : "Zaxira faylini yuklab olish"}
            </button>
        </div>
    );
}

export default BackupSection;