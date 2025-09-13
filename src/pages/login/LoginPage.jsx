// pages/login/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router";
import "./LoginPage.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Oddiy tekshiruv (keyinchalik backendga ulash mumkin)
    if (username === "Oybek" && password === "1234") {
      localStorage.setItem("isLoggedIn", "true"); // loginni eslab qoladi
      navigate("/"); // asosiy sahifaga o'tkazadi
    } else {
      setError("❌ Noto‘g‘ri foydalanuvchi nomi yoki parol!");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>🏫 40-maktab</h1>
        <p>Kirish uchun ma’lumotlaringizni kiriting</p>

        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

        <div className="form-group">
          <label htmlFor="username">Foydalanuvchi nomi</label>
          <input
            type="text"
            id="username"
            placeholder="Ismingizni yozing"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Parol</label>
          <input
            type="password"
            id="password"
            placeholder="Parolni kiriting"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-btn">
          Kirish
        </button>

        <div className="extra-links">
          <a href="#">Parolni unutdingizmi?</a>
        </div>
      </form>
    </div>
  );
}

export default Login;
