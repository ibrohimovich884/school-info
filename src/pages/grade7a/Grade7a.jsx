// import { Link, Routes, Route, Outlet } from "react-router";
// import GirlsPage from "./Grade7aGirls";
// import BoysPage from "./Grade7aBoys";
import "../Grade.css";

const grade = "Grade-7a";

function Grade7a() {
  return (
    <div className="grade8a-container">
      <h1>{grade}</h1>
      <h2>Hozircha malumotlar yoq!</h2>
      <nav>
        <Link to="girls">Girls 👧</Link>
        <Link to="boys">Boys 👦</Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default Grade7a;
