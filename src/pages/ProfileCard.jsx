import { useEffect, useState } from "react";
import "./Grade.css";

function ProfileCard({ info, index, activeIndex, setActiveIndex }) {
  const isActive = activeIndex === index;
  const [cachedInfo, setCachedInfo] = useState(info);

  useEffect(() => {
    const cacheKey = `profile-${info.Name}-${info.Birthday}`;

    // Avval sessionStorage'dan ma'lumotni o‘qiymiz
    const cachedData = sessionStorage.getItem(cacheKey);
    if (cachedData) {
      setCachedInfo(JSON.parse(cachedData));
    } else {
      // Agar yo‘q bo‘lsa, saqlab qo‘yamiz
      sessionStorage.setItem(cacheKey, JSON.stringify(info));
    }
  }, [info]);
  console.log(cachedInfo.Image);

  return (
    <div
      className={`profile-card ${isActive ? "open" : ""}`}
      onClick={() => setActiveIndex(isActive ? null : index)}
    >
      <img src={cachedInfo?.Image ||
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAlAMBIgACEQEDEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAAAwQFAgEGB//EADIQAAICAQICCQMDBAMAAAAAAAABAgMEESESMQUTIjJBUVJhcRRCkYGhsTRicqIjU8H/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A/cQAAAI7bYVRcpvRfyBIQXZVVW0pay8kUMjNst2hrCHtzZVAu2dIzb/44qPzuV5ZN8+9bL9NiIAeuTlzbb92ebgAdxtsjyskvhk0M66PN8XyVgBp1dIQltZFwftui3CcZxUotNPxRgnVdk6pcUJNMDeBTxs2NjUbOzN/hlwAAAAAAAHF1kaoOcnokBxk5EKK+KXN8o+ZkXWzulxTe/7IXWytsc5c/wCDgAAAAAAAAAAAAAAF7DzHFqu56x8JPw+SiAPoAZ+Bk8qZvf7WaAAAADJ6Qv623gi+zD92X8y3qaJSXeeyMYAAAAAAElVFlvcjqvPwLWHh8a47o9nwj5mikktEtEgM2HRs335xXxudvo1/9v8AqaAAyLMG6HJKa9is009GtH5H0BBkY1d8e0tJeElzAxgd3VSpnwT5+HucAAAATa5PR+Zs4l3XVKX3LZmMWcC3q70vtls//ANcHh6BmdJz1sjD0rUpEuVLjybH/dp+CIAAABYwaOut1fcju/f2K5rdH18GNF+MtwLKPQAAAAAACvmUddU9F21vFmOfQGNmw6vImlstdUBAAAATaeq5gAbtM+OqM/NanhX6OsX0+jfKTQAzJPik34ttngAAAADbxv6ev/FGIbODLixYey0AnAAAAAAAAMrpP+oX+JqmR0hNSyZafbsBWAAAAAT0W8EGvcEUYtrYAe3R4brF5SOCz0hDhyW/VuVgAAAF3o27hm65PaW6+SkE2mmtmgPoAVMPKVqUZvSz+S2AAAAA5nOMIuU2kkBzfYqqnN+HIxG3JuT5smy8h3z22guSIAAAAAAC9g08dLl/cC3hQ4MaC5arUAQ9J18VcZrnF6foZhvTipwcZLVNaMw7a3VNwlzTA5AAAAlhj22d2uXy1oBEW6c+yGimuNfO5z9DkehflD6HI9K/KAuRz6X3tYv3R087H9f+rKP0OR6F+UPocj0r8oCxZ0jHlXBv3lsUrrrLpa2S18kvAl+hyPSvyh9DkelflAVgTyw8iO7hqvZ6kMk4vSSafk1oB4AAB3RW7bYw9TODR6Mp0TufN7IC8uW2wPQAKfSFHWQ44Ltx8PNFwAfPnVdcrZqEFq3+xczsVxbtrXZfeS8Pcm6OVSp1i9Z/cB3j4ldSTfal5vw+CyAAAAAAAAAAOLK4WR0nFSXudgDJy8N0vjhvX+6KpvySaaa203MeVKnkuvH7S128kBzjUu+xRXd8WbUYqKSjslyRHj0RorUY7vxfmSgAAAAAAo34sq59bi7S8Yl4AVMfMjN8FnYs5aPxLZBfjV395aS9S5lfhy8buvrYLwAvgpw6Qrb4bE4SLMLa592cX8MDsAAAeNpc2l8kNmXRDnYn7LcCc4sshXHWbSRU+rtu2xqn/kxXhOcuPJm5y8lyA5lbbmvgpTjX9zLdFEKIaQW/i/MkilFaJJJeR6AAAAAAAAAAAAAAcTqrmu3BS+UVrMCjTWPFH4YAFO2DqekJzX6kanOXOcvyeAC3RiV26Obk/wBS1DDor5Vp/O56AJktNvI9AAAAAAAAAA//2Q=="} alt={cachedInfo.Name} />

      <div className="profile-info">
        <h2>{cachedInfo.Name}</h2>

        {isActive ? (
          <div className="details">
            <p><strong>Full name:</strong> {cachedInfo["Full name"]}</p>
            <p><strong>Birthday:</strong> {cachedInfo.Birthday}</p>
            <p><strong>Gaplashgan:</strong> {cachedInfo.Talked}</p>
            <p>
              <strong>Instagram: </strong>
              {cachedInfo.Instagram && cachedInfo.Instagram !== "Unknown" ? (
                <a
                  href={`https://instagram.com/${cachedInfo.Instagram}`}
                  target="_blank"
                  rel="noreferrer" >
                  {cachedInfo.Instagram}
                </a>
              ) : (
                " Unknown"
              )}
            </p>
          </div>
        ) : (
          <>
            <p className="hint">Batafsil ko'rish uchun bos 👆</p>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileCard;
