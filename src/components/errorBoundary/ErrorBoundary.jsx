import { Component } from "react";
import "./ErrorBoundary.css";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        // Konsolga to'liq xatoni chiqaramiz, kerak bo'lsa shu yerga log yuborish ham qo'shiladi
        console.error("ErrorBoundary ushladi:", error, info);
    }

    handleReload = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <h2>😕 Nimadir noto'g'ri ketdi</h2>
                    <p>Sahifada kutilmagan xatolik yuz berdi.</p>
                    <button onClick={this.handleReload}>Qayta yuklash</button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;