import { Link, Routes, Route, Outlet } from "react-router";
import GirlsPage from "./Grade9dGirls";
import BoysPage from "./Grade9dBoys";
import "../Grade.css";

const grade = "Grade-9d";
function Grade9d() {
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

export default Grade9d