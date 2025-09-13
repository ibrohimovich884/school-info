import { useEffect, useState } from "react";
import "./Grade.css";

function ProfileCard({ info, index, activeIndex, setActiveIndex }) {
  const isActive = activeIndex === index;
  const [cachedInfo, setCachedInfo] = useState(info);

  useEffect(() => {
    const cacheKey = `profile-${info.Name}`;

    // Avval localStorage'dan ma'lumotni o‘qiymiz
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      setCachedInfo(JSON.parse(cachedData));
    } else {
      // Agar yo‘q bo‘lsa, saqlab qo‘yamiz
      localStorage.setItem(cacheKey, JSON.stringify(info));
    }
  }, [info]);

  return (
    <div
      className={`profile-card ${isActive ? "open" : ""}`}
      onClick={() => setActiveIndex(isActive ? null : index)}
    >
      <img
        src={cachedInfo.Image || "https://picsum.photos/200"}
        alt={cachedInfo.Name}
      />
      <div className="profile-info">
        <h2>{cachedInfo.Name}</h2>

        {isActive ? (
          <div className="details">
            <p><strong>Full name:</strong> {cachedInfo["Full name"]}</p>
            <p><strong>Birthday:</strong> {cachedInfo.Birthday}</p>
            <p><strong>For you, Oybek:</strong> {cachedInfo.Relation}</p>
            <p><strong>Gaplashgan:</strong> {cachedInfo.Talked || "Unknown"}</p>
            <p>
              <strong>Instagram:</strong>{" "}
              {cachedInfo.Instagram && cachedInfo.Instagram !== "Unknown" ? (
                <a
                  href={`https://instagram.com/${cachedInfo.Instagram}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {cachedInfo.Instagram}
                </a>
              ) : (
                "Unknown"
              )}
            </p>
          </div>
        ) : (
          <p className="hint">Batafsil ko‘rish uchun bos 👆</p>
        )}
      </div>
    </div>
  );
}

export default ProfileCard;
