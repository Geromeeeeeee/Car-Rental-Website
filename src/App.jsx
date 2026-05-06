import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Landing_Page} from "./landing_page"
import { Nav } from "./nav";
import { Login } from "./login"
import { useEffect, useState } from "react";
import { Signup } from "./signup";
import { Rental_page } from "./rental_page";
import axios from "axios";
import { Rental_History } from "./rental_history";

function App() {

  const [navDisplay, setNavDisplay] = useState(true)
  const [logged, setLog] = useState(localStorage.getItem("loggedIn") === "true")
  useEffect(()=>{
    const checkLog = async()=>{
      try {
        const stat = await axios.get(
          "http://localhost/Car-Rental-Website/back/session_check.php",
          { withCredentials: true }
        )

        if(stat.data.logged){
          setLog(true)
          localStorage.setItem("loggedIn", "true")
        } else {
          setLog(false)
          localStorage.removeItem("loggedIn")
        }
      } catch (error) {
        setLog(false)
        localStorage.removeItem("loggedIn")
      }
    }
    checkLog()
  },[])

  return (
    <BrowserRouter>
    <Nav navDisplay={navDisplay} logged={logged} setLog={setLog}/>
      <Routes>
        <Route path="/" element={<Landing_Page logged={logged}/>}/>
        <Route path="/login" element={<Login setNavDisplay={setNavDisplay} setLog={setLog}/>}/>
        <Route path="/signup" element={<Signup setNavDisplay={setNavDisplay}/>}/>
        <Route path="/rental" element={<Rental_page setNavDisplay={setNavDisplay}/>}/>
        <Route path="/rental_history" element={<Rental_History setNavDisplay={setNavDisplay}/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App