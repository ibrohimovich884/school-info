import { useNavigate } from "react-router";
import "./BackButton.css";

function BackButton({ to = "/", label = "Orqaga" }) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (to) {
            navigate(to);
        } else if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/");
        }
    };

    return (
        <button
            type="button"
            className="back-btn floating-back-btn"
            onClick={handleClick}
            aria-label={label}
            title={label}
        >
            <span className="back-btn-icon">←</span>
            <span className="back-btn-tooltip">{label}</span>
        </button>
    );
}

export default BackButton;
