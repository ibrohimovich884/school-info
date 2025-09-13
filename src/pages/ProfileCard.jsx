import "./Grade.css";

function ProfileCard({ info, index, activeIndex, setActiveIndex }) {
    const isActive = activeIndex === index;

    return (
        <div
            className={`profile-card ${isActive ? "open" : ""}`}
            onClick={() => setActiveIndex(isActive ? null : index)}
        >
            <img
                src={info.Image || "https://picsum.photos/200"}
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
}

export default ProfileCard;
