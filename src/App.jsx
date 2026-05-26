import { BrowserRouter, Route, Routes } from "react-router-dom"
import axios from "axios";
import { useEffect, useState } from "react";
import { Landing_Page} from "./landing_page"
import { Nav } from "./nav";
import { Login } from "./login"
import { Signup } from "./signup";
import { Rental_page } from "./rental_page";
import { My_Rentals } from "./rental_history";
import { Payment_Page } from "./payment_page";
import { Rental_History } from "./my_rentals";
import { API_BASE_URL } from "./config";
import { Cars } from "./landing_comp";

function App() {

  const [navDisplay, setNavDisplay] = useState(true)
  const [logged, setLog] = useState(localStorage.getItem("loggedIn") === "true")
  const [search, setSearch] = useState("")
  useEffect(()=>{
    const checkLog = async()=>{
      try {
        const stat = await axios.get(
          `${API_BASE_URL}/back/session_check.php`,
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
    <Nav navDisplay={navDisplay} logged={logged} setLog={setLog} search={search} setSearch={setSearch}/>
      <Routes>
        <Route path="/" element={<Landing_Page logged={logged} search={search}/>}/>
        <Route path="/login" element={<Login setNavDisplay={setNavDisplay} setLog={setLog}/>}/>
        <Route path="/signup" element={<Signup setNavDisplay={setNavDisplay}/>}/>
        <Route path="/rental" element={<Rental_page setNavDisplay={setNavDisplay}/>}/>
        <Route path="/my_rentals" element={<My_Rentals setNavDisplay={setNavDisplay}/>}/>
        <Route path="/rental_history" element={<Rental_History setNavDisplay={setNavDisplay}/>}/>
        <Route path="/payment_form" element={<Payment_Page setNavDisplay={setNavDisplay}/>}/>
        <Route path="/Cars" element={<Cars/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App