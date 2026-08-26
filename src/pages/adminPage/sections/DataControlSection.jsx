import { API_URL } from "../../../config.js";

function DataControlSection({ showNotify }) {
    // Ma'lumotlarni berkitish yoki ochish uchun umumiy funksiya
    const handleToggleData = (status) => {
        fetch(`${API_URL}/hideData/hide`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ students_data: status })
        })
            .then((res) => res.json())
            .then(() => {
                const msg = status ? "Ma'lumotlar ochildi!" : "Ma'lumotlar berkitildi!";
                showNotify(msg, "success");
            })
            .catch((err) => {
                console.error("Xatolik:", err);
                showNotify("Xatolik yuz berdi!", "error");
            });
    };

    return (
        <div className="admin-section">
            <h3 className="admin-section-title">Ma'lumotlarni ko'rsatish/berkitish</h3>
            <p className="admin-section-desc">
                Saytdagi o'quvchilar ma'lumotlarini vaqtincha barcha foydalanuvchilardan yashirish yoki qayta ko'rsatish.
            </p>
            <div className="action-buttons">
                <button className="hide" onClick={() => handleToggleData(false)}>
                    Ma'lumotlarni berkitish
                </button>
                <button className="show" onClick={() => handleToggleData(true)}>
                    Ma'lumotlarni ko'rish
                </button>
            </div>
        </div>
    );
}

export default DataControlSection;
