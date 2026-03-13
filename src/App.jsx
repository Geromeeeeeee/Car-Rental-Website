import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Landing_Page } from "./landing_page"
import { Nav } from "./landing_comp";
import { Login } from "./login"
import { useState } from "react";

function App() {

  const [navDisplay, setNavDisplay] = useState(true)

  return (
    <BrowserRouter>
    <Nav navDisplay={navDisplay}/>
      <Routes>
        <Route path="/" element={<Landing_Page />}/>
        <Route path="/login" element={<Login setNavDisplay={setNavDisplay}/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
