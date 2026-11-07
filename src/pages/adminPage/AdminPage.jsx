import { useState } from "react";
import Notification from "../../components/notification/Notification.jsx";
import BackButton from "../../components/backButton/BackButton.jsx";
import SessionsSection from "./sections/SessionsSection.jsx";
import DataControlSection from "./sections/DataControlSection.jsx";
import CredentialsSection from "./sections/CredentialsSection.jsx";
import LogsSection from "./sections/LogsSection.jsx";
import StatsSection from "./sections/StatsSection.jsx";
import BackupSection from "./sections/BackupSection.jsx";
import VisitsSection from "./sections/VisitsSection.jsx";
import "./AdminPage.css";
import "./sections/shared/AdminCard.css";

// Yangi bo'lim qo'shish uchun: 1) sections/ ichida yangi komponent yoz,
// 2) shu ro'yxatga bitta qator qo'sh. Boshqa joyga tegish shart emas.
const TABS = [
    { id: "control", label: "Nazorat (Control)", component: SessionsSection },
    { id: "data", label: "Ma'lumotlar", component: DataControlSection },
    { id: "credentials", label: "Login/Parol", component: CredentialsSection },
    { id: "logs", label: "Loglar", component: LogsSection },
    { id: "stats", label: "Statistika", component: StatsSection },
    { id: "backup", label: "Zaxiralash", component: BackupSection },
    { id: "visits", label: "Kirish tarixi", component: VisitsSection },
];

function AdminPage() {
    const [activeTab, setActiveTab] = useState(TABS[0].id);
    const [notify, setNotify] = useState(null);

    const showNotify = (msg, type = "success") => {
        setNotify({ msg, type });
        setTimeout(() => setNotify(null), 3000);
    };

    const ActiveComponent = TABS.find((tab) => tab.id === activeTab)?.component;

    return (
        <div className="admin-container">
            <BackButton to="/" label="Orqaga" />
            {notify && (
                <Notification
                    message={notify.msg}
                    type={notify.type}
                    onClose={() => setNotify(null)}
                />
            )}

            <div className="admin-shell">
                <nav className="admin-tabs">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            className={`admin-tab ${activeTab === tab.id ? "active" : ""}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <div className="admin-tab-content">
                    {ActiveComponent && <ActiveComponent showNotify={showNotify} />}
                </div>
            </div>
        </div>
    );
}

export default AdminPage;