import "../index.css";

function NotFoundPage() {
    return (
        <div className="notfound-container">
            <h1 className="notfound-title">404</h1>
            <p className="notfound-text">Kechirasiz, siz izlagan sahifa topilmadi 😢</p>
            <a href="/" className="notfound-btn">Bosh sahifaga qaytish</a>
        </div>
    );
}

export default NotFoundPage;
