import { useEffect, useState } from "react";
import "./AdminPage.css";

function AdminPage() {
	const [logs, setLogs] = useState([]);
	const [form, setForm] = useState({
		username: "",
		password: "",
		adminname: "",
		adminpassword: ""
	});

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

	// Inputlarni boshqarish
	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value
		});
	};

	// Parol yangilash
	const updatePassword = () => {
		// bo‘sh bo‘lmagan fieldlarni ajratib olish
		const filteredForm = Object.fromEntries(
			Object.entries(form).filter(([_, value]) => value.trim() !== "")
		);

		// agar hammasi bo‘sh bo‘lsa
		if (Object.keys(filteredForm).length === 0) {
			alert("Hech bo‘lmaganda bitta maydonni to‘ldiring!");
			return;
		}

		fetch("http://localhost:5000/updatePass", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(filteredForm)
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("Yangilandi:", data);
				alert("Ma'lumotlar yangilandi!");
				// xohlasang formani tozalash
				setForm({
					username: "",
					password: "",
					adminname: "",
					adminpassword: ""
				});
			})
			.catch((err) => console.error("Xatolik:", err));
	};


	return (
		<div className="admin-container">
			<div className="admin-card">

				<button
					className="hide"
					onClick={() => {
						fetch("https://four0-mak-server-3.onrender.com/hideData/hide", {
							method: "POST",
							headers: {
								"Content-Type": "application/json"
							},
							body: JSON.stringify({ students_data: false })
						})
							.then(res => res.json())
							.then(data => console.log("Berkitildi:", data))
							.catch(err => console.error("Xatolik:", err));
					}}
				>
					Ma'lumotlarni berkitish
				</button>

				{/* Ma’lumotlarni ochish */}
				<button
					className="show"
					onClick={() => {
						fetch("https://four0-mak-server-3.onrender.com/hideData/hide", {
							method: "POST",
							headers: {
								"Content-Type": "application/json"
							},
							body: JSON.stringify({ students_data: true })
						})
							.then(res => res.json())
							.then(data => console.log("Ochildi:", data))
							.catch(err => console.error("Xatolik:", err));
					}}
				>
					Ma'lumotlarni ko'rish
				</button>
				<div className="cards">
					<input
						type="text"
						name="username"
						placeholder="Username"
						value={form.username}
						onChange={handleChange}
					/>

					<input
						type="text"
						name="password"
						placeholder="Password"
						value={form.password}
						onChange={handleChange}
					/>

					<input
						type="text"
						name="adminname"
						placeholder="Adminname"
						value={form.adminname}
						onChange={handleChange}
					/>

					<input
						type="text"
						name="adminpassword"
						placeholder="Admin password"
						value={form.adminpassword}
						onChange={handleChange}
					/>
					<button className="update-btn" onClick={updatePassword}>
						Ma'lumotlarni yangilash
					</button>
				</div>

			</div>
		</div>
	);
}

export default AdminPage;
