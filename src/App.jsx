import { useState } from "react";
import { Routes, Route, Navigate } from "react-router";

import Home from './pages/home/Home.jsx';
import About from './pages/about/About.jsx';
import Contact from './pages/contact/Contact.jsx';
import RootLayout from './layout/RootLayout.jsx';

//  Grade 8a
import Grade8a from './pages/grade8a/Grade8a.jsx';
import GirlsPage8a from './pages/grade8a/Grade8aGirls.jsx';
import BoysPage8a from './pages/grade8a/Grade8aBoys.jsx';

// Grade 8b
import Grade8b from './pages/grade8b/Grade8b.jsx';
import GirlsPage8b from "./pages/grade8b/Grade8bGirls.jsx";
import BoysPage8b from "./pages/grade8b/Grade8bBoys.jsx"

import Grade9a from './pages/grade9a/Grade9a.jsx';
import Grade9b from './pages/grade9b/Grade9b.jsx';

import Login from './pages/login/LoginPage.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Routes>
      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

      {!isLoggedIn ? (
        <Route path="*" element={<Navigate to="/login" replace />} />
      ) : (
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />

          {/* 8a */}
          <Route path="grade/8a" element={<Grade8a />}>
            <Route path="girls" element={<GirlsPage8a />} />
            <Route path="boys" element={<BoysPage8a />} />
          </Route>

          {/* 8b, 9a, 9b */}
          <Route path="grade/8b" element={<Grade8b />}>
            <Route path="girls" element={<GirlsPage8b />} />
            <Route path="boys" element={<BoysPage8b />} />
          </Route>
          <Route path="grade/8b" element={<Grade8b />} />
          <Route path="grade/9a" element={<Grade9a />} />
          <Route path="grade/9b" element={<Grade9b />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;
