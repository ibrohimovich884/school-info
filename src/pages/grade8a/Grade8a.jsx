import { useState } from "react";
import { schoolData } from "../../data";
import "./Grade8a.css";

function Grade8a() {
  const schoolName = "40-maktab";
  const grade = "Grade-8a";

  const girls = schoolData[schoolName][0][grade][0]["Girls"];
  const boys = schoolData[schoolName][0][grade][0]["Boys"];

  // faqat bitta karta ochiq bo‘lishi uchun state
  const [activeIndex, setActiveIndex] = useState(null);

  // Bitta karta component
  const ProfileCard = ({ info, index }) => {
    const isActive = activeIndex === index;

    return (
      <div
        className={`profile-card ${isActive ? "open" : ""}`}
        onClick={() => setActiveIndex(isActive ? null : index)}
      >
        <img
          src={
            info.Image ||
            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAlAMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAAAwQFAgEH/8QANBAAAgIAAwQIBQMFAQAAAAAAAAECAwQRMRIhQWEFEyIyUVJxkRRCgaGxM2JyI5LB0fEk/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/APuIAAAHFlka4uU3kgOyK7EVVd+W/wAFqUMRjZ2ZxrzhH7lUC7Z0hJvKuCS8WV5Ym6Wtry5biIAdOyb1nJ+rPNqXmfueADuN1sdLJ+5NDG3R7zUlzRWAGlVj65bppxfuW4yUlnFprxRhHdVs6pZ1yy5cGBtgq4bGRtexPsz/ACWgAAAAAAAcWTjXByk8kkBzfdCmG1LXgvEyb7p3Tzn9EuAuuldY5y+i8EcAAAAAAAAAAAAAAAvYTGZNV2vPwl/sogDeBRwGJ2v6Vj7S7rfEvAAAAMvpC/bs6uL7MdfUv4m3qqZT48PUxgAAAAAAIpy7qbfIs4XCO7KU21D8mlXXCtZQikBlRwl8lnsZeryOng718q9zWyAGHZXOvvxa9Ucm64prJpNeDKWJwKycqVv8viBngaNpgAAACbi047mnmjZw1quqU1ro/Uxi10dZsXbDe6f5A1AABn9Jz3wrWmWbKJNjJbWJm+C3EIAAACfB0ddZ2u5HXnyIDWwVexh47t8t7AnSyWS0PQAAAAAACh0jRu66C3/MUPQ3ZJSi4vR7jEsjsWSg+DyA5AAA9i3GSa1TzR4eAbtctuCktGszwhwEtrDR5NoAZtzztm/3M4Orf1JfyZyAAAHhvRSUUlokYJuVSU64yXFAdgAAAAAAAGRjllip5ccvwa5j4yW1ibHzyAhAAAAAXcFNxqa/cDnCRbrf8jwCHErZvsT8zIy10jHZvUvMiqAAAA0ujrdqpwz3xf2M07ptlVYpx1X3QG2COm2NsFKD3EgAAAADxtJZtgcXWKquU3wRittvN6ss4zE9dPZj3I6cysAAAAAAaXR8P/Pm+MmeFjDQ2KIR5ACHpGvao2lrDeZhutJpprNMxr6nTa4PTh6ARgAAAdwqss7kGwFVs6pbVby5F+nH1y3WLYfjwKvwV7+RL6ofBYjyr3QGnG2uSzjOL+p65xWsl7mX8Df5V7ofA4jyr3QF6zGUw0ltPwRQxOKsu3Z7MPBHvwN/lXuh8FiPKvdAVwTSwt8d7rf03kLTTyaafMAAABLhq+tujHhq/QiNLo6nYg7JLtS05IC2D0ACtjaOuhnFdqOnMsgDB9Vkz2EJWSUYLNvgX8bhdr+rWnnxSOuj41qrOLTm+9y5Ae4fBQgk7Mpy56ItZZaHoAAAAAAAAAEdtULVlOKZIAMnE4R09qPah48UVzdaz1W4y3h1ZiHCh5x4vwA5wdDus0ewtX/g1kv+HNVcaoKEVuX3OwAAAAAAVbsPJT63DvZnxXCRaAFanFRk9ixbFi3ZPiWSO6mF0cpxz58Sv1eJo/Sl1kfLLUC4CpHGwT2boyrlzLELa592af1A7AAAHjko6tL1IZ4umHzp8lvAnOLLI1x2ptJFbr77f0KtleaZ1DCJy275OyXPRAcOd2LeVaddXGT1ZaqqhVBRgt35OkuR6AAAAAAAAAAAAAAeOKkspJP1IJ4OiXyZegAEUsFXHuysXozxYWMtbLP7gAJI4Chb2pS9WTQoqr7kEvoeACUAAAAAAAAAAf/Z"
          }
          alt={info.Name}
        />
        <div className="profile-info">
          <h2>{info.Name}</h2>

          {isActive ? (
            <div className="details">
              <p><strong>Full name:</strong> {info["Full name"]}</p>
              <p><strong>Birthday:</strong> {info.Birthday}</p>
              <p><strong>For you, Oybek:</strong> {info.Relation}</p>
              <p><strong>Talked:</strong> {info.Talked || "Unknown"}</p>
              <p>
                <strong>Instagram:</strong>{" "}
                {info.Instagram && info.Instagram !== "Unknown" ? (
                  <a
                    href={`https://instagram.com/${info.Instagram}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {info.Instagram}
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
  };

  return (
    <div className="grade-8a">
      <h1>
        {schoolName} – {grade}
      </h1>

      <section>
        <h2>Girls 👧</h2>
        <div className="card-list">
          {girls.map((girlObj, index) => {
            const nameKey = Object.keys(girlObj)[0];
            const info = girlObj[nameKey][0];
            return (
              <ProfileCard
                key={`girl-${index}`}
                info={info}
                index={`girl-${index}`}
              />
            );
          })}
        </div>
      </section>

      <section>
        <h2>Boys 👦</h2>
        <div className="card-list">
          {boys.map((boyObj, index) => {
            const nameKey = Object.keys(boyObj)[0];
            const info = boyObj[nameKey][0];
            return (
              <ProfileCard
                key={`boy-${index}`}
                info={info}
                index={`boy-${index}`}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Grade8a;
