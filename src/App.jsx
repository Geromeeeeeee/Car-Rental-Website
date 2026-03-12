import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Landing_Page } from "./landing_page"
import { Login } from "./login"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing_Page/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
