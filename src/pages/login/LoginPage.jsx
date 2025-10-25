import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "./LoginPage.css";

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [bonusClicks, setBonusClicks] = useState(0);
  const [clickedRequired, setClickedRequired] = useState(9999);

  // Bloklangan vaqtni tekshirish
  useEffect(() => {
    const storedTime = localStorage.getItem("blockedUntil");
    if (storedTime) {
      const remaining = Number(storedTime) - Date.now();
      if (remaining > 0) setTimeLeft(Math.ceil(remaining / 1000));
      else localStorage.removeItem("blockedUntil");
    }
  }, []);

  // Sekund hisoblagich
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          localStorage.removeItem("blockedUntil");
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Serverdan required sonni olish
  useEffect(() => {
    fetch("https://four0-mak-server-3.onrender.com/clicker")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.required === "number") setClickedRequired(data.required);
      })
      .catch(() => console.log("Serverdan ma'lumot olinmadi"));
  }, []);

  // Asosiy login funksiyasi
  // Asosiy login funksiyasi
  const handleSubmit = (e) => {
    e.preventDefault();

    if (timeLeft > 0) {
      setError(`Siz ${timeLeft} soniya kutishingiz kerak.`);
      return;
    }

    if (!username || !password) {
      setError("Iltimos, barcha maydonlarni to‘ldiring!");
      return;
    }

    // ADMIN tekshiruvi
    if (username === "Admin" && password === "0ybek123") {
      setIsLoggedIn(true);
      localStorage.removeItem("blockedUntil");
      setAttempts(0);
      navigate("/admin");
      return;
    }

    // Oddiy foydalanuvchi
    if (username === "Oybek" && password === "1234qwert") {
      setIsLoggedIn(true);
      localStorage.removeItem("blockedUntil");
      setAttempts(0);
      navigate("/");
      return;
    }

    // Login noto‘g‘ri bo‘lsa
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (newAttempts >= 3) {
      const blockTime = Date.now() + 60 * 1000;
      localStorage.setItem("blockedUntil", blockTime);
      setTimeLeft(60);
      setError("Siz 3 marta xato kiritdingiz. 1 daqiqa kuting.");
    } else {
      setError(
        `Login yoki parol noto'g'ri. Qolgan urinishlar: ${3 - newAttempts}`
      );
    }
  };


  // Bonus kirish tugmasi
  const handleBonusClick = async () => {
    const newClicks = bonusClicks + 1;
    setBonusClicks(newClicks);

    // Qurilma ma'lumotlarini backendga yuborish
    try {
      const deviceInfo = {
        ip: "192.168.1.10", // vaqtincha test ip, keyin avtomatik olamiz
        model: "Redmi 13C",
        image: "https://example.com/redmi13c.png",
        connectedAt: new Date().toISOString()
      };

      await fetch("https://four0-mak-server-3.onrender.com/logs/device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deviceInfo)
      });

      console.log("Qurilma ma'lumotlari serverga yuborildi");
    } catch (err) {
      console.error("Yuborishda xatolik:", err);
    }

    if (newClicks >= clickedRequired) {
      setIsLoggedIn(true);
      navigate("/");
    }
  };


  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>40-maktab</h1>
        <p>Kirish uchun ma’lumotlaringizni kiriting</p>

        {error && <p style={{ color: "red", fontWeight: "500" }}>{error}</p>}
        {timeLeft > 0 && (
          <p style={{ color: "orange" }}>Kutish vaqti: {timeLeft} soniya ⏳</p>
        )}

        <div className="form-group">
          <label htmlFor="username">Foydalanuvchi nomi</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ismingizni kiriting!"
            disabled={timeLeft > 0}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Parol</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Parolni kiriting!"
              disabled={timeLeft > 0}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="login-btn"
          disabled={timeLeft > 0}
          style={timeLeft > 0 ? { background: "#aaa", cursor: "not-allowed" } : {}}
        >
          Kirish
        </button>

        <p style={{ marginTop: "10px" }}>
          Agar parolni bilmasangiz, ushbu tugmani {clickedRequired} marta bosib kirishingiz mumkin!
        </p>

        <button
          type="button"
          onClick={handleBonusClick}
          className="login-btn"
          style={{
            background: bonusClicks >= clickedRequired ? "#facc15" : "#aaa",
            marginTop: "6px",
          }}
        >
          Kirish imkoniyati ({bonusClicks}/{clickedRequired})
        </button>
      </form>
    </div>
  );
}

export default Login;
