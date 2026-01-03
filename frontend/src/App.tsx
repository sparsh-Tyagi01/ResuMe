import { Route, Routes } from "react-router-dom"
import Mainlayout from "./components/mainlayout"
import Homepage from "./pages/homepage"
import Login from "./components/login"
import Landing from "./components/landing"
import Register from "./components/register"
import Dashboard from "./pages/Dashboard"

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/home" element={<Landing/>}/>
        <Route element={<Mainlayout/>}>
          <Route path="/" element={<Dashboard/>}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App