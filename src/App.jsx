import { useState } from "react";
import { Routes, Route, Navigate } from "react-router";

import Home from './pages/home/Home.jsx';
import About from './pages/about/About.jsx';
import Contact from './pages/contact/Contact.jsx';
import RootLayout from './layout/RootLayout.jsx';

// Grade 7a
import Grade7a from "./pages/grade7a/Grade7a.jsx";

// Grade 7b
import Grade7b from "./pages/grade7b/Grade7b.jsx"

//  Grade 8a
import Grade8a from './pages/grade8a/Grade8a.jsx';
import GirlsPage8a from './pages/grade8a/Grade8aGirls.jsx';
import BoysPage8a from './pages/grade8a/Grade8aBoys.jsx';

// Grade 8b
import Grade8b from './pages/grade8b/Grade8b.jsx';
import GirlsPage8b from "./pages/grade8b/Grade8bGirls.jsx";
import BoysPage8b from "./pages/grade8b/Grade8bBoys.jsx"

// Grade 9a
import Grade9a from './pages/grade9a/Grade9a.jsx';
import GirlsPage9a from './pages/grade9a/Grade8aGirls.jsx'
import BoysPage9a from './pages/grade9a/Grade8aBoys.jsx'

// Grade 9b
import Grade9b from './pages/grade9b/Grade9b.jsx';
import GirlsPage9b from './pages/grade9b/Grade8bGirls.jsx';
import BoysPage9b from './pages/grade9b/Grade8bBoys.jsx';

// Grade 9d
import Grade9d from './pages/grade9d/Grade9d.jsx';

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

          <Route path="grade/7a" element={<Grade7a />} />
          <Route path="grade/7b" element={<Grade7b />} />

          {/* 8a */}
          <Route path="grade/8a" element={<Grade8a />}>
            <Route path="girls" element={<GirlsPage8a />} />
            <Route path="boys" element={<BoysPage8a />} />
          </Route>

          {/* 8b*/}
          <Route path="grade/8b" element={<Grade8b />}>
            <Route path="girls" element={<GirlsPage8b />} />
            <Route path="boys" element={<BoysPage8b />} />
          </Route>

          {/* 9a */}
          <Route path="grade/9a" element={<Grade9a />}>
            <Route path="girls" element={<GirlsPage9a />} />
            <Route path="boys" element={<BoysPage9a />} />
          </Route>

          <Route path="grade/9b" element={<Grade9b />}>
            <Route path="girls" element={<GirlsPage9b />} />
            <Route path="boys" element={<BoysPage9b />} />
          </Route>

          {/* 9d */}
          <Route path="grade/9d" element={<Grade9d />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;
