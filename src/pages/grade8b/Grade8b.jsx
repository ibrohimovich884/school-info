import { Link, Routes, Route, Outlet } from "react-router";
import GirlsPage from "./Grade8bGirls";
import BoysPage from "./Grade8bBoys";
import "../Grade.css";

const grade = "Grade-8b";

function Grade8b() {
  return (
    <div className="grade8a-container">
      <h1>{grade}</h1>
      <nav>
        <Link to="girls">Girls 👧</Link>
        <Link to="boys">Boys 👦</Link>
      </nav>
      <Outlet />
    </div>)
}

export default Grade8b