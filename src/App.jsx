import { Routes, Route } from "react-router"
import Home from './pages/home/Home.jsx'
import About from './pages/about/About.jsx'
import Contact from './pages/contact/Contact.jsx'
import RootLayout from './layout/RootLayout.jsx'

import Grade8a from './pages/grade8a/Grade8a.jsx'
import GradeLayout from "./layout/GradeLayout.jsx"


function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path='about' element={<About />} />
          <Route path='contact' element={<Contact />} />

          <Route path='grade' element={<GradeLayout />}>
            <Route path='8a' element={<Grade8a />} />
            {/* <Route path='8b' element={<Grade8b />} /> */}
            {/* <Route path='9a' element={<Grade9a />} /> */}
            {/* <Route path='9b' element={<Grade9b />} /> */}
          </Route>
        </Route>
      </Routes>

    </>
  )
}

export default App
