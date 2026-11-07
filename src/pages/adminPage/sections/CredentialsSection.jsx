import { useState } from "react";
import { API_URL } from "../../../config.js";

function CredentialsSection({ showNotify }) {
    const [form, setForm] = useState({
        username: "",
        password: "",
        adminname: "",
        adminpassword: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const updatePassword = () => {
        const filteredForm = Object.fromEntries(
            Object.entries(form).filter(([, value]) => value.trim() !== "")
        );

        if (Object.keys(filteredForm).length === 0) {
            showNotify("Hech bo'lmaganda bitta maydonni to'ldiring!", "error");
            return;
        }

        fetch(`${API_URL}/updatePass`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filteredForm)
        })
            .then((res) => res.json())
            .then(() => {
                showNotify("Ma'lumotlar yangilandi!", "success");
                setForm({ username: "", password: "", adminname: "", adminpassword: "" });
            })
            .catch((err) => {
                console.error("Xatolik:", err);
                showNotify("Xatolik yuz berdi!", "error");
            });
    };

    return (
        <div className="admin-section">
            <h3 className="admin-section-title">Login va parolni yangilash</h3>
            <p className="admin-section-desc">
                Faqat to'ldirilgan maydonlar yangilanadi, bo'sh qoldirilganlar o'zgarishsiz qoladi.
            </p>
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
    );
}

export default CredentialsSection;
