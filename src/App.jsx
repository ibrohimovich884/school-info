import { Routes, Route } from "react-router"
import Home from './pages/home/Home.jsx'
import About from './pages/about/About.jsx'
import Contact from './pages/contact/Contact.jsx'
import RootLayout from './layout/RootLayout.jsx'

import Grade8a from './pages/grade8a/Grade8a.jsx'
import Grade8b from './pages/grade8b/Grade8b.jsx'
import Grade9a from './pages/grade9a/Grade9a.jsx'
import Grade9b from './pages/grade9b/Grade9b.jsx'

function App() {

  return (
    <>
      <Routes>
         <Route path='/' element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path='about' element={<About />} />
        <Route path='contact' element={<Contact />} />


        <Route path='grade/8a' element={<Grade8a />} />
        <Route path='grade/8b' element={<Grade8b />} />
        <Route path='grade/9a' element={<Grade9a />} />
        <Route path='grade/9b' element={<Grade9b />} />
      </Route>
      </Routes>

    </>
  )
}

export default App
