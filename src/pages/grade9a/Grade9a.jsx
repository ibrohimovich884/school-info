import { Link, Routes, Route, Outlet } from "react-router";
import GirlsPage from "./Grade9aGirls";
import BoysPage from "./Grade9aBoys";
import "../Grade.css";
  
const grade = "Grade-9a";
function Grade9a() {
  return (
    <div className="grade8a-container">
      <h1>{grade}</h1>
      <nav>
        <Link to="girls">Girls 👧</Link>
        <Link to="boys">Boys 👦</Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default Grade9a