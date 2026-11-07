import BackButton from "../../components/backButton/BackButton.jsx";

function Contact() {
    return (
        <div className="container">
            <BackButton to="/" label="Orqaga" />
            <div className="contact-content">
                <h1>Contact Page</h1>
            </div>
        </div>
    );
}

export default Contact;