import { useState } from "react";
import { useNavigate } from "react-router";
import "./LoginPage.css";

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === "Oybek" && password === "1234") {
      setIsLoggedIn(true);
      navigate("/"); 
    } else {
      setError("Login yoki parol noto‘g‘ri");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>40-maktab</h1>
        <p>Kirish uchun ma’lumotlaringizni kiriting</p>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="form-group">
          <label htmlFor="username">Foydalanuvchi nomi</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ismingizni yozing"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Parol</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Parolni kiriting"
          />
        </div>

        <button type="submit" className="login-btn">Kirish</button>
      </form>
    </div>
  );
}

export default Login;
