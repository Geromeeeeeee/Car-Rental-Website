import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Landing_Page} from "./landing_page"
import { About} from "./landing_comp"
import { Nav } from "./landing_comp";
import { Login } from "./login"
import { useState, useEffect } from "react";
import { Signup } from "./signup";

function App() {

  const [navDisplay, setNavDisplay] = useState(true)
  const [logged, setLog] = useState(()=>{
    return localStorage.getItem("loggedIn") === "true"
  })

  return (
    <BrowserRouter>
    <Nav navDisplay={navDisplay} logged={logged} setLog={setLog}/>
      <Routes>
        <Route path="/" element={<Landing_Page logged={logged}/>}/>
        <Route path="/login" element={<Login setNavDisplay={setNavDisplay} setLog={setLog}/>}/>
         <Route path="/signup" element={<Signup setNavDisplay={setNavDisplay}/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
