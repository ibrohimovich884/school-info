import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { API_URL } from "../../config.js";
import { trackEvent } from "../../utils/tracking.js";
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
  const [clickedRequired] = useState(999);
  const [serverData, setServerData] = useState(null);
  const [serverStatus, setServerStatus] = useState("loading"); // "loading" | "connected" | "error"
  const [serverErrorMsg, setServerErrorMsg] = useState("");

  const loadServerData = () => {
    setServerStatus("loading");
    setServerErrorMsg("");
    setError("");

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);

    fetch(`${API_URL}/updatePass`, { signal: controller.signal })
      .then((res) => {
        clearTimeout(timer);
        if (!res.ok) throw new Error("Server xatosi");
        return res.json();
      })
      .then((data) => {
        setServerData(data);
        setServerStatus("connected");
        setServerErrorMsg("");
      })
      .catch((err) => {
        clearTimeout(timer);
        setServerStatus("error");
        setServerErrorMsg("Serverga ulanib bo‘lmadi (server uyg‘onmoqda). Qayta urinib ko‘ring.");
        console.warn("Login maʼlumot olinmadi:", err?.message || err);
      });
  };

  // Bloklangan vaqtni tekshirish va server ma'lumotini yuklash
  useEffect(() => {
    loadServerData();
  }, []);

  // BLOK vaqtini tekshirish
  useEffect(() => {
    const storedTime = localStorage.getItem("blockedUntil");
    if (storedTime) {
      const remaining = Number(storedTime) - Date.now();
      if (remaining > 0) setTimeLeft(Math.ceil(remaining / 1000));
      else localStorage.removeItem("blockedUntil");
    }
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
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

  // Muvaffaqiyatli kirishni backendga yozib qo'yish (fire-and-forget — login jarayonini bloklamaydi)
  const trackSession = (role) => {
    trackEvent("login", { role }); // role: "admin" | "user"
  };

  // LOGIN SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!serverData) {
      if (serverStatus === "loading") {
        setError("Server uyg‘onmoqda, biroz kuting...");
      } else {
        setError("Server bilan aloqa yo‘q. 'Qayta ulanish' tugmasini bosing.");
      }
      return;
    }

    if (timeLeft > 0) {
      setError(`Siz ${timeLeft} soniya kutishingiz kerak.`);
      return;
    }

    if (!username || !password) {
      setError("Iltimos, barcha maydonlarni to‘ldiring!");
      return;
    }

    const { adminname, adminpassword, username: userU, password: userP } = serverData;

    // ADMIN tekshiruv
    if (username === adminname && password === adminpassword) {
      trackSession("admin");
      setIsLoggedIn(true, "admin");
      navigate("/admin");
      return;
    }

    // ODDIY USER tekshiruv
    if (username === userU && password === userP) {
      trackSession("user");
      setIsLoggedIn(true, "user");
      navigate("/");
      return;
    }

    // NOTO‘G'RI LOGIN
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (newAttempts >= 3) {
      const blockTime = Date.now() + 60 * 1000;
      localStorage.setItem("blockedUntil", blockTime);
      setTimeLeft(60);
      setError("3 marta xato! 1 daqiqa kuting.");
    } else {
      setError(`Noto‘g‘ri. Qolgan urinishlar: ${3 - newAttempts}`);
    }
  };


  // Bonus kirish tugmasi
  const handleBonusClick = async () => {
    const newClicks = bonusClicks + 1;
    setBonusClicks(newClicks);

    // Qurilma ma'lumotlarini backendga yuborish
    try {
      const rawIp = import.meta.env.VITE_DEVICE_IP || "";
      const validIp = (rawIp && !rawIp.startsWith("http")) ? rawIp : "192.168.1.10";

      const deviceInfo = {
        ip: validIp,
        model: "Redmi 13C",
        image: "https://example.com/redmi13c.png",
        connectedAt: new Date().toISOString()
      };

      await fetch(`${API_URL}/logs/device`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deviceInfo)
      });

      console.log("Qurilma ma'lumotlari serverga yuborildi");
    } catch {
      // Server uxlayotgan yoki ulanmagan bo'lsa xatolik dasturga xalaqit bermaydi
    }

    if (newClicks <= clickedRequired) {
      setIsLoggedIn(true, "user");
      navigate("/");
    }
  };


  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>40-maktab</h1>
        <p>Kirish uchun ma’lumotlaringizni kiriting</p>

        {serverStatus === "loading" && (
          <div className="server-status-box loading">
            <span className="spinner-dot"></span>
            <span>Server bilan aloqa o‘rnatilmoqda...</span>
          </div>
        )}

        {serverStatus === "error" && (
          <div className="server-status-box error">
            <p style={{ margin: 0 }}>⚠️ {serverErrorMsg || "Serverga ulanib bo‘lmadi"}</p>
            <button
              type="button"
              className="server-retry-btn"
              onClick={loadServerData}
            >
              🔄 Qayta ulanish
            </button>
          </div>
        )}

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