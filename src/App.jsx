import { Routes, Route } from "react-router";
import Home from './pages/home/Home.jsx';
import About from './pages/about/About.jsx';
import Contact from './pages/contact/Contact.jsx';
import RootLayout from './layout/RootLayout.jsx';

import Grade8a from './pages/grade8a/Grade8a.jsx';
import GirlsPage from './pages/grade8a/Grade8aGirls.jsx';
import BoysPage from './pages/grade8a/Grade8aBoys.jsx';

import Grade8b from './pages/grade8b/Grade8b.jsx';
import Grade9a from './pages/grade9a/Grade9a.jsx';
import Grade9b from './pages/grade9b/Grade9b.jsx';

import Login from './pages/login/LoginPage.jsx'; 
// import NotFound from './pages/NotFound.jsx';

function App() {
  return (
    <Routes>
      {/* Login page */}
      <Route path="/login" element={<Login />} />

      {/* Asosiy layout */}
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />

        {/* 8a */}
        <Route path="grade/8a" element={<Grade8a />}>
          <Route path="girls" element={<GirlsPage />} />
          <Route path="boys" element={<BoysPage />} />
        </Route>

        {/* 8b, 9a, 9b */}
        <Route path="grade/8b" element={<Grade8b />} />
        <Route path="grade/9a" element={<Grade9a />} />
        <Route path="grade/9b" element={<Grade9b />} />

        {/* 404 sahifa */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
