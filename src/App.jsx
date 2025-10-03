import { useState, lazy } from "react";
import { Routes, Route, Navigate } from "react-router";

import Home from './pages/home/Home.jsx';
const About = lazy(() => import('./pages/about/About.jsx'));
// import About from './pages/about/About.jsx';
const Contact = lazy(() => import('./pages/contact/Contact.jsx'));
// import Contact from './pages/contact/Contact.jsx';
const RootLayout = lazy(() => import('./layout/RootLayout.jsx'));
// import RootLayout from './layout/RootLayout.jsx';

// Grade import
import GradePage from "./pages/grade/Grade.jsx";
import GirlsPage from "./pages/grade/GradeGirls.jsx";
import BoysPage from "./pages/grade/GradeBoys.jsx";

import Login from './pages/login/LoginPage.jsx';
import NotFoundPage from "./pages/NotFoundPage.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Routes>
      {/* Login sahifa */}
      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

      {!isLoggedIn ? (
        <Route path="*" element={<Navigate to="/login" replace />} />
      ) : (
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />

          <Route path="grade/:gradeId" element={<GradePage />}>
            <Route path="girls" element={<GirlsPage />} />
            <Route path="boys" element={<BoysPage />} />
          </Route>


          <Route path="*" element={<NotFoundPage />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;
