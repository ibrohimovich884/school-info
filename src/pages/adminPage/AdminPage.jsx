import { useEffect, useState } from "react";
import Notification from "../../components/notification/Notification.jsx";
import "./AdminPage.css";

function AdminPage() {
    const [logs, setLogs] = useState([]);
    const [form, setForm] = useState({
        username: "",
        password: "",
        adminname: "",
        adminpassword: ""
    });
    const [notify, setNotify] = useState(null);

    const showNotify = (msg, type = "success") => {
        setNotify({ msg, type });
        // 3 soniyadan keyin xabarnomani o'chirish (ixtiyoriy)
        setTimeout(() => setNotify(null), 3000);
    };

    // Loglarni olish
    useEffect(() => {
        fetch("https://four0-mak-server-3.onrender.com/logs")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setLogs(data.data);
                }
            })
            .catch((err) => console.error("Xatolik:", err));
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Ma'lumotlarni berkitish yoki ochish uchun umumiy funksiya
    const handleToggleData = (status) => {
        fetch("https://four0-mak-server-3.onrender.com/hideData/hide", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ students_data: status })
        })
        .then(res => res.json())
        .then(data => {
            const msg = status ? "Ma'lumotlar ochildi!" : "Ma'lumotlar berkitildi!";
            showNotify(msg, "success");
        })
        .catch(err => {
            console.error("Xatolik:", err);
            showNotify("Xatolik yuz berdi!", "error");
        });
    };

    const updatePassword = () => {
        const filteredForm = Object.fromEntries(
            Object.entries(form).filter(([_, value]) => value.trim() !== "")
        );

        if (Object.keys(filteredForm).length === 0) {
            alert("Hech bo‘lmaganda bitta maydonni to‘ldiring!");
            return;
        }

        fetch("https://four0-mak-server-3.onrender.com/updatePass", { // URL to'g'irlandi
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filteredForm)
        })
        .then((res) => res.json())
        .then((data) => {
            showNotify("Ma'lumotlar yangilandi!", "success");
            setForm({ username: "", password: "", adminname: "", adminpassword: "" });
        })
        .catch((err) => {
            console.error("Xatolik:", err);
            showNotify("Xatolik yuz berdi!", "error");
        });
    };

    return (
        <div className="admin-container">
            {notify && (
                <Notification
                    message={notify.msg}
                    type={notify.type}
                    onClose={() => setNotify(null)}
                />
            )}

            <div className="admin-card">
                <div className="action-buttons">
                    <button className="hide" onClick={() => handleToggleData(false)}>
                        Ma'lumotlarni berkitish
                    </button>
                    <button className="show" onClick={() => handleToggleData(true)}>
                        Ma'lumotlarni ko'rish
                    </button>
                </div>

                <div className="cards">
                    <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} />
                    <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
                    <input type="text" name="adminname" placeholder="Adminname" value={form.adminname} onChange={handleChange} />
                    <input type="password" name="adminpassword" placeholder="Admin password" value={form.adminpassword} onChange={handleChange} />
                    
                    <button className="update-btn" onClick={updatePassword}>
                        Ma'lumotlarni yangilash
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminPage;