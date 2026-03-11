import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Landing_Page } from "./landing_page"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing_Page/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
