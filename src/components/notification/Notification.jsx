import { useEffect } from "react";
import "./Notification.css";

function Notification({ message, type = "success", onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // 3 sekunddan keyin o'chadi

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`notify ${type}`}>
            {message}
        </div>
    );
}

export default Notification;
